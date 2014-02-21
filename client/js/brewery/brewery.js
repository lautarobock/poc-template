define(['../resources','util/maps','util/misc'], function() {

    var brewery = angular.module("dl.brewery", ["dl.resources",'google-maps','dl.maps','ngRoute','dl.misc']);



    brewery.filter("validComponent", function() {
        return function(rows, location) {
            if ( !location ) return rows;
            var result=[];
            var insert = false;
            angular.forEach(rows, function(r) {
                if ( !insert && util.Arrays.cross(r.types, location.types).length != 0 ) {
                    insert = true;
                }
                if ( insert ) {
                    result.push(r);
                }
            });
            if ( result.length == 0 ) {
                return rows;
            } else {
                return result;
            }
        };
    });

    brewery.controller("BreweryController", 
        ['$scope', '$translate', 'Brewery', 'Responsive',
        function($scope, $translate, Brewery, Responsive) {

            $scope.config = {
                data: Brewery,
                name: $translate('beer.data.brewery')+'s',
                singular: $translate('beer.data.brewery'),
                filterLabel: $translate('side.search'),
                filterColSpan: 6,
                orderBy: 'name',
                orderDir: "",
                pageSize: Responsive.isXs() || Responsive.isSm() ? 10 : 25,
                emptyResultText: $translate('beer.search.emtpy'),
                headers: [{
                        field:'name',
                        caption: $translate('beer.data.brewery'),
                        type: 'link',
                        class: function() {return "dl-font-bold";},
                        href: function(row) {return '#/brewery/detail/' + row._id;}
                    },{
                        field:'locality',
                        caption: $translate('brewery.data.location.address.locality')
                    },{
                        field:'country',
                        caption: $translate('brewery.data.location.address.country')
                    }
                ]
            };
    }]);

    brewery.controller("BreweryDetailController", 
                ['$scope', 'Brewery','$routeParams', 'DLHelper', 'MainTitle', 'Beer', '$translate', 'Responsive', 'MapFactory',
        function( $scope,   Brewery,  $routeParams,  DLHelper, MainTitle,  Beer, $translate, Responsive, MapFactory) {

            $scope.map = MapFactory.map({zoom:14});

            $scope.brewery = Brewery.get({_id: $routeParams.brewery_id}, function() {
                
                MainTitle.add($scope.brewery.name);
                if ( $scope.brewery.location && $scope.brewery.location.latitude ) {
                    $scope.map.centerAt(angular.copy($scope.brewery.location));
                    $scope.map.addPoint($scope.brewery.location);    
                }

                $scope.$on("$destroy", function() {
                    MainTitle.clearAdd();
                });
                
            });

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

            $scope.configBeers = {
                collection: Beer.query({brewery: $routeParams.brewery_id}),
                name: $translate('beer.data.beer')+'s',
                singular: $translate('beer.data.beer'),
                filterLabel: $translate('side.search'),
                filterColSpan: 6,
                orderBy: 'name',
                orderDir: "",
                pageSize: Responsive.isXs() || Responsive.isSm() ? 10 : 25,
                emptyResultText: $translate('beer.search.emtpy'),
                headers: [{
                        field:'name',
                        caption: $translate('beer.data.beer'),
                        type: 'link',
                        class: function() {return "dl-font-bold";},
                        href: function(row) {return '#/beer/detail/' + row._id;}
                    },{
                        field:'style.name',
                        caption: $translate('beer.data.style')
                    },{
                        field:'category.name',
                        caption: $translate('beer.data.category'),
                        hidden: {xs: true,sm: true}
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
                        field:'score',
                        caption: 'G / S',
                        width: '9em',
                        headerStyle: {'text-align': 'center','min-width': '9em'},
                        tooltip: $translate('beer.data.score.gs.help'),
                        valueTemplateUrl: 'score.html',
                        sort: sortScoreStyle
                    }
                ]
            };

    }]);

    brewery.controller("BreweryEditController", 
                ['$scope', 'Brewery','$routeParams', 'MainTitle', 'MapFactory', 'MapSearch', 'MapHelper', 'MapIcon','$timeout',
        function( $scope, Brewery, $routeParams, MainTitle, MapFactory, MapSearch, MapHelper, MapIcon, $timeout) {

            $scope.cancel = function() {
                window.history.back();
            };

            $scope.save = function() {
                $scope.brewery.$save(function() {
                    window.history.back();
                });
            };

            //Map Section
            $scope.map = MapFactory.map({
                fit:true
            });

            $scope.map.onClick().then(function(point) {
//                $scope.brewery.location = point;
            },function(point) {
//                $scope.brewery.location = point;
            },function(point) {
                $scope.brewery.location = point;
            });

            $scope.searchLocation = function($event,searchText) {
                if ( $event.keyCode == 13 ) {
                    $scope.map.fit = true;
                    MapSearch.textSearch(searchText, function(data) {
                        $scope.map.setPoints(data);
                        $timeout(function() {
                            $scope.map.fit = false;
                        },100)
                    })
                }
            };

            $scope.$watch("brewery.location", function(value, old) {
                if ( old ) {
                    old.icon = null;
                }
                if ( value ) {
                    value.icon = MapIcon.bar();
                }
                $scope.selectPoint(value);
            });

            $scope.selectPoint = function(point) {
                $scope.$log.info("point", point);
                if ( point ) {
                    MapSearch.geocode(point).then(function(results) {
                            $scope.$log.debug("geocode", results);
                            $scope.brewery.address_components = results[0].address_components;
                        }, function(cause) {
                            $scope.$log.error("Geocode was not successful for the following reason: " + status);
                            $scope.brewery.address_components = [];    
                        }
                    );
                } else {
                    $scope.brewery.address_components = [];  
                }
                
            };
            
            $scope.brewery = Brewery.get({_id: $routeParams.brewery_id}, function() {
                MainTitle.add($scope.brewery.name);
                $scope.$on("$destroy", function() {
                    MainTitle.clearAdd();
                });
                if ( $scope.brewery.location && $scope.brewery.location.latitude ) {
                    $scope.map.addPoint($scope.brewery.location);
                } else {
                    $scope.$watch("position.coords", function(value) {
                        $scope.map.centerAt(value);
                    });
                }
            });

    }]);
});