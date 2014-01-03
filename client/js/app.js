require([
    "locale/locale",
    "menu/menu",
    "resources",
    "gplus",
    "beer/beer"
    ], function(locale, menu, resources, gplus, beer) {

    var app = angular.module("app", [
        'ngRoute',
        'ui.bootstrap',
        'pascalprecht.translate',
        'dl.menu',
        'dl.resources',
        'dl.gplus',
        'dl.beer']);

    //Esto esta aca porque este .js se carga en forma asincronica
    angular.element(document).ready(function() {
        angular.bootstrap(document, ['app']);
    });
    
    app.run(['$rootScope','Login','evaluateAuthResult', 
                function(
                    $rootScope, 
                    Login, 
                    evaluateAuthResult) {

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
                            $rootScope.loginSuccess = true;
                            $rootScope.user = user;
                            console.log(user);
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

});