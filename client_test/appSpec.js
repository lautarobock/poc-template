define(["app"], function() {

	describe("app", function() {

		beforeEach(angular.mock.module('app'));

		it("Should be initialized", inject(function($rootScope) {
			expect($rootScope.mainTitle()).toBe("Birras que he tomado");
			expect($rootScope.$log).toBeDefined();
			expect($rootScope.loginSuccess).toBeFalsy();
		}));

		it("Should define routes", function() {
			expect("1").toBe("2");
		});

	});

});