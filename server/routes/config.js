var rest = require("./rest");


var services = ["User","Style","StyleByLabel"];
var customIds = [false,true,true];

exports.createRoutes = function(app) {
    //Special for login
    app.get('/api/login/by_google/:google_id', require("./user").getForLogin);

    for( var i=0; i<services.length; i++ ) {
        rest.createAndBind(services[i], customIds[i], app, 'api/');
    }

    var beer = rest.create("Beer", true);
    beer.findAll = require("./beer").findAll;
    // beer.save = require("./beer").save;
    // beer.findById = require("./beer").findById;
    rest.bind("Beer", beer, app, 'api/');
}

