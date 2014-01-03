var model = require('../domain/model.js');
var mongoose = require('mongoose');
var mongoutil = require("./util/mongoutil.js");

exports.findAll = function(req, res) {
	model.Beer.find()
        .populate('style')
        .populate('styleByLabel')
        .exec(function(err,results) {
            res.send(results);
    });    
};

// exports.save = function(req, res) {
//     console.log("INFO", "Beer.save");
//     delete req.body._id;
//     model.Beer.findByIdAndUpdate(req.params.id,req.body,{upsert:true})
//         // .populate('styleByLabel')
//         // .populate('style')
//         .exec(function(err,results) {
//             console.log("INFO", "results",results);
//             res.send(results);
//         }
//     );
// };

// exports.findById = function(req, res) {
//     model.Beer.findOne({_id:req.params.id})
//         // .populate('styleByLabel')
//         // .populate('style')
//         .exec(function(err,results) {
//             res.send(results);
//     });  
// };