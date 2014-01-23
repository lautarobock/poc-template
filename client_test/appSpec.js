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
				console.log("CHANGE");
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

	//Take off to ther file
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




	});

	//Take to other file
	describe("dl.misc", function() {

		describe("Cache", function() {

			beforeEach(angular.mock.module('dl.misc'));

			it("Should Cache return always same object", 
				inject(function(Cache,$rootScope,$httpBackend) {

					$httpBackend.expectGET('/api/Category?').respond([]);
					var cats1 = Cache.categories();
					var cats2 = Cache.categories();
					$httpBackend.flush();
					expect(cats1).toBe(cats2);

					$httpBackend.expectGET('/api/Style?').respond([]);
					var styles1 = Cache.styles();
					var styles2 = Cache.styles();
					$httpBackend.flush();
					expect(styles1).toBe(styles2);
					
				})
			);

			afterEach(inject(function($httpBackend) {
				$httpBackend.verifyNoOutstandingExpectation();
	     			$httpBackend.verifyNoOutstandingRequest();
			}));

		});

		describe("MainTitle", function() {

			beforeEach(angular.mock.module('dl.misc'));

			it("Should get main title", inject(function(MainTitle) {
				//At first the empty one
				expect(MainTitle.get()).toBe("");

				//Next what I've set
				MainTitle.set("This is my new Main Title");
				expect(MainTitle.get()).toBe("This is my new Main Title");

				//And if change
				MainTitle.set("Other Main Title");
				expect(MainTitle.get()).toBe("Other Main Title");

			}));

			it("Should set secondary title", inject(function(MainTitle) {
				//At first the empty one
				expect(MainTitle.get()).toBe("");

				//set Main Title
				MainTitle.set("Main Title");
				expect(MainTitle.get()).toBe("Main Title");

				//set Secondary title
				MainTitle.add("Secondary");
				expect(MainTitle.get()).toBe("Secondary - Main Title");

				//change Secondary title
				MainTitle.add("Other");
				expect(MainTitle.get()).toBe("Other - Main Title");

				//Clear
				MainTitle.clearAdd();
				expect(MainTitle.get()).toBe("Main Title");			

			}));

			it("Should replace title", inject(function(MainTitle) {
				//At first the empty one
				expect(MainTitle.get()).toBe("");

				//set Main Title
				MainTitle.set("Main Title");
				expect(MainTitle.get()).toBe("Main Title");

				//Set new title
				MainTitle.replace("Brand new Title");
				expect(MainTitle.get()).toBe("Brand new Title");

				//Clear it
				MainTitle.clearReplace();
				expect(MainTitle.get()).toBe("Main Title");

				//Replace is over title and but not over subtitle
				MainTitle.replace("Brand new Title");
				expect(MainTitle.get()).toBe("Brand new Title");
				MainTitle.add("Secondary");
				expect(MainTitle.get()).toBe("Secondary - Main Title");
				MainTitle.clearReplace();
				MainTitle.clearAdd();
				expect(MainTitle.get()).toBe("Main Title");
				MainTitle.add("Secondary");
				expect(MainTitle.get()).toBe("Secondary - Main Title");
				MainTitle.replace("Brand new Title");
				expect(MainTitle.get()).toBe("Secondary - Main Title");

			}));

		});

	});

});