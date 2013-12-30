require(["menu/menu","locale/locale"], function(menu,locale) {

    var app = angular.module("app", [
        'ui.bootstrap',
        'pascalprecht.translate',
        'menu']);

    //Esto esta aca porque este .js se carga en forma asincronica
    angular.element(document).ready(function() {
        angular.bootstrap(document, ['app']);
    });
    
    app.run(['$rootScope', function($rootScope) {
        
    }]);


    app.config(['$translateProvider', function ($translateProvider) {
        $translateProvider.translations('es', locale.es);
        $translateProvider.preferredLanguage('es');
    }]);

});