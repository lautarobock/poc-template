define([], function() {

	var misc = angular.module("dl.misc", ['dl.resources']);

    misc.factory("Cache", function(Category, Style,$q) {
        var _categories = null;
        var _styles = null;
        return {
            categories: function(cb) {
                if ( _categories ) {
                    var deferred = $q.defer();
                    deferred.promise.then(function() {
                        if ( cb ) cb(_categories);
                    });
                    deferred.resolve();
                    return _categories;
                } else {
                    return _categories = Category.query(cb);
                }
            },
            styles: function(cb) {
                if ( _styles ) {
                    var deferred = $q.defer();
                    deferred.promise.then(function() {
                        if ( cb ) cb(_styles);
                    });
                    deferred.resolve();
                    return _styles;
                } else {
                    return _styles = Style.query(cb);
                }
            }
        };
    });

    misc.factory("MainTitle", function() {
        var main = '';
        var add = null;
        var replace = null;
        return {
            get: function() {
                if ( add ) {
                    return add + ' - ' + main;
                } else if ( replace ) {
                    return replace;
                } else {
                    return main;    
                }
            },
            set: function(title) {
                main = title;
            },
            add: function(title) {
                add = title;
            },
            clearAdd: function() {
                add = null;
            },
            replace: function(title) {
                replace = title;
            },
            clearReplace: function() {
                replace = null;
            }
        };
    });

    misc.factory("Responsive", function($window) {
        return {
            isXs: function() {
                return $window.document.width < 768;
            },
            isSm: function() {
                return $window.document.width >= 768 && $window.document.width < 992;
            },
            isMd: function() {
                return $window.document.width >= 992 && $window.document.width < 1200;
            },
            isLg: function() {
                return $window.document.width >= 1200;
            }
        };
    });

    return misc;

});