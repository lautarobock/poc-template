define([], function() {

    var maps = angular.module("dl.maps", ['ngGPlaces']);

    var RADIUS = 500;

    var myPosition = {
        latitude: 0,
        longitude: 0
    };

    maps.run(function() {
        if ( navigator && navigator.geolocation ) {
            navigator.geolocation.getCurrentPosition(function(position) {
                if (position) {
                    myPosition = position;
                }
            });    
        }
    });

    maps.factory("MapIcon", function() {
        var baseUrl = 'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|'
        return {
            red: function() {
                return baseUrl + 'D90000';
            },
            green: function() {
                return baseUrl + '00D900';
            },
            blue: function() {
                return baseUrl + '0000D9';
            },
            custom: function(color) {
                return baseUrl + color;
            }
        };
    });

    maps.factory("MapHelper", function() {
        return {
            geo2latLng: function(source, target) {
                if ( target ) {
                    target.latitude = source.geometry.location.d;
                    target.longitude = source.geometry.location.e;
                    return target;
                } else {
                    return {
                        latitude: source.geometry.location.d,
                        longitude: source.geometry.location.e
                    };
                }
            }
        };
    });

    maps.factory("MapSearch", ['ngGPlacesAPI',function(ngGPlacesAPI) {
        return {
            textSearch: function(text, onSuccess,onError) {
                ngGPlacesAPI.textSearch({
                    latitude: myPosition.coords.latitude,
                    longitude: myPosition.coords.longitude,
                    radius: RADIUS, 
                    query:text}).then(
                        function (data) {
                            angular.forEach(data, function(c) {
                                c.latitude = c.geometry.location.d;
                                c.longitude = c.geometry.location.e;
                            });
                            onSuccess(data);
                            return data;
                        },
                        function(err) {
                            onSuccess([]);
                        }
                    );
            }
        };
    }]);

    maps.factory("MapFactory", ['MapIcon',function(MapIcon) {
        return {
            marker: function(lat, lng, visible, icon) {
                return {
                    coords: {
                        longitude: lat||0,
                        latitude: lng||0
                    },
                    options: {
                        visible: visible||false
                    },
                    icon: icon||MapIcon.blue()
                };
            },
            map: function(lat, lng, zoom) {
                return {
                    center: {
                        latitude: lat||0,
                        longitude: lng||0
                    },
                    zoom: zoom||12,
                    points: [],
                    addPoint: function(point)  {
                        this.points.push(point);
                    },
                    centerAt: function(point) {
                        this.center = point;
                    },
                    marker: this.marker(),
                    showMarkerAt: function(coords) {
                        this.marker.coords = coords;
                        this.marker.options.visible = true;
                    },
                    hideMarker: function() {
                        this.marker.options.visible = false; 
                    }
                }
            }
        };
    }]);

    maps.directive("dlMap", function() {
        return {
            restrict: 'AE',
            replace: true,
            scope : {
                map: '=',
                heightId: '@'
            },
            template: '<div><div google-map id="map200" draggable="true" center="map.center" zoom="map.zoom">'
                + '<markers fit="true" models="map.points" coords="\'self\'"></markers> '
                + '<marker coords="map.marker.coords" icon="map.marker.icon" options="map.marker.options"></marker>'
                + '</div></div>'
        };
    });

    return maps;

});
