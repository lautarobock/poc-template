define(["../DataHelper.js"], function(DataHelper) {

    describe("rating", function() {

        beforeEach(angular.mock.module('dl.rating'));

        it("Should load my ratings", inject(function(RatingService,Rating) {
            
            //Spies
            spyOn(Rating,'query').andReturn(DataHelper.ratings);

            //Invoke
            RatingService.loadMyRatings();

            //Expecttion
            expect(RatingService.ratings().length).toBe(238);
            expect(Rating.query).toHaveBeenCalled();


            //if reload has to override
            //Invoke
            RatingService.loadMyRatings();

            //Expecttion
            expect(RatingService.ratings().length).toBe(238);
            
        }));

        it("Should get avg for a beer", inject(function(RatingService,Rating) {
            
            //Spies
            spyOn(Rating,'query').andReturn(DataHelper.ratings);
            //Invoke
            RatingService.loadMyRatings();

            //One with 2 ratings
            var beer = {_id: 'ChimayBleue-1389283543635'};
            var avg = RatingService.avgForBeer(beer);
            //Expecttion
            expect(avg).toBe(42.5);

            //With only one rating
            beer = {_id: 'CruzcampoPremiumLager-1389282926949'};
            avg = RatingService.avgForBeer(beer);
            //Expecttion
            expect(avg).toBe(11);

            //Without rating
            beer = {_id: 'LagartoBarbudo-1389790340838'};
            avg = RatingService.avgForBeer(beer);
            //Expecttion
            expect(avg).toBe(-1);

            //not drunked
            beer = {_id: 'Pepe'};
            avg = RatingService.avgForBeer(beer);
            //Expecttion
            expect(avg).toBeNull();
            
        }));

        // afterEach(inject(function($httpBackend) {
        //     $httpBackend.verifyNoOutstandingExpectation();
        //     $httpBackend.verifyNoOutstandingRequest();
        // }));

    });

});