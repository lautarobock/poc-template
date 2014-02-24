var model = require('../domain/model.js');
var mongoose = require('mongoose');
var activity = require("./activity.js");


exports.save = function(req, res) {
    delete req.body._id;
    var id = req.params.id;
    var now = new Date();

    var brewery = req.body;

    var isNew = false;
    if ( !brewery.creationDate ) isNew = true;


    if ( !brewery.creationDate ) brewery.creationDate = new Date();
    brewery.updateDate = new Date();
    if ( !brewery.createdBy ) brewery.createdBy = req.session.user_id;

    if ( !brewery.version || brewery.version.length == 0 ) {
        brewery.version = [{
            number: 1,
            user_id: req.session.user_id,
            timeStamp: now,
            user_name: req.session.user_name
        }];
    } else {
        var oldV = brewery.version[brewery.version.length-1];
        brewery.version.push({
            number: oldV.number+1,
            user_id: req.session.user_id,
            timeStamp: now,
            user_name: req.session.user_name
        });
    }


    model.Brewery.findByIdAndUpdate(id,brewery,{upsert:true}).exec(function(err,results) {
        var user = {
            _id: req.session.user_id,
            name: req.session.user_name
        }
        if ( isNew ) {
            activity.newBrewery(user, results);
        } else {
            activity.updateBrewery(user, results);
        }
        res.send(results);
    });
};