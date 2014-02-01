define([],function() {

    var res = angular.module("dl.resources", ['ngResource']);

    var path = "api/"
    
    res.factory("Login", function($resource) {
        return $resource("/api/login/by_google/:google_id", {}, {});
    });

    var services = ['User','Style','StyleByLabel','Beer','Brewery', 'Category'];
    angular.forEach(services,function(s) {
        res.factory(s,function($resource, $rootScope) {
            var params = function() {
                return $rootScope.user ? $rootScope.user.google_id : null;
            };
            return $resource( "/" + path + s + '/:_id',{_id:"@_id",google_id:params}, {});
        });
    });

    res.factory('Cellar',function($resource, $rootScope) {
        var params = function() {
            return $rootScope.user ? $rootScope.user.google_id : null;
        };
        return $resource( "/" + path + 'Cellar/:_id',{_id:"@_id",google_id:params}, {
            clearZeros: {method:'DELETE'}
        });
    });

    res.factory('Rating',function($resource, $rootScope) {
        var params = function() {
            return $rootScope.user ? $rootScope.user.google_id : null;
        };
        return $resource( "/" + path + 'Rating/:operation:_id',{_id:"@_id",google_id:params}, {
            getByBeer: {method:'GET',params: {operation:'byBeer'},isArray:true}
        });
    });

    return res;
});