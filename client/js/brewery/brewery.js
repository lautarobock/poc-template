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
                center: $scope.position.coords,
                zoom: 14
            };
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

            $scope.points = [];
            //Map Section
            $scope.map = {
                center: $scope.position.coords,
                zoom: 12,
                events: {
                    tilesloaded: function (map) {
                        $scope.$apply(function () {
                            $scope.myMap = map;
                            $scope.$log.info('this is the map instance', map);
                        });
                    }
                }
            };

            $scope.searchLocation = function($event,searchText) {
                if ( $event.keyCode == 13 ) {
                    ngGPlacesAPI.textSearch({
                        latitude: $scope.position.coords.latitude,
                        longitude: $scope.position.coords.longitude,
                        radius: '500', query:searchText}).then(
                            function (data) {
                                // var latlngbounds = new google.maps.LatLngBounds();
                                $scope.points = data;
                                angular.forEach($scope.points, function(c) {
                                    c.latitude = c.geometry.location.d;
                                    c.longitude = c.geometry.location.e;
                                    // latlngbounds.extend(new google.maps.LatLng(
                                    //         c.latitude,
                                    //         c.longitude
                                    //     ));
                                });
                                // $scope.map.center = {
                                //     latitude: latlngbounds.getCenter().d,
                                //     longitude: latlngbounds.getCenter().e
                                // }
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

            $scope.selectPoint = function(point) {
                console.log("point", point);
            };
            

            $scope.brewery = Brewery.get({_id: $routeParams.brewery_id}, function() {
                MainTitle.add($scope.brewery.name);
                $scope.points.push($scope.brewery.location);
                $scope.$on("$destroy", function() {
                    MainTitle.clearAdd();
                });
                
            });

    }]);
});