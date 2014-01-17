define(["resources"], function() {

    var cellar = angular.module('dl.cellar', ['dl.resources']);

    cellar.factory("CellarService", ['Cellar',function(Cellar) {
        var cellars = [];
        return {
            loadMyCellar: function() {
                cellars = Cellar.query();
            },
            countByBeer: function(beer) {
                var f = util.Arrays.filter(cellars, function(item) {
                    return item.beer == beer._id ? 0 : -1;
                });
                if ( f.length != 0 ) {
                    return f[0].amount;
                } else {
                    return '-';
                }
            },
            incBeer: function(beer) {
                var f = util.Arrays.filter(cellars, function(item) {
                    return item.beer == beer._id ? 0 : -1;
                });
                if ( f.length == 0 ) {
                    var cellar = new Cellar();
                    cellar._id = beer.name.replace(/[^a-z0-9]/ig, '') + new Date().getTime();
                    cellar.beer = beer._id;
                    cellar.amount = 1;
                    cellar.date = new Date();
                    cellar.$save(function(saved) {
                        cellars.push(saved);
                    });
                } else {
                    f[0].amount++;
                    f[0].$save()
                }
                
            }
        };
    }]);

    cellar.controller("CellarController", ['$scope','CellarService','Cellar','$translate','$filter',
        function($scope,CellarService,Cellar,$translate,$filter) {
        $scope.config = {
            data: Cellar,
            collection: Cellar.query({populate:true}),
            name: $translate('beer.data.beer')+'s',
            singular: $translate('beer.data.beer'),
            orderBy: "date",
            orderDir: "",
            pageSize: 10,
            headers: [{
                    field:'beer.name',
                    caption: $translate('beer.data.beer'),
                    type: 'link',
                    href: function(row) {return '#/beer/detail/' + row.beer._id;}
                },{
                    field: 'amount',
                    caption: $translate('cellar.amount')
                },{
                    field:'date',
                    caption: 'Fecha',
                    format: function(value) {
                        return $filter('date')(value,'dd-MM-yyyy');
                    }
                }
            ]
        };
    
    }]);


    return cellar;
});