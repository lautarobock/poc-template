//Take to other file
define(["util/util"], function() {
	describe("util", function() {


		it("Should cross 2 arrays", function() {

			var array1 = ["value1", "value2"];
			var array2 = ["value2", "value3"];
			
			var cross = util.Arrays.cross(array1,array2);

			expect(cross).toEqual(["value2"]);
				
		});


	});
});