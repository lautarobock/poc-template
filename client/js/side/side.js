define(["util/directives","util/misc","util/mousetrap"], function() {

    var side = angular.module("dl.side", ['dl.directives','dl.misc','ng-mousetrap']);

    side.controller("RankingsController", 
        ['$scope','Cache','GoTo',
        function($scope,Cache, GoTo) {
            $scope.categories = Cache.categories();

            $scope.openCategory = function(category) {
                GoTo.category(category._id);
            };
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
                $location.$$search = {};
                $location.path("/beer").search('searchCriteria',searchText);
            };

    }]);

});