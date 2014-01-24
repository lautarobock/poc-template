describe("dl.directives", function() {
		
	beforeEach(angular.mock.module('dl.directives'));

	it("Should hide element if not logged", inject(function($rootScope,$compile) {

		var element = $compile("<div secure></div>")($rootScope);
		$rootScope.$digest();
		expect(element.hasClass("hidden")).toBeTruthy();
		$rootScope.user = {name:'Jose'};
		$rootScope.$digest();
		expect(element.hasClass("hidden")).toBeFalsy();

	}));

	it("Should hide element if logged", inject(function($rootScope,$compile) {

		var element = $compile("<div not-logged></div>")($rootScope);
		$rootScope.$digest();
		expect(element.hasClass("hidden")).toBeFalsy();
		$rootScope.user = {name:'Jose'};
		$rootScope.$digest();
		expect(element.hasClass("hidden")).toBeTruthy();

	}));

	it("Should hide element if not Admin", inject(function($rootScope,$compile) {

		var element = $compile("<div secure-admin></div>")($rootScope);
		$rootScope.$digest();
		expect(element.hasClass("hidden")).toBeTruthy();
		$rootScope.user = {name:'Jose'};
		$rootScope.$digest();
		expect(element.hasClass("hidden")).toBeTruthy();

		//Now the admin one
		$rootScope.user = {name:'Jose', isAdmin:true};
		$rootScope.$digest();
		expect(element.hasClass("hidden")).toBeFalsy();

	}));

	it("Should add icon to element", inject(function($rootScope,$compile) {

		var element = $compile("<div dl-icon='photo'></div>")($rootScope);
		$rootScope.$digest();
		expect(element.html()).toContain("<img src=\"../images/photo.png\">");

	}));

	//Esto deberia ser configurable la cantidad de columnas que quiero para cada sector
	it("Should add class to main content and sidebar", inject(function($rootScope,$compile) {

		var element = $compile("<div main-content></div>")($rootScope);
		$rootScope.$digest();
		expect(element.hasClass('col-md-9')).toBeTruthy()

		var element = $compile("<div side-bar></div>")($rootScope);
		$rootScope.$digest();
		expect(element.hasClass('col-md-3')).toBeTruthy()

	}));

	it("Should create a login button", inject(function($rootScope,$compile) {

		var element = $compile("<log-in caption='Login'></log-in>")($rootScope);
		$rootScope.$digest();
		expect(element.hasClass("hidden")).toBeFalsy();
		expect(element.attr('href')).toContain('googleLogIn()');
		expect(element.html()).toContain('Login');

		$rootScope.user = {name:'Jose'};
		$rootScope.$digest();
		expect(element.hasClass("hidden")).toBeTruthy()

	}));

	it("Should create a signIn button", inject(function($rootScope,$compile) {

		var element = $compile("<sign-in></sign-in>")($rootScope);
		$rootScope.$digest();
		expect(element.hasClass("hidden")).toBeFalsy();
		expect(element.attr('href')).toContain('googleSignIn()');
		expect(element.html()).toContain('Registrarse');

		$rootScope.user = {name:'Jose'};
		$rootScope.$digest();
		expect(element.hasClass("hidden")).toBeTruthy()

	}));	

	it("Should enrich text", inject(function($filter) {
		var enrich = $filter('enrich');
		var richText = "Hola";
		spyOn(markdown,'toHTML').andReturn("Enrich Hola");
		var enriched = enrich(richText);
		expect(markdown.toHTML).toHaveBeenCalledWith(richText);
		expect(enriched).toBe("Enrich Hola");

		//If recive null, returns null
		var nulled = enrich(null);
		expect(nulled).toBeNull();
	}));

	it("Should set name to focus it", inject(function($controller, $rootScope) {
		// var $scope = $rootScope.$new();

		// spyOn(Cache,"categories").andReturn([{name:"Cat1"}]);

		// var rankingsController = $controller("RankingsController", {$scope: $scope});

		// expect(Cache.categories).toHaveBeenCalled();
		// expect($scope.categories).toEqual([{name:"Cat1"}]);
	}));


});