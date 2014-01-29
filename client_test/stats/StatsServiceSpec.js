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

		it("Should calculate stats", inject(function($filter) {
			var myStats = StatsService.myStats(DataHelper.ratings);

			//Count
			expect(myStats.count).toBe(238);
			expect(myStats.rated).toBe(238-25);
			expect(myStats.breweries.length).toBe(137);
			expect(myStats.styles.length).toBe(58);
			expect(myStats.categories.length).toBe(21);
            
            var orderBy = $filter("orderBy");
            var limitTo = $filter("limitTo");
            byCount = orderBy(myStats.styles,'count',true);
            var top3 = limitTo(byCount,3);
            var bottom3 = limitTo(byCount,-3);

            expect(byCount.length).toBe(58);
            expect(top3.length).toBe(3);
            expect(bottom3.length).toBe(3);
            expect(top3[0]._id).toBe('18e');
            expect(top3[1]._id).toBe('01b');
            expect(top3[2]._id).toBe('18c');
            expect(bottom3[0]._id).toBe('17b');
            expect(bottom3[1]._id).toBe('11a');
            expect(bottom3[2]._id).toBe('21b');

            expect(myStats.styles[0].avg.value).toBeDefined();

            expect(myStats.categories[0].count).toBeDefined();
            expect(myStats.categories[0]._id).toBeDefined();

            expect(myStats.breweries[0].count).toBeDefined();
            expect(myStats.breweries[0]._id).toBeDefined();

		}));

	});

});