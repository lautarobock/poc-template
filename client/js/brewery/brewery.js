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

            //Map Section
            $scope.map = {
                center: {
                    latitude:0,
                    longitude:0
                },
                zoom: 14
            };

            // $scope.$watch("position.coords", function(value) {
            //     $scope.map.center = value;
            // });

            $scope.points = [];
            $scope.brewery = Brewery.get({_id: $routeParams.brewery_id}, function() {
                MainTitle.add($scope.brewery.name);
                if ( $scope.brewery.location ) {
                    $scope.map.center = angular.copy($scope.brewery.location);
                    $scope.points.push($scope.brewery.location);    
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
                ['$scope', 'Brewery','$routeParams', 'Rating', 'DLHelper', '$filter', 
                'MainTitle','CellarService','RatingService', 'YesNo', 'Beer', '$translate', 'Responsive',
                'ngGPlacesAPI',
        function( $scope,   Brewery,  $routeParams,   Rating,   DLHelper,   $filter, 
            MainTitle, CellarService, RatingService, YesNo, Beer, $translate, Responsive,
            ngGPlacesAPI) {

            $scope.cancel = function() {
                window.history.back();
            };

            $scope.save = function() {
                $scope.brewery.$save(function() {
                    window.history.back();
                });
            };

            //Map Section
            $scope.points = [];
            $scope.map = {
                center: {
                    latitude: 0,
                    longitude: 0
                },
                zoom: 12
            };

            $scope.marker = {
                coords: {
                    longitude: 0,
                    latitude: 0
                },
                icon: 'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|0000D9'
            };
            

            $scope.searchLocation = function($event,searchText) {
                if ( $event.keyCode == 13 ) {
                    ngGPlacesAPI.textSearch({
                        latitude: $scope.position.coords.latitude,
                        longitude: $scope.position.coords.longitude,
                        radius: '500', query:searchText}).then(
                            function (data) {
                                $scope.points = data;
                                angular.forEach($scope.points, function(c) {
                                    c.latitude = c.geometry.location.d;
                                    c.longitude = c.geometry.location.e;
                                });
                                $scope.$log.debug("search result", data);
                                return data;
                            },
                            function(err) {
                                $scope.points = [];
                                console.log(err);
                            }
                    );
                }
            };

            $scope.selectPoint = function(point) {
                console.log("point", point);
                if ( point ) {
                    $scope.marker.coords = {
                        latitude: point.geometry.location.d,
                        longitude: point.geometry.location.e
                    };
                    var geocoder = new google.maps.Geocoder();
                    geocoder.geocode({
                            latLng: new google.maps.LatLng(
                                point.geometry.location.d,
                                point.geometry.location.e)
                        }, 
                        function(results, status) {
                            if (status == google.maps.GeocoderStatus.OK) {
                                console.log("geocode", results);
                                $scope.$apply(function() {
                                    $scope.brewery.address_components = results[0].address_components;    
                                });
                            } else {
                                console.log("Geocode was not successful for the following reason: " + status);
                                $scope.$apply(function() {
                                    $scope.brewery.address_components = [];    
                                });
                            }
                    });    
                } else {
                    $scope.brewery.address_components = [];  
                }
                
                // ngGPlacesAPI.placeDetails({reference:point.reference})
                //     .then(function(details) {
                //         console.log('details',details);
                //     });
            };
            

            $scope.brewery = Brewery.get({_id: $routeParams.brewery_id}, function() {
                MainTitle.add($scope.brewery.name);
                if ( $scope.brewery.location ) {
                    $scope.points.push($scope.brewery.location);
                } else {
                    $scope.$watch("position.coords", function(value) {
                        $scope.map.center = value;
                    });
                }
                $scope.$on("$destroy", function() {
                    MainTitle.clearAdd();
                });
                
            });

    }]);
});