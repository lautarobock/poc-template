define(["util/directives","util/misc","util/mousetrap"], function() {

    var side = angular.module("dl.side", ['dl.directives','dl.misc','ng-mousetrap']);

    side.controller("RankingsController", 
        ['$scope','Cache',
        function($scope,Cache) {
            $scope.categories = Cache.categories();
        }]);

    side.controller("SideSearchController", 
        ['$scope', '$location','focus','mousetrap',
        function($scope, $location,focus,mousetrap) {
            
            mousetrap('n', $scope, function() {
                $location.path("/beer/new");
            });

            mousetrap('/', $scope, function(e) {
                focus('focusSearch');
            });

            $scope.search = function(searchText) {
                $location.path("/beer").search('searchCriteria',searchText);
            };

    }]);

});