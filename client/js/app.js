require([], function() {

    var app = angular.module("app", []);
    //Esto esta aca porque este .js se carga en forma asincronica
    angular.element(document).ready(function() {
        angular.bootstrap(document, ['app']);
    });
    
    app.run(['$rootScope', function($rootScope) {
        $rootScope.name = "Jose";
    }]);

});