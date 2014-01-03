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