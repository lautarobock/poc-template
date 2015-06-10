(function() {

    var app = angular.module("app", [
        'ngRoute',
        'ui.bootstrap',
        'template'
    ]);

    app.run(function($rootScope) {

    });

    app.config('$routeProvider', function ($routeProvider) {

        //Configure Routes
        $routeProvider.when('/template', {templateUrl: 'template/template.html',   controller: 'TemplateController'}).
                otherwise({redirectTo: '/template'});

    });
})();
