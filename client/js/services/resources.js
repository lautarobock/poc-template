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

            function Package(data) {
                if ( data ) {
                    this.Name = data.Name;
                    this.Description = data.Description;
                    this.Id = data.Id;
                }
                this.query = function() {
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
                };
                this.get = function(params) {
                    for ( var i=0; i<this.query().length; i++ ) {
                        if ( this.query()[i].Id === params.Id ) {
                            return new Package(this.query()[i]);
                        }
                    }
                    return null;
                };
                this.defaults = function(params) {
                    return {
                        "Package.RunAsActiveUser": false,
                        "Package.RunAsUser": "lcozzani",
                        "Package.RunAsPassword": "pepe123",
                        "CSV Connector1.FilePath": "c:\\Users\\Public\\input.csv",
                        "CSV Connector1.IncludesHeader": true,
                        "Excel output1.FilePath": "c:\\Users\\Public\\output.csv",
                        "FilePath": "c:\\Users\\Public\\output2.csv"
                    };
                };
                this.template = function(params) {
                    return '<xml>Template</xml>';
                }
            };
            var mocks = {
                'api/packages/:Id/:mod': new Package()
            };
            return function(key) {
                return mocks[key];
            };
        });


})();
