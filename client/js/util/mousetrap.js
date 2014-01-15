define([], function() {

    var mousetrap = angular.module("ng-mousetrap", []);

    mousetrap.factory("mousetrap", ['$log',function($log) {
    
            return function(shortcut, $scope, invoke) {
                $log.debug("BIND", shortcut);
                Mousetrap.bind(shortcut,function() {
                    $scope.$apply(invoke);
                });
    
                $scope.$on('$destroy',function() {
                    $log.debug("UNBIND", shortcut);
                    Mousetrap.unbind(shortcut);
                });
            };
        }]);

});