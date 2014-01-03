var mongoutil = require("../../../routes/util/mongoutil");

describe("/routes/util/mongoutil.js", function() {

    var entity;

    var entityCopy = {
        name: "Jose",
        address: {
            _id: "address_id",
            street: "Freneria"
        },
        work: {
            _id: "work_id",
            name: "Scytl"
        },
        friends: [{
            _id: "friend_id_#1",
            name: "Pepe"
        },{
            _id: "friend_id_#2",
            name: "Josele"
        }]
    };

    var entityUnPopulateAddress = {
        name: "Jose",
        address: "address_id",
        work: {
            _id: "work_id",
            name: "Scytl"
        },
        friends: [{
            _id: "friend_id_#1",
            name: "Pepe"
        },{
            _id: "friend_id_#2",
            name: "Josele"
        }]
    };

    var entityUnPopulateAll1to1 = {
        name: "Jose",
        address: "address_id",
        work: "work_id",
        friends: [{
            _id: "friend_id_#1",
            name: "Pepe"
        },{
            _id: "friend_id_#2",
            name: "Josele"
        }]
    };

    var entityUnPopulate1toN = {
        name: "Jose",
        address: {
            _id: "address_id",
            street: "Freneria"
        },
        work: {
            _id: "work_id",
            name: "Scytl"
        },
        friends: ["friend_id_#1","friend_id_#2"]
    };

    var entityUnPopulateAll = {
        name: "Jose",
        address: "address_id",
        work: "work_id",
        friends: ["friend_id_#1","friend_id_#2"]
    };

    beforeEach(function(done) {
        entity = {
            name: "Jose",
            address: {
                _id: "address_id",
                street: "Freneria"
            },
            work: {
                _id: "work_id",
                name: "Scytl"
            },
            friends: [{
                _id: "friend_id_#1",
                name: "Pepe"
            },{
                _id: "friend_id_#2",
                name: "Josele"
            }]
        };
        done();
    });

    it("Should unpopulate without parameters", function(done) {
        mongoutil.unpopulate(entity);

        expect(entity).toEqual(entityCopy);

        done();
    });

    it("Should unpopulate non-existing path/s", function(done) {
        mongoutil.unpopulate(entity,"cocoa");

        expect(entity).toEqual(entityCopy);

        mongoutil.unpopulate(entity,["cocoa"]);

        expect(entity).toEqual(entityCopy);

        done();
    });

    it("Should unpopulate path 1->1", function(done) {
        mongoutil.unpopulate(entity,"address");
        expect(entity).toEqual(entityUnPopulateAddress);
        done();
    });

    it("Should unpopulate paths 1->1", function(done) {
        mongoutil.unpopulate(entity,["address","non-existing","work"]);
        expect(entity).toEqual(entityUnPopulateAll1to1);
        done();
    });

    it("Should unpopulate path 1->n", function(done) {
        mongoutil.unpopulate(entity,"friends");
        expect(entity).toEqual(entityUnPopulate1toN);
        done();
    });    
});