var beers = db.beers.find();

while ( beers.hasNext() ) {
	var beer = beers.next();
	var style = db.styles.findOne({_id:beer.style});
	var cat = db.categories.findOne({_id:style.category});
	print(beer.name + ' -> '+style.name+'('+cat._id+')');
	db.beers.update({_id:beer._id},{$set:{category:cat._id}});
}