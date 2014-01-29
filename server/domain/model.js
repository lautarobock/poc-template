var mongoose = require('mongoose');
var Schema = mongoose.Schema;


exports.User = mongoose.model("User",new Schema({
    google_id: String,
    name: String,
    email: String,
    creationDate: Date,
    lastLoginDate: Date,
    isAdmin: Boolean
  //   ,
  //   ratings: [{
  //   	beer: {type: String, ref: 'Beer'},
		// finalScore: [Number]
  //   }]
}));

exports.Rating = mongoose.model("Rating", new Schema({
	beer: {type: String, ref: 'Beer'},
	user: {type: String, ref: 'User'},
	score: {
		aroma: Number,
		appearance: Number,
		flavor: Number,
		mouthfeel: Number,
		overall: Number
	},
	finalScore: {type: Number, default: null},
	comments: String,
	bottled: Date,
	expiration: Date,
	mode: String,
	date: Date,
	place: String,
	creationDate: Date,
	updateDate: Date
}));

exports.Beer = mongoose.model("Beer", new Schema({
	_id: String,
	name: String,
	style: {type: String, ref: 'Style'},
	styleByLabel: {type: String, ref: 'StyleByLabel'},
    category: {type:String, ref:'Category'},
	score: {
		avg: Number,
		overall: Number,
		style: Number,
		count: Number,
        category: Number,
        position: Number
	},
	calories: Number,
	abv: Number,
	ibu: Number,
	og: Number,
	fg: Number,
    srm: Number,
	brewery: {type: String, ref: 'Brewery'},
	description: String,
	creationDate: Date,
	updateDate: Date,
	createdBy: {type:String, ref: 'User'},
	owners: [{type:String, ref: 'User'}],
    version: [{
        number: Number,
        user_id: String,
        timeStamp: Date,
        user_name: String
    }]

},{ _id: false }));

exports.Brewery = mongoose.model("Brewery",new Schema({
	"_id": String,
    "name": String,
    "web": String
},{ _id: false }));

exports.StyleByLabel = mongoose.model("StyleByLabel",new Schema({
	"_id": String,
    "name": String,
    "style": [{type: String, ref: 'Style'}]
},{ _id: false }));

exports.Style = mongoose.model("Style",new Schema({
	"_id": String,
    "name": String,
    "co2_min": Number,
    "co2_max": Number,
    "OG_Min": Number,
    "OG_Max": Number,
    "FG_Min": Number,
    "FG_Max": Number,
    "IBU_Min": Number,
    "IBU_Max": Number,
    "Colour_Min": Number,
    "Colour_Max": Number,
    "ABV_Min": Number,
    "ABV_Max": Number,
    "link": String,
    "related": String,
    "category": {type:String, ref:'Category'}
},{ _id: false }));

exports.Category = mongoose.model("Category",new Schema({
    "_id": String,
    "name": String
},{ _id: false }));

exports.Cellar = mongoose.model("Cellar",new Schema({
    "_id": String,
    "user": {type:String, ref: 'User'},
    "beer": {type:String, ref: 'Beer'},
    "size": Number,
    "amount": Number,
    "date": Date
},{ _id: false }));