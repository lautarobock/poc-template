define([],function() {

    var res = angular.module("dl.resources", ['ngResource']);

    var path = "api/"
    
    res.factory("Login", function($resource) {
        return $resource("/api/login/by_google/:google_id", {}, {});
    });

    var services = ['User','Style','StyleByLabel','Beer'];
    angular.forEach(services,function(s) {
        res.factory(s,function($resource) {
            return $resource( "/" + path + s + '/:_id',{_id:"@_id"}, {});
        });    
    });

    return res;
});