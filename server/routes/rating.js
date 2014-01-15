var model = require('../domain/model.js');
var mongoose = require('mongoose');
var mongoutil = require("./util/mongoutil.js");
var async = require("async");

exports.findAll = function(req, res) {
	var query = model.Rating.find({user:req.session.user_id});
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
		beer.score.avg = Math.round((sum / count)*10)/10;
		beer.score.count = count;
		beer.save(function(err, beer) {
			async.series([
					function (callback) {
						exports.updatePercentil(null, callback);
					},
					function (callback) {
						exports.updatePercentil(beer.style, callback);
					},
					function (callback) {
						exports.updatePercentil(null, callback, beer.category);
					}
				],
				function(err) {
					if ( callback ) callback(beer);
			});
		});
	});
}

exports.updatePercentil = function(style_id, callback, category_id) {
	

	var filter = {};
	if ( style_id ) {
		filter = {style:style_id,'score.avg':{$exists:true}};
	} else if ( category_id ) {
		filter = {category:category_id,'score.avg':{$exists:true}};
	} else  {
		filter = {'score.avg':{$exists:true}};
	}
	model.Beer.find(filter).sort('score.avg score.count').exec(function(err, beers) {
		var count = beers.length;
		var actualPos = 1;
		var actualValue = Math.ceil(count*actualPos/100);
		var position = count;
		var updateBeers = function(beers,i) {
			if ( i<=count ) {
				var beer = beers[i-1];
				while ( i >= actualValue )  {
					actualPos++;
					actualValue = Math.ceil(count*actualPos/100);
				}
				if ( style_id) {
					beer.score.style = actualPos-1;
				} else if ( category_id ) {
					beer.score.category = actualPos-1;
				} else {
					beer.score.overall = actualPos-1;
					beer.score.position = position--;
				}
				beer.save(function() {
					updateBeers(beers,i+1);
				});
			} else {
				if ( callback ) callback();
			}
		}

		updateBeers(beers,1)
		
	});

}

exports.updatePercentilOld = function(style_id, callback, category_id) {
	var actual = 100;

	var filter = {};
	if ( style_id ) {
		filter = {style:style_id,'score.avg':{$exists:true}};
	} else if ( category_id ) {
		filter = {category:category_id,'score.avg':{$exists:true}};
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
				} else if ( category_id ) {
					beer.score.category = actual;
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

exports.getByBeer = function(req, res) {
	var query = model.Rating.find({beer:req.query.beer_id});
	query.populate("user");
    query.exec(function(err,results) {
    	if ( err ) throw err;
        res.send(results);
    });
};