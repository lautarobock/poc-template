define(['../resources'], function() {
	
	var beer = angular.module("dl.beer", ["dl.resources"]);

	beer.controller("BeerController", ['$scope', 'Beer', '$translate', 'DLHelper','Style', 'Category','Brewery',
        function($scope, Beer, $translate, DLHelper, Style, Category, Brewery) {
    
            function sortScore(beer) {
                if ( beer.score ) {
                    return beer.score.avg || 0;    
                }
                return 0;
            }
            function sortScoreStyle(beer) {
                if ( beer.score ) {
                    return beer.score.style || 0;    
                }
                return 0;   
            }
            function sortOverall(beer) {
                if ( beer.score ) {
                    return beer.score.overall || 0;    
                }
                return 0;   
            }
            function sortMyScore(beer) {
                return $scope.dataHelper.getMyScore(beer)||0;
            }
    
            $scope.dataHelper = {
                getMyScore: function(beer) {
                    var sum = 0;
                    var count = null;
                    if ( !$scope.user ) return '-';
                    angular.forEach($scope.user.ratings, function(r) {
                        if ( r.beer == beer._id ) {
                            count = 0;
                            angular.forEach(r.finalScore, function(s) {
                                sum += s;
                                count++;
                            });
                        }
                    });

                    if ( count == 0 ) {
                        //Significa que la tome pero no la ranquie
                        return -1;
                    } else if ( count != null ) {
                        //si tiene cualquier otro valor es q tiene ranquint
                        return parseFloat((sum/count).toFixed(1));
                    } else {
                        //si esta null es que no la tome siquiera
                        return null;
                    }
                    if ( count != 0 ) {
                        return parseFloat((sum/count).toFixed(1));
                    } else {
                        return null;
                    }
                }
            };
    
            $scope.config = {
                data: Beer,
                name: $translate('beer.data.beer')+'s',
                singular: $translate('beer.data.beer'),
                filterLabel: $translate('side.search'),
                filterColSpan: 6,
                filterOrder: ['brewery._id','style._id', 'category._id'],
                orderBy: 'score.avg',
                orderDir: "-",
                // pageSize: 20,
                sort: [sortOverall,sortScore],
                headers: [{
                        field:'name',
                        caption: $translate('beer.data.beer'),
                        type: 'link',
                        class: function() {
                            return "dl-font-bold";
                        },
                        href: function(row) {
                            return '#/beer/detail/' + row._id;
                        }
                    },{
                        field:'brewery.name',
                        caption: $translate('beer.data.brewery')
                    },{
                        field:'style.name',
                        caption: $translate('beer.data.style')
                    },{
                        field:'category.name',
                        caption: $translate('beer.data.category')
                    },{
                        field:'score.avg',
                        caption: $translate('beer.data.score'),
                        width: '7em',
                        tooltip: $translate('beer.data.score.help'),
                        class: function(beer) {
                            if ( beer.score ) {
                                return 'badge alert-' + DLHelper.colorByScore(beer.score.avg);        
                            } else {
                                return 'badge';
                            }
                        },
                        sort: [sortOverall,sortScore]
                    },{
                        field:'score.style',
                        caption: 'G / S',
                        width: '9em',
                        headerStyle: {'text-align': 'center'},
                        tooltip: $translate('beer.data.score.gs.help'),
                        valueTemplateUrl: 'beer/list/score.html',
                        sort: sortScoreStyle
                    },{
                        field:'score.count',
                        caption: $translate('beer.data.score.count.short'),
                        tooltip: $translate('beer.data.score.count.help')
                    },{
                        field:'score.myScore',
                        caption: $translate('beer.data.score.my'),
                        tooltip: $translate('beer.data.score.my.help'),
                        valueTemplateUrl: 'beer/list/my-score.html',
                        class: function(beer) {
                            if ( beer.score ) {
                                return 'badge alert-' + DLHelper.colorByScore(beer.score.avg);        
                            } else {
                                return 'badge';
                            }
                        },
                        sort: sortMyScore
                    }
                ]
            };

            $scope.filterData = {};
            $scope.filterData['style._id'] = {
                caption: $translate('beer.data.style'),
                type: 'combo',
                groupBy: function(value) {
                    return value.category._id + '-' + value.category.name;
                },
                comparator: 'equal',
                getLabel: function(value) {
                    return value.name + ' (' + value._id.toUpperCase() + ')';
                },
                valueKey: '_id',
                ignoreCase: false,
                data: Style.query(),
                orderBy: '_id'
            };
            $scope.filterData['category._id'] = {
                caption: $translate('beer.data.category'),
                type: 'combo',
                comparator: 'equal',
                getLabel: function(value) {
                    return value._id + '-   ' + value.name;
                },
                valueKey: '_id',
                ignoreCase: false,
                data: Category.query(),
                orderBy: '_id'
            };
            $scope.filterData['brewery._id'] = {
                caption: $translate('beer.data.brewery'),
                type: 'combo',
                comparator: 'equal',
                getLabel: function(value) {
                    return value.name;
                },
                valueKey: '_id',
                ignoreCase: false,
                data: Brewery.query(),
                orderBy: 'name'
            };

        }]);

	beer.controller("NewStyleByLabelController", function($scope, $modalInstance, StyleByLabel) {
		$scope.styleByLabel = new StyleByLabel();
		$scope.ok = function () {
		    $modalInstance.close($scope.styleByLabel);
		};
		$scope.cancel = function () {
		    $modalInstance.dismiss('cancel');
		};
	});

	beer.controller("NewBreweryController", function($scope, $modalInstance, Brewery) {
		$scope.brewery = new Brewery();
		$scope.ok = function () {
		    $modalInstance.close($scope.brewery);
		};
		$scope.cancel = function () {
		    $modalInstance.dismiss('cancel');
		};
	});

	beer.controller("BeerEditController", 
		        ['$scope', 'Beer','$routeParams', 'Style', 'StyleByLabel', '$location', '$modal', 'Brewery', '$rootScope', '$timeout', '$q','Category',
		function( $scope,   Beer,  $routeParams,   Style,   StyleByLabel,   $location,   $modal,   Brewery,   $rootScope,   $timeout,   $q,  Category) {
			
			//Load combos and beer			
			$q.all([
				Style.query().$promise, 
				StyleByLabel.query().$promise, 
				Brewery.query().$promise,
                Category.query().$promise])
					.then(function(result) {
						$scope.styles = result[0];
						$scope.stylesByLabel = result[1];
						$scope.breweries = result[2];
                        $scope.categories = result[3];

						//Load Beer o create New (After wait for load all combos)
						if ( $routeParams.beer_id ) {
							$scope.beer = Beer.get({_id: $routeParams.beer_id});	
						} else {
							$scope.beer = new Beer();
						}
			});

			$scope.openNewBrewery = function () {
				var modalInstance = $modal.open({
				  	templateUrl: 'beer/brewery.html',
				  	controller: 'NewBreweryController'
				});

				modalInstance.result.then(function (brewery) {
				  	brewery._id = brewery.name.replace(/[^a-z0-9]/ig, '');
				  	
				  	brewery.$save(function(saved) {
						$scope.breweries = Brewery.query(function() {
							$timeout(function() {
								$scope.beer.brewery = saved._id;
							},100);
							
						});
					});

				});
			};

			$scope.openNewStyleByLabel = function () {
				var modalInstance = $modal.open({
				  	templateUrl: 'beer/style-by-label.html',
				  	controller: 'NewStyleByLabelController'
				});

				modalInstance.result.then(function (styleByLabel) {
				  	console.log("StyleByLabel",styleByLabel);
				  	styleByLabel._id = styleByLabel.name.replace(/[^a-z0-9]/ig, '');
				  	styleByLabel.$save(function(saved) {
						$scope.stylesByLabel = StyleByLabel.query(function() {
							$timeout(function() {
								$scope.beer.styleByLabel = saved._id;
							},100);
						});
					});
				});
			};

			//Save
			$scope.save = function() {
				if ( !$scope.beer._id ) {
					$scope.beer._id = $scope.beer.name.replace(/[^a-z0-9]/ig, '') + "-" + new Date().getTime();
				}
				$scope.beer.$save(function(beer) {
					$location.path('/beer/detail/' + beer._id);
				});
			};

            $scope.formatBrewerySelection = function(brewery_id, breweries) {
                if ( !breweries ) return null;
                var filtered = util.Arrays.filter(breweries, function(item) {
                    return item._id == brewery_id ? 0 : -1;
                });
                if ( filtered.length > 0 ) {
                    return filtered[0].name;
                } else {
                    return null;
                }
            };


	}]);

	beer.controller("BeerDetailController", 
		        ['$scope', 'Beer','$routeParams', 'Style', 'StyleByLabel', '$location', '$modal', 'Rating', 'DLHelper', '$filter',
		function( $scope,   Beer,  $routeParams,   Style,   StyleByLabel,   $location,   $modal,   Rating,   DLHelper,   $filter) {

			//Load Styles
			$scope.styles = Style.query();
			$scope.stylesByLabel = StyleByLabel.query();

			$scope.beer = Beer.get({_id: $routeParams.beer_id, populate:true}, function() {
                $scope.ratings = Rating.getByBeer({beer_id:$scope.beer._id});
            });

            $scope.vintageTooltip = function(rating) {
                if ( rating.bottled ) {
                    var dateFormat = $filter('date');
                    var bot = new Date(rating.bottled).getTime();
                    var drink = new Date(rating.date).getTime();
                    var time = drink - bot;
                    console.log("time", time);
                    var anos = time / (1000*60*60*24*365);
                    var rest = anos - Math.floor(anos);
                    rest = Math.ceil(rest *12);
                    if ( rest == 12 )  {
                        anos++;
                        rest = 0;
                    }
                    if ( anos > 1 ) {
                        var resp = 'Embotellada en ' + dateFormat(rating.bottled,'dd/MM/yyyy') + ' tomada con ' + Math.floor(anos) + ' años';
                        if ( rest != 0 ) {
                             resp += 'y ' + rest + ' meses';
                        }
                        return resp;
                    } else {
                        return 'Embotellada en ' + dateFormat(rating.bottled,'dd/MM/yyyy') + ' tomada con ' + rest + ' meses';
                    }
                } else {
                    return null;
                }
            };

            $scope.scoreClass = function(score) {
                return 'alert-' + DLHelper.colorByScore(score);
            };

	}]);


	/*
	 * Directives
	 */
	beer.directive("beerDetail", function() {
		return {
			restrict : 'A',
            scope : {
                beer: '=beerDetail'
            },
            templateUrl: 'beer/beer-detail-directive.html',
            controller: function($scope, DLHelper) {

                $scope.values = ['abv','ibu','og','fg'];
                $scope.units = {
                    abv: '%'
                };

                $scope.showValues = function(beer) {
                    var show = false;
                    angular.forEach($scope.values, function(v) {
                        show = show || beer[v];
                    });
                    return show;
                };

            	$scope.scoreClass = function(score) {
            		return 'text-' + DLHelper.colorByScore(score);
            	}
            }
		};
	});

    beer.directive("beerPercentil", function() {
        return {
            scope: {
                beer:'=beerPercentil'
            },
            template: '<span><span tooltip="{{tooltipG}}" class="dl-score-overall">{{beer.score.overall||"-"}}</span>'+
                '<span tooltip="{{tooltipS}}" class="dl-score-style">{{beer.score.style||"-"}}</span>' +
                '<span tooltip="{{tooltipC}}" class="dl-score-category">{{beer.score.category||"-"}}</span></span>',
            controller: ['$scope', '$translate',function($scope, $translate) {
                $scope.tooltipG = $translate('beer.data.score.overall');
                $scope.tooltipS = $translate('beer.data.score.style');
                $scope.tooltipC = $translate('beer.data.score.category');
            }]
        };
    });

	return beer;
});