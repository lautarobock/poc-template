define(["rating/rating","resources"], function() {

    var rating = angular.module("dl.rating", ['dl.resources']);



    rating.controller("RatingEditController", [
        '$scope', '$routeParams', 'Rating', '$location', 'Beer', '$translate', 
        'DLHelper', 'RatingService','MapFactory', 'MapSearch', 'MapHelper', 'MapIcon', '$timeout',
        function($scope, $routeParams, Rating, $location, Beer, $translate, 
            DLHelper,RatingService, MapFactory, MapSearch, MapHelper, MapIcon, $timeout) {

            $scope.initialScore = null;

            //Map Section
            $scope.map = MapFactory.map();
            
            $scope.map.onClick().then(function(point) {
            },function(point) {
            },function(point) {
                $scope.rating.location = point;
            });

            $scope.selectPoint = function(point) {
                $scope.$log.info("point", point);
                if ( point ) {
                    MapSearch.geocode(point).then(function(results) {
                            $scope.rating.address_components = results[0].address_components;
                        }, function(cause) {
                            $scope.rating.address_components = [];
                        }
                    );
                } else {
                    $scope.rating.address_components = [];
                }
            };
            $scope.searchLocation = function($event,searchText) {
                if ( $event.keyCode == 13 ) {
                    $event.preventDefault();
                    $event.stopPropagation();
                    $scope.map.fit = true;
                    MapSearch.textSearch(searchText, function(data) {
                        $scope.map.setPoints(data);
                        $timeout(function () {
                            $scope.map.fit = false;
                        },100);
                    })
                }
            };

            $scope.$watch("user._id", function(user_id) {
                if ( user_id ) {
                    //Load or create Rating
                    if ( $routeParams.rating_id ) {
                        $scope.rating = Rating.get({_id: $routeParams.rating_id}, function() {
                            $scope.initialScore = $scope.rating.finalScore;
                            loadBeer();
                            if ( $scope.rating.location && $scope.rating.location.latitude ) {
                                $scope.map.addPoint($scope.rating.location);
                                $scope.map.centerAt(angular.copy($scope.rating.location));
                            } else {
                                $scope.$watch("position.coords", function(value) {
                                    $scope.map.centerAt(value);
                                });
                            }
                        });
                    } else {
                        $scope.rating = new Rating();
                        $scope.rating.beer = $location.search().beer_id;
                        $scope.rating.user = $scope.user._id;
                        $scope.rating.date = new Date();
                        loadBeer();
                    }
                    $scope.$watch("rating.location", function(value, old) {
                        if ( old ) {
                            old.icon = null;
                        }
                        if ( value ) {
                            value.icon = MapIcon.beer();
                        }
                        $scope.selectPoint(value);
                    });
                }
            });

            $scope.tmpScore = {};
            $scope.tmpFinal = null;
            $scope.toggleScore = function() {
                if ( $scope.rating.score ) {
                    $scope.tmpScore = $scope.rating.score;
                    $scope.tmpFinal = $scope.rating.finalScore;
                    $scope.rating.score = null;
                    $scope.rating.finalScore = null;
                } else {
                    $scope.rating.score = $scope.tmpScore;
                    $scope.rating.finalScore = $scope.tmpFinal;
                    $scope.tmpScore = null;
                    $scope.tmpFinal = null;
                }
            }

            $scope.scoreType = [{
                name: 'appearance',
                max: 3
            },{
                name: 'aroma',
                max: 12
            },{
                name: 'flavor',
                max: 20
            },{
                name: 'mouthfeel',
                max: 5
            },{
                name: 'overall',
                max: 10
            }];

            $scope.over = {};
            $scope.hoveringOver = function(value,type) {
                $scope.over[type] = value;
            };
            
            function loadBeer() {
                $scope.beer = Beer.get({_id: $scope.rating.beer, populate:true});

                $scope.$watch("rating.score", function(score) {
                    if ( score ) {
                        var sum = 0;
                        angular.forEach($scope.scoreType, function(t) {
                            sum +=  parseInt($scope.rating.score[t.name]) || 0;
                        });
                        $scope.rating.finalScore = sum;
                    }
                }, true);
            }

            $scope.typeBar = function(score) {
                return DLHelper.colorByScore(score);
            };

            $scope.valueBar = function(score) {
                if ( score <= 13 ) return $translate('rating.data.score.problematic');
                if ( score <= 20 ) return $translate('rating.data.score.fair');
                if ( score <= 29 ) return $translate('rating.data.score.good');
                if ( score <= 37 ) return $translate('rating.data.score.veryGood');
                if ( score <= 44 ) return $translate('rating.data.score.excellent');
                return $translate('rating.data.score.outstanding');
            };

            $scope.array = function(from, to) {
                var values = [];
                for ( var i=from; i<=to; i++ ) {
                    values.push(i);
                }
                return values;
            };

            $scope.opened = {
                date: false,
                bottled: false,
                expiration: false
            };
            
            $scope.openDate = function($event, type) {
                $event.preventDefault();
                $event.stopPropagation();

                $scope.opened[type] = true;
            };

            $scope.save = function() {

                $scope.rating.$save(function(rating) {
                    RatingService.loadMyRatings();
                    window.history.back();
                });

            };


        }]);

    rating.controller("RatingBeerController", [
        '$scope', 'Rating','$filter', '$translate','DLHelper', 'Responsive','RatingService', 'Cache',
        function($scope,Rating,$filter,$translate,DLHelper,Responsive, RatingService,Cache) {
            
            $scope.styles = {};
            Cache.styles(function(styles) {
                angular.forEach(styles, function(style) {
                    $scope.styles[style._id] = style;
                });
            });

            // $scope.$watch("user._id", function(user_id) {
            //     if ( user_id ) {
            //         loadData();
            //     }
            // });
            loadData();

            function loadData() {
                $scope.config = {
                    data: Rating,
                    collection: RatingService.ratings(),
                    name: "Calificaciones",
                    singular: "Calificacion",
                    orderBy: "date",
                    orderDir: "-",
                    pageSize: Responsive.isXs() || Responsive.isSm() ? 10 : 25,
                    headers: [{
                            field:'beer.name',
                            caption: 'Cerveza',
                            type: 'link',
                            href: function(row) {return '#/beer/detail/' + row.beer._id;}
                        },{
                            field: 'beer.style',
                            caption: 'Estilo',
                            title: function(rating) {
                                return rating ? $scope.styles[rating.beer.style].name : null;

                            },
                            format: function(value) {
                                
                                return value.toUpperCase();
                            }
                        },{
                            field:'score.appearance',
                            caption: $translate('rating.data.appearance.short'),
                            tooltip: $translate('rating.data.appearance'),
                            hidden: {xs: true,sm: true}
                        },{
                            field:'score.aroma',
                            caption: $translate('rating.data.aroma.short'),
                            tooltip: $translate('rating.data.aroma'),
                            hidden: {xs: true,sm: true}
                        },{
                            field:'score.flavor',
                            caption: $translate('rating.data.flavor.short'),
                            tooltip: $translate('rating.data.flavor'),
                            hidden: {xs: true,sm: true}
                        },{
                            field:'score.mouthfeel',
                            caption: $translate('rating.data.mouthfeel.short'),
                            tooltip: $translate('rating.data.mouthfeel'),
                            hidden: {xs: true,sm: true}
                        },{
                            field:'score.overall',
                            caption: $translate('rating.data.overall.short'),
                            tooltip: $translate('rating.data.overall'),
                            hidden: {xs: true,sm: true}
                        },{
                            field:'finalScore',
                            caption: $translate('beer.data.finalScore.short'),
                            tooltip: $translate('beer.data.finalScore.help'),
                            class: function(rating) {
                                if ( rating.finalScore ) {
                                    return 'badge alert-' + DLHelper.colorByScore(rating.finalScore);   
                                } else {
                                    return 'badge';
                                }
                            },
                            sort: function (rating) {
                                return rating.finalScore || 0;
                            }
                        },{
                            field:'beer.score',
                            caption: 'G / S',
                            width: '9em',
                            headerStyle: {'text-align': 'center','min-width': '9em'},
                            tooltip: $translate('beer.data.score.gs.help'),
                            valueTemplateUrl: 'score.html'
                        },{
                            field:'date',
                            caption: 'Fecha',
                            width: '7em',
                            format: function(value) {
                                return $filter('date')(value,'dd-MM-yyyy');
                            }
                        },{
                            field:'location.name',
                            caption: $translate('brewery.data.location')
                        }
                    ]
                };
            }


        }]);


    rating.factory("RatingService", ['Rating',function(Rating) {
        var ratings = [];
        return {
            ratings: function() {
                return ratings;
            },
            loadMyRatings: function(cb) {
                ratings = Rating.query(cb);
            },
            avgForBeer: function(beer) {
                var sum = 0;
                var count = 0;
                var found = false;
                angular.forEach(ratings, function(rating) {
                    if ( rating.beer._id == beer._id ) {
                        found = true;
                        if ( rating.finalScore ) {
                            sum+= rating.finalScore;
                            count++;    
                        }
                    }
                    
                });
                if ( count != 0 ) {
                    return sum/count;
                } else if ( found ) {
                    return -1;
                } else {
                    return null;
                }
            }
        };
    }]);

    return rating;

});