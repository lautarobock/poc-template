var model = require('../domain/model.js');
var mongoose = require('mongoose');

exports.findAll = function(req, res) {
	model.Beer.find().populate('style').exec(function(err,results) {
        if ( err ) {
            res.send(err);    
        } else {
            res.send(results);
        }
    });    
};

exports.save = function(req, res) {
    console.log("INFO", "Beer.save");
    delete req.body._id;
    //Un-populate styles.
    model.Beer.findByIdAndUpdate(req.params.id,req.body,{upsert:true}).populate('styleByLabel').exec(function(err,results) {
        res.send(results);
    });
};