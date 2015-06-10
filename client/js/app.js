(function() {

    var app = angular.module("app", [
        'ui.router',
        'ui.bootstrap',
        'package',
        'resources'
    ]);

    app.run(function($rootScope) {

    });

    app.config(function ($routeProvider) {

        //Configure Routes
        $routeProvider
            .when('/package', {
                templateUrl: 'package/package.html',
                controller: 'PackageController',
                controllerAs: 'ctrl'
            })
            .when('/package/:Id', {
                templateUrl: 'package/package-edit.html',
                controller: 'PackageEditController',
                controllerAs: 'ctrl'
            })
            .when('/template', {
                templateUrl: 'template/template.html',
                controller: 'TemplateController',
                controllerAs: 'ctrl'
            })
            .otherwise({redirectTo: '/package'});

    });
})();
