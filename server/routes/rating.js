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
		if ( req.body.finalScore ) {
			//Si le puse score, recalculo el avg de la birra y luego todos los percentiles.
			model.Beer.findOne({_id: req.body.beer}).exec(function (err,beer) {
				exports.updateRating(beer, function() {
					res.send(results);
				});
			});	
		} else {
			res.send(results);
		}
    });	
};

exports.updateRating = function(beer,callback) {
	model.Rating.find({beer:beer._id}).exec(function(err, ratings) {
		var count = 0;
		var sum = 0;
		for ( var i=0; i<ratings.length; i++ ) {
			if ( ratings[i].finalScore ) {
				sum += ratings[i].finalScore;
				count++;
			}
		}
		beer.score.avg = sum / count;
		beer.score.count = count;
		beer.save(function(err, beer) {
			exports.updatePercentil(null, function(err) {
				exports.updatePercentil(beer.style, function(err) {
					if ( callback ) callback(beer);
				});
			});
		});
	});
}

exports.updatePercentil = function(style_id, callback) {
	var actual = 100;

	var filter = {};
	if ( style_id ) {
		filter = {style:style_id,'score.avg':{$exists:true}};
	} else  {
		filter = {'score.avg':{$exists:true}};
	}
	model.Beer.find(filter).sort('-score.avg').exec(function(err, beers) {
		if ( err ) console.log("ERR",err);
		var count = beers.length;
		var byPerc = Math.ceil(count/100);
		var actPercRest = byPerc;
		
		var updateBeers = function(beers,i) {
			if ( i<count ) {
				var beer = beers[i];
				if ( style_id) {
					beer.score.style = actual;
				} else {
					beer.score.overall = actual;
				}
				actPercRest--;
				if ( actPercRest == 0 ) {
					actual--;
					actPercRest = byPerc;
				}
				beer.save(function() {
					updateBeers(beers,i+1);
				});
			} else {
				callback();
			}
		}

		updateBeers(beers,0)
		
	});

}