require([
    "locale/locale",
    "menu/menu",
    "resources",
    "gplus"
    ], function(locale, menu, resources, gplus) {

    var app = angular.module("app", [
        'ui.bootstrap',
        'pascalprecht.translate',
        'dl.menu',
        'dl.resources',
        'dl.gplus']);

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


    app.config(['$translateProvider', function ($translateProvider) {
        $translateProvider.translations('es', locale.es);
        $translateProvider.preferredLanguage('es');
    }]);

});