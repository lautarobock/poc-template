var activity = require("../../routes/activity.js");
var model = require("../../domain/model.js");

describe("activity.js", function() {

    var beer = {
        name: "Rochefort 10",
        _id: "Rochefort10-1389632051597"
    };

    var brewery = {
        name: "Braserie Rochefort",
        _id: "Rochefort"
    };

    var user = {
        _id: "user_id#001",
        name: "Lautaro Cozzani"
    };

    it("Should create activity for a new Beer", function(done) {

        spyOn(model.Activity, 'create');

        activity.newBeer(user,beer);

        expect(model.Activity.create).toHaveBeenCalledWith({
            user: user._id,
            type: activity.CREATE,
            model: activity.BEER,
            text: '<b>Lautaro Cozzani</b> ha cargado la cerveza <a href="#/beer/detail/Rochefort10-1389632051597">Rochefort 10</a> al sistema',
            date: jasmine.any(Date)
        }, jasmine.any(Function));

        done();

    });

    it("Should create activity for a modified Beer", function(done) {

        spyOn(model.Activity, 'create');

        activity.updateBeer(user,beer);

        expect(model.Activity.create).toHaveBeenCalledWith({
            user: user._id,
            type: activity.UPDATE,
            model: activity.BEER,
            text: '<b>Lautaro Cozzani</b> ha editado la cerveza <a href="#/beer/detail/Rochefort10-1389632051597">Rochefort 10</a>',
            date: jasmine.any(Date)
        }, jasmine.any(Function));

        done();

    });

    it("Should create activity for a new Brewery", function(done) {

        spyOn(model.Activity, 'create');

        activity.newBrewery(user,brewery);

        expect(model.Activity.create).toHaveBeenCalledWith({
            user: user._id,
            type: activity.CREATE,
            model: activity.BREWERY,
            text: '<b>Lautaro Cozzani</b> ha cargado la cerveceria <a href="#/brewery/detail/Rochefort">Braserie Rochefort</a> al sistema',
            date: jasmine.any(Date)
        }, jasmine.any(Function));

        done();

    });

    it("Should create activity for a modified Brewery", function(done) {

        spyOn(model.Activity, 'create');

        activity.updateBrewery(user,brewery);

        expect(model.Activity.create).toHaveBeenCalledWith({
            user: user._id,
            type: activity.UPDATE,
            model: activity.BREWERY,
            text: '<b>Lautaro Cozzani</b> ha editado los datos de la cerveceria <a href="#/brewery/detail/Rochefort">Braserie Rochefort</a>',
            date: jasmine.any(Date)
        }, jasmine.any(Function));

        done();

    });
});