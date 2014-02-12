define(["side/side"], function() {

    describe("RankingsController", function() {

        beforeEach(angular.mock.module('dl.side'));

        it("Should load categories", inject(function($controller, $rootScope, Cache) {
            var $scope = $rootScope.$new();

            spyOn(Cache,"categories").andReturn([{name:"Cat1"}]);

            var rankingsController = $controller("RankingsController", {$scope: $scope});

            expect(Cache.categories).toHaveBeenCalled();
            expect($scope.categories).toEqual([{name:"Cat1"}]);
        }));

    });

    describe("SideSearchController", function() {

        beforeEach(angular.mock.module('dl.side'));

        it("Should set shortcut and search beer", 
            inject(function($controller, $rootScope, $location) {
                var $scope = $rootScope.$new();

                spyOn(Mousetrap,'bind');

                var sideSearchController = $controller("SideSearchController", {$scope: $scope});

                expect(Mousetrap.bind).toHaveBeenCalledWith('n',jasmine.any(Function));
                expect(Mousetrap.bind).toHaveBeenCalledWith('/',jasmine.any(Function));

                $scope.search("my text");

                expect($location.path()).toEqual("/beer");
                expect($location.search().searchCriteria).toEqual("my text");

        }));

    });
});    