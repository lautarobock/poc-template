require([
    "locale/locale",
    "menu/menu",
    "resources",
    "gplus",
    "beer/beer",
    "rating/rating",
    "util/directives",
    "abm/abm",
    "util/helper"
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
        'dl.helper']);

    //Esto esta aca porque este .js se carga en forma asincronica
    angular.element(document).ready(function() {
        angular.bootstrap(document, ['app']);
    });
    
    app.run(['$rootScope','Login','evaluateAuthResult','User', 
                function(
                    $rootScope, 
                    Login, 
                    evaluateAuthResult,
                    User) {

        $rootScope.loginSuccess = false;

        $rootScope.$on('g+login', function(event, authResult) {
            console.log("authResult",authResult);

            evaluateAuthResult(authResult, function(err, googleUser) {
                if ( err ) {
                    $rootScope.loginError = err.message;
                    $rootScope.$apply();
                    console.log("INFO", "Login Error", err.message);
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
                                console.log(user);    
                            });
                    });
                } else {
                    console.log("INFO", "Silent Login Error");
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
                when('/beer', {templateUrl: 'beer/beer.html',   controller: 'BeerController'}).

                when('/rating', {templateUrl: 'rating/rating.html',   controller: 'RatingBeerController'}).
                when('/rating/new', {templateUrl: 'rating/rating-edit.html',   controller: 'RatingEditController'}).
                when('/rating/edit/:rating_id', {templateUrl: 'rating/rating-edit.html',   controller: 'RatingEditController'}).
                when('/rating/detail/:rating_id', {templateUrl: 'rating/rating-detail.html',   controller: 'RatingDetailController'}).
                

                otherwise({redirectTo: '/beer'});

    }]);

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

    app.controller("RankingsController", function($scope,Category) {
        $scope.categories = Category.query();
    });

    app.filter("enrich", function() {
        return function(value) {
            if ( value ) return markdown.toHTML(value);
            return value;
        };
    });

    // app.filter("round", function() {
    //     return function(value, decimal) {
    //         return Math.round(value, decimal);
    //     }
    // });

});