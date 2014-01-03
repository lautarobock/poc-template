var rest = require("./rest");
var model = require("../domain/model.js");
var beerService = require("./beer")


/**
 * Filtro para detectar qeu haya un usuario logueado
 */
function userFilter(req,res,next){
    console.log("checking user");
    var s = req.session;
    if ( req.query.google_id ) {
        model.User.findOne({'google_id':req.query.google_id}).exec(function(err,user) {
            if (user) {
                var s = req.session;
                console.log("Set User_Id in session: " + user._id);
                s.user_id = user._id;
                s.user_name = user.name;
                s.user_isAdmin = user.isAdmin;
                next();
            } else {
                console.log("null");
                res.send(401,{error:'Operacion no autorizada'});
            }
        });   
    } else {
        console.log("null");
        res.send(401,{error:'Operacion no autorizada'});
    }
}

var services = [{
    name: "Brewery",
    customId: true
},{
    name: "User"
},{
    name: "Style",
    customId: true
},{
    name: "StyleByLabel",
    customId: true
},{
    name: "Beer",
    customId: true,
    security: {save:[userFilter]},
    process: function(rest) {
        rest.findAll = beerService.findAll;
        rest.findById = beerService.findById;
        rest.save = beerService.save;
    }
}];

exports.createRoutes = function(app) {
    //Special for login
    app.get('/api/login/by_google/:google_id', require("./user").getForLogin);

    for( var i=0; i<services.length; i++ ) {
        if ( services[i].process ) {
            var s = rest.create(services[i].name, true);
            services[i].process(s);
            rest.bind(services[i].name, s, app, 'api/', services[i].security);
        } else {
            rest.createAndBind(services[i].name, services[i].customId, app, 'api/', services[i].security);
        }
        
    }
}

