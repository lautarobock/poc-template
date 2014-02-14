define(["brewery/brewery"], function(DataHelper) {

    describe("BreweryEditController", function() {
        
        beforeEach(function() {
            //Mock google maps modules
            var dummy1 = angular.module('google-maps', []);

            var placesDummy = angular.module('ngGPlaces', []);
            placesDummy.factory("ngGPlacesAPI", function() {
                return {};
            });
        });

        beforeEach(angular.mock.module('dl.brewery'));

        beforeEach(inject(function($rootScope,$log) {
            $rootScope.$log = $log;
        }));


        it("Should create Map", inject(function($rootScope,$controller,$location,$routeParams,Brewery) {
            
            var myLocation = {
                latitude: 10,
                longitude: 20
            };

            spyOn(Brewery, 'get').andCallFake(function(cb) {
                var brewery = {
                    name: "Mi Cerveceria",
                    location: myLocation
                };
                return brewery;
            });

            var $scope = $rootScope.$new();

            $routeParams.brewery_id = "BREWERY_ID";

            var breweryEditController = $controller("BreweryEditController", {$scope: $scope});

            expect($scope.map).toBeDefined();
            expect($scope.brewery.name).toBe("Mi Cerveceria");            
        }));

        it("Should search places", inject(function($rootScope,$controller,MapSearch) {
            
            spyOn(MapSearch,'textSearch').andCallFake(function(search, cb) {
                cb([{latitude: 1,longitude:1},{latitude: 2,longitude:2}]);
            });

            var $scope = $rootScope.$new();

            var breweryEditController = $controller("BreweryEditController", {$scope: $scope});

            $scope.searchLocation({keyCode: 13},'search by this');

            expect($scope.map.points.length).toBe(2);
        }));

        it("Should get info", inject(function($rootScope,$controller,MapSearch,Brewery) {
            window.google = {
                maps: {
                    Geocoder: function() {
                        this.geocode = function(params, cb) {
                            cb([{
                                address_components: [{
                                    long_name: "Nombre Largo",
                                    types: []
                                }]
                            }],"OK");    
                        
                        };
                    },
                    GeocoderStatus: {
                        OK: "OK"
                    },
                    LatLng: function() {}
                }
            }
            spyOn(Brewery, 'get').andCallFake(function(cb) {
                var brewery = {
                    name: "Mi Cerveceria",
                    location: {
                        latitude: 10,
                        longitude: 20
                    }
                };
                return brewery;
            });

            var $scope = $rootScope.$new();

            var breweryEditController = $controller("BreweryEditController", {$scope: $scope});

            $scope.selectPoint({latitude: 1,longitude:1});

            $rootScope.$digest();

            expect($scope.brewery.address_components.length).toBe(1);

        }));
    });

});