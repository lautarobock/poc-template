// var cats = db.categories.find();
var styles = db.styles.find();


while ( styles.hasNext() ) {
	var style = styles.next();
	var style_id = style._id;
	var cat_id = style_id.substr(0,2);
	print(cat_id);
	var cat = db.categories.findOne({_id: cat_id});
	print(JSON.stringify(cat));
	db.styles.update({_id:style_id},{$set:{category:cat_id}});
}