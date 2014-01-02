var rest = require("./rest");


var services = ["User"];

exports.createRoutes = function(app) {
    //Special for login
    app.get('/api/login/by_google/:google_id', require("./user").getForLogin);

    for( var i=0; i<services.length; i++ ) {
        rest.createAndBind(services[i], false, app, 'api/');
    }
}

