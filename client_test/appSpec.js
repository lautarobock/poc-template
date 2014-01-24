define(["app"], function() {

	describe("app", function() {

		beforeEach(angular.mock.module('app'));

		it("Should be initialized", inject(function($rootScope) {
			expect($rootScope.mainTitle()).toBe("Birras que he tomado");
			expect($rootScope.$log).toBeDefined();
			expect($rootScope.loginSuccess).toBeFalsy();
		}));

		it("Should define routes", inject(function($rootScope,$location, $route, $httpBackend) {
			// expect("1").toBe("2");
			//puedo hacer asi creo
			//$httpBackend.expectGET('')
			$httpBackend.when('GET', 'stats/stats.html').respond("<div></div>");
			$httpBackend.when('GET', 'beer/beer-edit.html').respond("<div></div>");
			$httpBackend.when('GET', '/api/Style?').respond([]);
			$httpBackend.when('GET', '/api/StyleByLabel?').respond([]);
			$httpBackend.when('GET', '/api/Brewery?').respond([]);
			$httpBackend.when('GET', '/api/Category?').respond([]);

			$rootScope.$on('$routeChangeStart', function() {
				// console.log("CHANGE");
			});

			$location.path("/beer/new");
			// $rootScope.$digest();
			$httpBackend.flush();
			// console.log("ROUTE", $route.current.resolve.combosData);
			// console.log("ROUTE", $route.current.resolve.beer);
			// console.log("ROUTE", $route.current);

		}));

		afterEach(inject(function($httpBackend) {
			$httpBackend.verifyNoOutstandingExpectation();
     		$httpBackend.verifyNoOutstandingRequest();
		}));

	});

	describe("RankingsController", function() {

		beforeEach(angular.mock.module('app'));

		it("Should load categories", inject(function($controller, $rootScope, Cache) {
			var $scope = $rootScope.$new();

			spyOn(Cache,"categories").andReturn([{name:"Cat1"}]);

			var rankingsController = $controller("RankingsController", {$scope: $scope});

			expect(Cache.categories).toHaveBeenCalled();
			expect($scope.categories).toEqual([{name:"Cat1"}]);
		}));

	});

	describe("SideSearchController", function() {

		beforeEach(angular.mock.module('app'));

		it("Should set shortcut and search beer", 
			inject(function($controller, $rootScope, Cache) {
				var $scope = $rootScope.$new();

				var sideSearchController = $controller("SideSearchController", {$scope: $scope});

				// expect(Cache.categories).toHaveBeenCalled();
				// expect($scope.categories).toEqual([{name:"Cat1"}]);
		}));

	});



});