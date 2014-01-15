define([], function() {

    var mousetrap = angular.module("ng-mousetrap", []);

    mousetrap.factory("mousetrap", function() {

        return function(shortcut, $scope, invoke) {
            console.log("BIND", shortcut);
            Mousetrap.bind(shortcut,function() {
                $scope.$apply(invoke);
            });

            $scope.$on('$destroy',function() {
                console.log("UNBIND", shortcut);
                Mousetrap.unbind(shortcut);
            });
        };
    });

});