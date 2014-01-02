var model = require("../../domain/model");
var rest = require("../../routes/rest");
var supertest = require("supertest");
var mongoose = require("mongoose");

describe("rest.js", function() {

    function createReq(params,body) {
        return {
            params: params,
            body: body
        };
    }

    function createRes() {
        return {
            send: function(data) {
                console.log("INFO", data);
            }
        };
    }

    it("Should create a Rest Express Service for a Mongoose Model", function(done) {
        var User = rest.create("User");
        
        expect(User.findAll).toBeDefined();
        expect(User.findById).toBeDefined();
        expect(User.save).toBeDefined();
        expect(User.remove).toBeDefined();

        done();
    });    

    it("Should call delegate findOne() to model.User.findOne()", function(done) {
        //Configure
        var User = rest.create("User");
        var req = createReq({id: '#USER_ID'});
        var res = createRes();
        
        //Mocks
        spyOn(model.User,'findOne').andCallFake(function (params, callback) {
            callback(null, {
                id: params._id,
                name: "Fake User"
            })
        });

        spyOn(res, 'send');
        
        //Invoke
        User.findById(req, res);
        
        //Expectations
        expect(model.User.findOne).toHaveBeenCalledWith({_id:'#USER_ID'}, jasmine.any(Function));
        expect(res.send).toHaveBeenCalledWith({id: '#USER_ID',name: "Fake User"});

        done();
    });

    it("Should call delegate findAll() to model.User.find()", function(done) {
        //Configure
        var User = rest.create("User");
        var req = createReq();
        var res = createRes();
        
        //Mocks
        spyOn(model.User,'find').andReturn({
            exec: function(callback) {
                callback(null, [{
                    _id: 'USER_ID#1',
                    name: 'Fake #1'
                },{
                    _id: 'USER_ID#2',
                    name: 'Fake #2'
                }]);
            }
        });

        spyOn(res, 'send');
        
        //Invoke
        User.findAll(req, res);
        
        //Expectations
        expect(model.User.find).toHaveBeenCalled();
        expect(res.send).toHaveBeenCalledWith(jasmine.any(Array));

        done();
    });

    it("Should call delegate save() to model.User.findByIdAndUpdate() with upsert:true (ObjectID)", function(done) {
        //Configure
        var User = rest.create("User");
        //For insert
        var req = createReq({},{name:"Fake Name"});
        var res = createRes();
        
        //Mocks
        spyOn(model.User,'findByIdAndUpdate').andCallFake(function(id, data, options) {
            return {
                exec: function( callback ) {
                    callback(null, {
                        _id: id,
                        name:"Fake Name"
                    });
                }
            };
        });

        spyOn(res, 'send');
        
        //Invoke
        User.save(req, res);
        
        //Expectations
        expect(model.User.findByIdAndUpdate).toHaveBeenCalledWith(jasmine.any(mongoose.Types.ObjectId),{name:"Fake Name"},{upsert:true});
        expect(res.send).toHaveBeenCalledWith({
            _id: jasmine.any(mongoose.Types.ObjectId),
            name:"Fake Name"
        });


        //For edit
        var req = createReq({id: '123456789012'},{_id: '123456789012',name:"Fake Name"});

        User.save(req, res);
        
        //Expectations
        expect(model.User.findByIdAndUpdate).toHaveBeenCalledWith(new mongoose.Types.ObjectId('123456789012'),{name:"Fake Name"},{upsert:true});
        expect(res.send).toHaveBeenCalledWith({
            _id: new mongoose.Types.ObjectId('123456789012'),
            name:"Fake Name"
        });        


        done();
    });

    it("Should call delegate save() to model.User.findByIdAndUpdate() with upsert:true (Custom ID)", function(done) {
        //Configure
        var User = rest.create("User",true);
        //For insert
        var req = createReq({id: '123456789012'},{_id: '123456789012',name:"Fake Name"});
        var res = createRes();
        
        //Mocks
        spyOn(model.User,'findByIdAndUpdate').andCallFake(function(id, data, options) {
            return {
                exec: function( callback ) {
                    callback(null, {
                        _id: id,
                        name:"Fake Name"
                    });
                }
            };
        });

        spyOn(res, 'send');
        
        //Invoke
        User.save(req, res);
        
        //Expectations
        expect(model.User.findByIdAndUpdate).toHaveBeenCalledWith('123456789012',{name:"Fake Name"},{upsert:true});
        expect(res.send).toHaveBeenCalledWith({
            _id: '123456789012',
            name:"Fake Name"
        });


        //For edit
        req = createReq({id: '123456789012'},{_id: '123456789012',name:"Fake Name"});

        User.save(req, res);
        
        //Expectations
        expect(model.User.findByIdAndUpdate).toHaveBeenCalledWith('123456789012',{name:"Fake Name"},{upsert:true});
        expect(res.send).toHaveBeenCalledWith({
            _id: '123456789012',
            name:"Fake Name"
        });        


        done();
    });

    it("Should call delegate remove() to model.User.findByIdAndRemove()", function(done) {
        //Configure
        var User = rest.create("User");
        var req = createReq({id: '#USER_ID'});
        var res = createRes();
        
        //Mocks
        spyOn(model.User,'findByIdAndRemove').andCallFake(function (id, callback) {
            callback(null, {
                id: id,
                name: "Fake User"
            })
        });

        spyOn(res, 'send');
        
        //Invoke
        User.remove(req, res);
        
        //Expectations
        expect(model.User.findByIdAndRemove).toHaveBeenCalledWith('#USER_ID', jasmine.any(Function));
        expect(res.send).toHaveBeenCalledWith({id: '#USER_ID',name: "Fake User"});

        done();
    });

});
