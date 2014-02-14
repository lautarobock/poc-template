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

    /**
     * @see http://stackoverflow.com/questions/8248077/google-maps-v3-standard-icon-shadow-names-equiv-of-g-default-icon-in-v2
     */
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
            },
            bar: function() {
                return "http://icons.iconarchive.com/icons/benbackman/one-piece/32/Barrel-Beer-icon.png"
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
                        latitude: parseFloat(source.geometry.location.d),
                        longitude: parseFloat(source.geometry.location.e)
                    };
                }
            }
        };
    });

    maps.factory("MapSearch", 
        ['ngGPlacesAPI','MapIcon','MapHelper', '$q',
        function(ngGPlacesAPI,MapIcon,MapHelper, $q) {
        return {
            /**
             * @param point {latitude: Float, longitude: Float}
            */
            geocode: function (point) {
                var deferred = $q.defer();
                var geocoder = new google.maps.Geocoder();
                geocoder.geocode({latLng: new google.maps.LatLng(point.latitude, point.longitude)}, 
                    function(results, status) {
                        if (status == google.maps.GeocoderStatus.OK) {
                            deferred.resolve(results);
                        } else {
                            deferred.reject(status);
                        }
                });
                return deferred.promise;
            },
            textSearch: function(text, onSuccess,onError) {
                ngGPlacesAPI.textSearch({
                    latitude: myPosition.coords.latitude,
                    longitude: myPosition.coords.longitude,
                    radius: RADIUS, 
                    query:text}).then(
                        function (data) {
                            angular.forEach(data, function(c) {
                                MapHelper.geo2latLng(c,c);
                                c.icon = null;
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
            marker: function(opt) {
                opt = opt || {};
                return {
                    coords: {
                        longitude: opt.lat||0,
                        latitude: opt.lng||0
                    },
                    options: {
                        visible: opt.visible||false
                    },
                    icon: opt.icon||MapIcon.blue()
                };
            },
            map: function(opt) {
                opt = opt || {};
                return {
                    center: {
                        latitude: opt.lat||0,
                        longitude: opt.lng||0
                    },
                    zoom: opt.zoom||12,
                    fit: opt.fit,
                    points: [],
                    addPoint: function(point)  {
                        this.points.push(point);
                    },
                    centerAt: function(point) {
                        this.center = point;
                    },
                    marker: opt.marker || this.marker(),
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
            replace: false,
            scope : {
                map: '='
            },
            template: '<div google-map draggable="true" center="map.center" zoom="map.zoom">'
                + '<markers fit="map.fit" models="map.points" coords="\'self\'" icon="\'icon\'"></markers> '
                + '<marker coords="map.marker.coords" icon="map.marker.icon" options="map.marker.options"></marker>'
                + '</div>'
        };
    });

    return maps;

});
