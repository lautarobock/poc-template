var model = require('../domain/model.js');
var mongoose = require('mongoose');
var mongoutil = require("./util/mongoutil.js");

exports.findAll = function(req, res) {
	var query = model.Style.find();
	query.populate('category');
    query.exec(function(err,results) {
        res.send(results);
    });    
};