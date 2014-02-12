// define(["app"], function() {

// 	describe("app", function() {

		// beforeEach(angular.mock.module('app'));

		// it("Should be initialized", inject(function($rootScope) {
		// 	expect($rootScope.mainTitle()).toBe("Birras que he tomado");
		// 	expect($rootScope.$log).toBeDefined();
		// 	expect($rootScope.loginSuccess).toBeFalsy();
		// }));

		// it("Should define routes", inject(function($rootScope,$location, $route, $httpBackend) {
		// 	// expect("1").toBe("2");
		// 	//puedo hacer asi creo
		// 	//$httpBackend.expectGET('')
		// 	$httpBackend.when('GET', 'stats/stats.html').respond("<div></div>");
		// 	$httpBackend.when('GET', 'beer/beer-edit.html').respond("<div></div>");
		// 	$httpBackend.when('GET', '/api/Style?').respond([]);
		// 	$httpBackend.when('GET', '/api/StyleByLabel?').respond([]);
		// 	$httpBackend.when('GET', '/api/Brewery?').respond([]);
		// 	$httpBackend.when('GET', '/api/Category?').respond([]);

		// 	$rootScope.$on('$routeChangeStart', function() {
		// 		// console.log("CHANGE");
		// 	});

		// 	$location.path("/beer/new");
		// 	// $rootScope.$digest();
		// 	$httpBackend.flush();
		// 	// console.log("ROUTE", $route.current.resolve.combosData);
		// 	// console.log("ROUTE", $route.current.resolve.beer);
		// 	// console.log("ROUTE", $route.current);

		// }));

		// afterEach(inject(function($httpBackend) {
		// 	$httpBackend.verifyNoOutstandingExpectation();
  //    		$httpBackend.verifyNoOutstandingRequest();
		// }));

// 	});


// });