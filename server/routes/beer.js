var model = require('../domain/model.js');
var mongoose = require('mongoose');
var mongoutil = require("./util/mongoutil.js");

exports.findAll = function(req, res) {
	model.Beer.find()
        .populate('style')
        .populate('styleByLabel')
        .populate('brewery')
        .populate('category')
        .exec(function(err,results) {
            res.send(results);
    });    
};

exports.save = function(req, res) {
    delete req.body._id;
    var now = new Date();
    req.body.updateDate = now;
    if ( !req.body.version || req.body.version.length == 0 ) {
        req.body.version = [{
            number: 1,
            user_id: req.session.user_id,
            timeStamp: now,
            user_name: req.session.user_name
        }];
        req.body.creationDate = now;
        req.body.createdBy = req.session.user_id;
    } else {
        var oldV = req.body.version[req.body.version.length-1];
        req.body.version.push({
            number: oldV.number+1,
            user_id: req.session.user_id,
            timeStamp: now,
            user_name: req.session.user_name
        });
    }
    model.Beer.findByIdAndUpdate(req.params.id,req.body,{upsert:true})
        .exec(function(err,results) {
            if ( err ) {
                console.log("ERR", err);
                throw err;
            }
            res.send(results);
        }
    );
};

exports.findById = function(req, res) {
    var query = model.Beer.findOne({_id:req.params.id});
    if ( req.query.populate ) {
        query.populate('styleByLabel')
        query.populate('style')
        query.populate('brewery')
        query.populate('category')
    }
    query.exec(function(err,results) {
        res.send(results);
    });  
};