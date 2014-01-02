var model = require('../domain/model.js');

function buildNewUser(google_id, name, email) {
    var user = new model.User();
    user.google_id = google_id;
    user.name = name;
    user.lastLoginDate = new Date();
    user.creationDate = new Date();
    user.isAdmin = false;
    user.email = email;
    return user;
}

exports.getForLogin = function(req, res){
    model.User.findOne({'google_id':req.params.google_id}).exec(function(err,user) {
        if (user) {
            
            //Set data in session (maybe must doit in filter)
            var s = req.session;
            s.user_id = user._id;
            s.user_name = user.name;
            s.user_isAdmin = user.isAdmin;
            
            user.lastLoginDate = new Date();
            
            user.save();

            res.send(user);
        } else {
            var newUser = buildNewUser(req.params.google_id,req.query.name, req.query.email);
            model.User.create(newUser,function(err,newuser) {
                var s = req.session;
                s.user_id = newuser._id;
                s.user_name = newuser.name;
                s.user_isAdmin = newuser.isAdmin;
                res.send(newuser);
            });
        }

    });   
};