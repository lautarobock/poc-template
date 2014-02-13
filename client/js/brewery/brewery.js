define(['../resources','util/maps'], function() {

    var brewery = angular.module("dl.brewery", ["dl.resources",'google-maps','dl.maps']);

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

            $scope.map = MapFactory.map(0,0,14);

            $scope.brewery = Brewery.get({_id: $routeParams.brewery_id}, function() {
                
                MainTitle.add($scope.brewery.name);
                if ( $scope.brewery.location ) {
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
                ['$scope', 'Brewery','$routeParams', 'MainTitle', 'MapFactory', 'MapSearch', 'MapHelper',
        function( $scope, Brewery, $routeParams, MainTitle, MapFactory, MapSearch, MapHelper) {

            $scope.cancel = function() {
                window.history.back();
            };

            $scope.save = function() {
                $scope.brewery.$save(function() {
                    window.history.back();
                });
            };

            //Map Section
            $scope.map = MapFactory.map();

            $scope.searchLocation = function($event,searchText) {
                if ( $event.keyCode == 13 ) {
                    MapSearch.textSearch(searchText, function(data) {
                            $scope.map.points = data;
                        }
                    )
                }
            };

            $scope.selectPoint = function(point) {
                $scope.$log.debug("point", point);
                if ( point ) {

                    $scope.map.showMarkerAt(MapHelper.geo2latLng(point))

                    var geocoder = new google.maps.Geocoder();
                    geocoder.geocode({latLng: point.geometry.location}, 
                        function(results, status) {
                            if (status == google.maps.GeocoderStatus.OK) {
                                $scope.$log.debug("geocode", results);
                                $scope.$apply(function() {
                                    $scope.brewery.address_components = results[0].address_components;    
                                });
                            } else {
                                $scope.$log.error("Geocode was not successful for the following reason: " + status);
                                $scope.$apply(function() {
                                    $scope.brewery.address_components = [];    
                                });
                            }
                    });    
                } else {
                    $scope.map.hideMarker();
                    $scope.brewery.address_components = [];  
                }
                
            };
            

            $scope.brewery = Brewery.get({_id: $routeParams.brewery_id}, function() {
                MainTitle.add($scope.brewery.name);
                
                if ( $scope.brewery.location ) {
                    $scope.map.addPoint($scope.brewery.location);
                } else {
                    $scope.$watch("position.coords", function(value) {
                        $scope.map.centerAt(value);
                    });
                }

                $scope.$on("$destroy", function() {
                    MainTitle.clearAdd();
                });
                
            });

    }]);
});