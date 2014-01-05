var model = require('../domain/model.js');
var mongoose = require('mongoose');
var mongoutil = require("./util/mongoutil.js");

exports.findAll = function(req, res) {
	var query = model.Rating.find();
	query.populate('beer');
    query.exec(function(err,results) {
        res.send(results);
    });    
};

exports.save = function(req, res) {
	console.log("INFO","save rating");
	if ( !req.body._id ) {
		req.body.creationDate = new Date();
	}
	req.body.updateDate = new Date();
    delete req.body._id;
    var id = new mongoose.Types.ObjectId(req.params.id);
	model.Rating.findByIdAndUpdate(id,req.body,{upsert:true}).exec(function(err,results) {
        res.send(results);
    });	
};