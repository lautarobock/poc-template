require([
    "locale/locale",
    "menu/menu",
    "resources",
    "gplus",
    "beer/beer",
    "rating/rating",
    "util/directives",
    "abm/abm",
    "util/helper",
    "util/mousetrap"
    ], function(locale, menu, resources, gplus, beer, rating) {

    var app = angular.module("app", [
        'ngRoute',
        'ngSanitize',
        'ui.bootstrap',
        'pascalprecht.translate',
        'dl.menu',
        'dl.resources',
        'dl.gplus',
        'dl.beer',
        'dl.rating',
        'dl.directives',
        'gt.abm',
        'dl.helper',
        'ng-mousetrap']);

    //Esto esta aca porque este .js se carga en forma asincronica
    angular.element(document).ready(function() {
        angular.bootstrap(document, ['app']);
    });
    
    app.factory("Cache", function(Category, Style) {
        var _categories = null;
        var _styles = null;
        return {
            categories: function() {
                return _categories || Category.query(function(r) {
                    _categories = r;
                });
            },
            styles: function() {
                return _styles || Style.query(function(r) {
                    _styles = r;
                });
            }
        };
    });

    app.run(
        ['$rootScope','Login','evaluateAuthResult','User', 
        '$translate','MainTitle','Cache',
            function(
                    $rootScope, 
                    Login, 
                    evaluateAuthResult,
                    User,
                    $translate,
                    MainTitle,
                    Cache) {

        $rootScope.loginSuccess = false;

        MainTitle.set($translate('menu.title.desktop'));

        $rootScope.mainTitle = function() {
            return MainTitle.get();
        };

        // Mousetrap.bind('/', function(e) {
        //     $rootScope.$broadcast('keypress:47', e);
        // });

        $rootScope.$on('g+login', function(event, authResult) {
            // console.log("authResult",authResult);

            evaluateAuthResult(authResult, function(err, googleUser) {
                if ( err ) {
                    $rootScope.loginError = err.message;
                    $rootScope.$apply();
                    console.log("ERROR", "Login Error", err.message);
                } else if ( googleUser ) {
                    $rootScope.googleUser = googleUser;
                    Login.get({
                            google_id:googleUser.id, 
                            name:googleUser.name, 
                            email: googleUser.email
                        }, function(user) {
                            User.get({_id: user._id}, function(user) {
                                $rootScope.loginSuccess = true;
                                $rootScope.user = user;
                                // console.log(user);    
                            });
                    });
                } else {
                    console.log("ERROR", "Silent Login Error");
                }
            });
        });
        
    }]);


    app.config(['$translateProvider','$routeProvider', function ($translateProvider, $routeProvider) {

        //Configure Translate
        $translateProvider.translations('es', locale.es);
        $translateProvider.preferredLanguage('es');


        //Configure Routes
        $routeProvider.
                
                when('/beer/new', {templateUrl: 'beer/beer-edit.html',   controller: 'BeerEditController'}).
                when('/beer/edit/:beer_id', {templateUrl: 'beer/beer-edit.html',   controller: 'BeerEditController'}).
                when('/beer/detail/:beer_id', {templateUrl: 'beer/beer-detail.html',   controller: 'BeerDetailController'}).
                when('/beer/tag/:beer_id', {templateUrl: 'beer/beer-tag.html',   controller: 'BeerDetailController'}).
                when('/beer/search_:filter', {templateUrl: 'beer/beer.html',   controller: 'BeerController'}).
                when('/beer', {templateUrl: 'beer/beer.html',   controller: 'BeerController'}).


                when('/rating', {templateUrl: 'rating/rating.html',   controller: 'RatingBeerController'}).
                when('/rating/new', {templateUrl: 'rating/rating-edit.html',   controller: 'RatingEditController'}).
                when('/rating/edit/:rating_id', {templateUrl: 'rating/rating-edit.html',   controller: 'RatingEditController'}).
                when('/rating/detail/:rating_id', {templateUrl: 'rating/rating-detail.html',   controller: 'RatingDetailController'}).
                

                otherwise({redirectTo: '/beer'});

    }]);

    app.factory("MainTitle", function() {
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
            }
        };
    });

    app.directive('secure', function() {
        return function(scope,element) {
            scope.$watch("user", function(value, old) {
                if ( value ) {
                    element.removeClass('dl-hide');
                } else {
                    element.addClass('dl-hide');
                }    
            });
        };
    });

    app.directive('secureAdmin', function() {
        return function(scope,element) {
            scope.$watch("user", function(value, old) {
                if ( value && value.isAdmin ) {
                    element.removeClass('dl-hide');
                } else {
                    element.addClass('dl-hide');
                }    
            });
        };
    });

    app.directive('dlIcon', function() {
        return function(scope, element) {
            element.html('<img src="../images/'+element.attr('dl-icon')+'.png"/>');
        };
    });

    app.directive('mainContent', function() {
        return function(scope, element) {
            element.addClass("col-md-9");
        };
    });

    app.directive('sideBar', function() {
        return function(scope, element) {
            element.addClass("col-md-3");
        };
    });

    app.directive('logIn', function() {
        return {
            restrict: 'AE',
            replace: true,
            template: '<a href="javascript:googleLogIn()">Acceder</a>',
            link: function(scope, element) {
                scope.$watch("user", function(value) {
                    if ( value ) {
                        element.addClass('dl-hide');
                    } else {
                        element.removeClass('dl-hide');
                    }    
                });
            }
        };
    })

    app.directive('signIn', function() {
        return {
            restrict: 'AE',
            replace: true,
            template: '<a href="javascript:googleSignIn()">Registarse</a>',
            link: function(scope, element) {
                scope.$watch("user", function(value) {
                    if ( value ) {
                        element.addClass('dl-hide');
                    } else {
                        element.removeClass('dl-hide');
                    }    
                });
            }
        };
    })

    app.controller("RankingsController", 
        ['$scope','Cache',
        function($scope,Cache) {
            $scope.categories = Cache.categories();
        }]);

    app.controller("SideSearchController", 
        ['$scope', '$location','focus','mousetrap',
        function($scope, $location,focus,mousetrap) {
            mousetrap('/', $scope, function(e) {
                console.log("INFO", "keypress", e);
                focus('focusSearch');
            });

            $scope.search = function(searchText) {
                $location.path("/beer").search('searchCriteria',searchText);
            };

            //@Deprecated
            $scope.safeSearch = function(searchText) {
                return $sce.trustAsUrl("#/beer?searchCriteria="+searchText);
            }
        }]);

    app.filter("enrich", function() {
        return function(value) {
            if ( value ) return markdown.toHTML(value);
            return value;
        };
    });

    app.directive('focusOn', function() {
        return function(scope, elem, attr) {
            scope.$on('focusOn', function(e, name) {
                if(name === attr.focusOn) {
                    elem[0].focus();
                }
            });
        };
    });

    app.factory('focus', ['$rootScope', '$timeout',function ($rootScope, $timeout) {
        return function(name) {
            $timeout(function (){
                $rootScope.$broadcast('focusOn', name);
            });
        }
    }]);


});