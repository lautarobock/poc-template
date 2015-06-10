(function() {
    angular.module('resources', ['ngResource'])
        .factory('Package', function($resource) {
            return $resource('api/packages/:Id/:mod',{guid:'@Id'}, {
                query: {method:'GET',params: {mod:'',Id:''}},
                templates: {method:'GET',params: {mod:'template'}},
                defaults: {method:'GET',params: {mod:'defaults'}},
            });
        })

        //Uncomment this for  use resource client mocks
        .factory('$resource', function() {
            var mocks = {
                'api/packages/:Id/:mod': {
                    query: function() {
                        return [{
                            Name: 'New Package',
                            Description: null,
                            Id: "38e9b4f9-8dd6-4e53-8919-a9d107e1d6e6"
                        },{
                            Name: 'Other Package',
                            Description: 'This is another Package',
                            Id: "xxxxxxx-eeeee-ffff-ffff-gggg"
                        },{
                            Name: 'Package III',
                            Description: 'This is a 3rd package of the list',
                            Id: "xxxxxxx-eeeee-ffff-ffff-aaaa"
                        }];
                    },
                    get: function(params) {
                        for ( var i=0; i<this.query().length; i++ ) {
                            if ( this.query()[i].Id === params.Id ) {
                                return this.query()[i];
                            }
                        }
                        return null;
                    }
                }
            };
            return function(key) {
                return mocks[key];
            };
        });


})();
