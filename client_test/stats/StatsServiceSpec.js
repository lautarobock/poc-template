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
            expect(myStats.unique).toBe(234);
			expect(myStats.breweries.length).toBe(137);
			expect(myStats.styles.length).toBe(58);
			expect(myStats.categories.length).toBe(21);
            expect(myStats.firstInDate).toBeDefined();
            expect(myStats.lastInDate).toBeDefined();
            expect(myStats.avgByDay).toBeDefined();
            
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

            expect(myStats.styles[0].avg.value).toBe(39.3);
            expect(myStats.styles[0]._id).toBe('18e');
            expect(myStats.styles[0].count).toBe(19);

            expect(myStats.categories[0]._id).toBe('18');
            expect(myStats.categories[0].count).toBe(66);
            expect(myStats.categories[0].avg.value).toBe(34.4);
            expect(myStats.categories[1]._id).toBe('22');
            expect(myStats.categories[1].count).toBe(2);
            expect(myStats.categories[1].avg.value).toBe(40);

            expect(myStats.breweries[0]._id).toBe('Mikkeller');
            expect(myStats.breweries[0].count).toBe(1);
            expect(myStats.breweries[0].avg.value).toBe(39);

            expect(myStats.months[0]._id).toBe('2014_01');
            expect(myStats.months[0].count).toBe(27);
            expect(myStats.months[1]._id).toBe('2012_12');
            expect(myStats.months[1].count).toBe(36);

            expect(myStats.countries.length).toBe(2);
            expect(myStats.countries[0].count).toBe(2);
            expect(myStats.countries[0]._id).toBe("España");
            expect(myStats.countries[0].avg.value).toBe(40.5);
            
            expect(myStats.countries[1].count).toBe(1);
            expect(myStats.countries[1]._id).toBe("Argentina");
            expect(myStats.countries[1].avg.value).toBe(44);

            expect(myStats.locations).toBeDefined();
            expect(myStats.locations[0].count).toBe(2);
            expect(myStats.locations[0]._id).toBe("Plaça de Sant Pere, 9");
            // expect(myStats.locations[0].name).toBe("Plaça de Sant Pere, 9, 08003 Barcelona, España");
            expect(myStats.locations[0].location.formatted_address).toBe("Plaça de Sant Pere, 9, 08003 Barcelona, España");
            expect(myStats.locations[0].avg.value).toBe(40.5);


		}));

	});

});