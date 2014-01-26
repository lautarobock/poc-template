define(["../DataHelper.js"], function(DataHelper) {
	/*
    - Genenral
     - Con mas %. Top 3 & Bottom 3
     - Con mas ptos. Top 3 & Bottom 3
     - Con max IBUS. Top 3 & Bottom 3
    - Por cantidad
     - Por mes, 12 meses.
     - Por estilo. (3 estilos + otros)
     - Por categoria. (3 cat + otros)
     - Por cerveceria. (3 cerv + otros)
    - Por Puntaje
     - Por mes, 12 meses.
     - Por estilo. (3 estilos + otros)
     - Por categoria. (3 cat + otros)
     - Por cerveceria. (3 cerv + otros)
    */    
	describe("StatsService", function() {

		it("Should calculate stats", function() {
			var myStats = StatsService.myStats(DataHelper.ratings);

			//Count
			expect(myStats.count).toBe(238);
			expect(myStats.rated).toBe(238-25);
			expect(myStats.breweries.length).toBe(137);
			expect(myStats.styles.length).toBe(58);
			expect(myStats.categories.length).toBe(21);
		});

	});

});