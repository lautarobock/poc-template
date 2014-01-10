var rating = require("../../routes/rating");
var model = require("../../domain/model");

describe("rating.js", function() {

    var createBeer = function(index) {
        return {
            _id: "beer_#"+index,
            score: {
                avg: 0
            },
            save: function(callback) {callback();}
        };
    }

    it("Should update al percentiles", function(done) {

        var count = 50;

        var beers = [];
        for ( var i=0; i<count; i++) {
            beers.push(createBeer(i));
        }

        var query = {
            sort: function() {
                return query;
            },
            exec: function(callback) {
                callback(null, beers);
            }
        };
        spyOn(model.Beer,'find').andReturn(query);

        rating.updatePercentil(null, function() {
            var size = Math.ceil(count/100);
            var rest = size;
            var actual = 1;
            for ( var i=0; i<count; i++) {
                expect(beers[i].score.overall).toBe((i+1)*2);
                // console.log(i,beers[i].score.overall);
            }

            done();
        }, null);
    });
});