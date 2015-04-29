define([], function() {

    var menu = angular.module("dl.menu", [ ]);

    menu.run(['$rootScope','$location', 'mousetrap',
        function($rootScope,$location,mousetrap) {
        mousetrap('g m', $rootScope, function() {
            $location.url("rating");
        });
        mousetrap('g h', $rootScope, function() {
            $location.url("beer");
        });
        mousetrap('g c', $rootScope, function() {
            $location.url("cellar");
        });
        mousetrap('g v', $rootScope, function() {
            $location.url("vintage");
        });
        mousetrap('g s', $rootScope, function() {
            $location.url("stats");
        });
    }]);

    menu.directive("mainMenu", function() {
        return {
            restrict: "EA",
            replace: true,
            templateUrl: 'menu/menu.html',
            controller: function($scope) {

                $scope.isCollapsed = true;

                $scope.toogleMenu = function() {
                    $scope.isCollapsed = !$scope.isCollapsed;
                }

            }
        };
    });

    return menu;
});
