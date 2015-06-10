(function() {

    var app = angular.module("app", [
        'ui.router',
        'ui.bootstrap',
        'package',
        'resources'
    ]);

    app.run(function($rootScope) {

    });

    app.config(function ($stateProvider, $urlRouterProvider) {

        $urlRouterProvider.otherwise('package');
        //Configure Routes
        $stateProvider
            .state('package', {
                url: '/package',
                templateUrl: 'package/package.html',
                controller: 'PackageController',
                controllerAs: 'ctrl'
            })
            .state('package-detail', {
                url: '/package/:Id',
                templateUrl: 'package/package-detail.html',
                controller: 'PackageEditController',
                controllerAs: 'ctrl'
            })
        //     .when('/template', {
        //         templateUrl: 'template/template.html',
        //         controller: 'TemplateController',
        //         controllerAs: 'ctrl'
        //     })
        //     .otherwise({redirectTo: '/package'});

    });
})();
