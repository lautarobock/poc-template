var rest = require("./rest");
var model = require("../domain/model.js");
var beerService = require("./beer");
var ratingService = require("./rating");
var styleService = require("./style");
var cellarService = require("./cellar");
var breweryService = require("./brewery");
var activityService = require("./activity");
var vintageCellar = require("./vintage");

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
    customId: true,
    security: {save: [userFilter]},
    process: function(rest) {
        rest.save = breweryService.save;
    }
},{
    name: "Rating",
    security: {findAll:[userFilter]},
    process: function(rest) {
        rest.findAll = ratingService.findAll;
        rest.save = ratingService.save;
        rest.remove = ratingService.remove;
    }
},{
    name: "Cellar",
    security: {
        save:[userFilter],
        findAll:[userFilter]
    },
    process: function(rest) {
        rest.save = cellarService.save;
        rest.findAll = cellarService.findAll;
    }
},{
    name: "User"
},{
    name: "Style",
    customId: true,
    process: function(rest) {
        rest.findAll = styleService.findAll;
    }
},{
    name: "StyleByLabel",
    customId: true
},{
    name: "Category",
    customId: true
},{
    name: "Cellar",
    customId: true
},{
    name: "VintageCellar",
    customId: true,
    security: {
        save:[userFilter],
        findAll:[userFilter]
    },
    process: function(rest) {
        rest.save = vintageCellar.save;
        rest.findAll = vintageCellar.findAll;
    }
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

    //Special for raging by beer
    app.get('/api/Rating/byBeer', require("./rating").getByBeer);

    //Special for activity
    app.get('/api/Activity', activityService.findAll);

    //Special for count filtered beer.
    app.get('/api/Beer/count', beerService.count);

    app.delete('/api/Cellar',userFilter, cellarService.clearZeros);

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
