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