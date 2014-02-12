define(['../resources'], function() {

    var brewery = angular.module("dl.brewery", ["dl.resources",'google-maps','ngGPlaces',]);

    brewery.controller("BreweryController", 
        ['$scope', '$translate', 'DLHelper', 'Brewery','$location','Cache', '$log', 'Responsive','RatingService',
        function($scope, $translate, DLHelper, Brewery,$location,Cache, $log, Responsive,RatingService) {

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
                    }
                ]
            };
    }]);

    brewery.controller("BreweryDetailController", 
                ['$scope', 'Brewery','$routeParams', 'Rating', 'DLHelper', '$filter', 
                'MainTitle','CellarService','RatingService', 'YesNo', 'Beer', '$translate', 'Responsive',
                'ngGPlacesAPI',
        function( $scope,   Brewery,  $routeParams,   Rating,   DLHelper,   $filter, 
            MainTitle, CellarService, RatingService, YesNo, Beer, $translate, Responsive,
            ngGPlacesAPI) {

            $scope.points = [{
                latitude: 41.38623,
                longitude: 2.15978999999993,
                showWindow: false,
                title: 'Este'
            }];
            //Map Section
            $scope.map = {
                center: {
                    latitude: 41.38623,
                    longitude: 2.15978999999993,
                },
                zoom: 8,
                events: {
                    tilesloaded: function (map) {
                        $scope.$apply(function () {
                            $scope.myMap = map;
                            $scope.$log.info('this is the map instance', map);
                            ngGPlacesAPI.textSearch({latitude: 41.38623,longitude: 2.15978999999993, query:'BierCab'}).then(
                                function (data) {
                                    $scope.points = data;
                                    console.log(data);
                                    return data;
                                }
                            );
                        });
                    }
                }
            };
            

            $scope.brewery = Brewery.get({_id: $routeParams.brewery_id}, function() {
                MainTitle.add($scope.brewery.name);
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
                ['$scope', 'Brewery','$routeParams', 'Rating', 'DLHelper', '$filter', 
                'MainTitle','CellarService','RatingService', 'YesNo', 'Beer', '$translate', 'Responsive',
                'ngGPlacesAPI',
        function( $scope,   Brewery,  $routeParams,   Rating,   DLHelper,   $filter, 
            MainTitle, CellarService, RatingService, YesNo, Beer, $translate, Responsive,
            ngGPlacesAPI) {

            $scope.points = [];
            //Map Section
            $scope.map = {
                center: {
                    latitude: 41.386597,
                    longitude: 2.173906
                },
                zoom: 8,
                events: {
                    tilesloaded: function (map) {
                        $scope.$apply(function () {
                            $scope.myMap = map;
                            $scope.$log.info('this is the map instance', map);
                            // ngGPlacesAPI.textSearch({latitude: 41.386597,longitude: 2.173906,  query:'BierCab'}).then(
                            //     function (data) {
                            //         $scope.points = data;
                            //         console.log(data);
                            //         return data;
                            //     }
                            // );
                        });
                    }
                }
            };

            $scope.searchLocation = function($event,searchText) {
                if ( $event.keyCode == 13 ) {
                    ngGPlacesAPI.textSearch({latitude: 41.386597,longitude: 2.173906, query:searchText}).then(
                        function (data) {
                            $scope.points = data;
                            angular.forEach($scope.points, function(c) {
                                c.latitude = c.geometry.location.d;
                                c.longitude = c.geometry.location.e;
                            });
                            console.log(data);
                            return data;
                        },
                        function(err) {
                            $scope.points = [];
                            console.log(err);
                        }
                    );
                }
            };
            

            $scope.brewery = Brewery.get({_id: $routeParams.brewery_id}, function() {
                MainTitle.add($scope.brewery.name);
                $scope.$on("$destroy", function() {
                    MainTitle.clearAdd();
                });
                
            });

    }]);
});