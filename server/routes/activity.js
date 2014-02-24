var Activity = require('../domain/model.js').Activity;
var mongoose = require('mongoose');
var util = require('util');
    
//Const
var BEER = "Beer";
var BREWERY = "Brewery";
var RATING = "Rating";
var USER = "User";
var CREATE = "new";
var UPDATE = "update";
var REMOVE = "remove";

exports.BEER = BEER;
exports.BREWERY = BREWERY;
exports.RATING = RATING;
exports.USER = USER;
exports.CREATE = CREATE;
exports.UPDATE = UPDATE;
exports.REMOVE = REMOVE;

var models = [BEER,BREWERY,RATING,USER];
var types = [CREATE,UPDATE,REMOVE];

var textStrategies = {};

textStrategies[BEER+CREATE] = function(user, beer) {
    return util.format('%s ha cargado la cerveza <a href="#/beer/detail/%s">%s</a> al sistema',user.name, beer._id, beer.name);
};

textStrategies[BEER+UPDATE] = function(user, beer) {
    return util.format('%s ha editado la cerveza <a href="#/beer/detail/%s">%s</a>',user.name, beer._id, beer.name);
};



function addFunction(m,t) {
    exports[t+m] = function(user, context) {
        exports.createActivity(user, m, t, context);
    }    
}

for( var i=0; i<models.length; i++ ) {
    for( var j=0; j<types.length; j++ ) {
        addFunction(models[i],types[j]);
    }
}


exports.createActivity = function(user, model, type, context) {
    var stg = textStrategies[model+type];
    var text = "";
    if ( stg ) text = stg(user,context);

    Activity.create({
        user: user._id,
        type: type,
        model: model,
        text: text,
        date: new Date()
    }, function(err) {
        if ( err ) {
            console.log("Error creation Ativity", err);
        }
    });
};

exports.findAll = function(req, res) {
    Activity.find().exec(function(err,results) {
        if ( err ) {
            res.send(err);    
        } else {
            res.send(results);
        }
    });    
}