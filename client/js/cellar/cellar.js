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
                
            },
            decBeer: function(beer) {
                var f = util.Arrays.filter(cellars, function(item) {
                    return item.beer == beer._id ? 0 : -1;
                });
                if ( f.length != 0 ) {
                    f[0].amount--;
                    f[0].$save()
                }
                
            }
        };
    }]);

    cellar.controller("CellarController", ['$scope','CellarService','Cellar','$translate','$filter', 'DLHelper',
        function($scope,CellarService,Cellar,$translate,$filter,DLHelper) {
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
                    field:'beer.score.avg',
                    caption: $translate('beer.data.score'),
                    width: '7em',
                    tooltip: $translate('beer.data.score.help'),
                    class: function(cellar) {
                        if ( cellar.beer.score ) {
                            return 'badge alert-' + DLHelper.colorByScore(cellar.beer.score.avg);        
                        } else {
                            return 'badge';
                        }
                    }
                },{
                    field: 'amount',
                    width: '10em',
                    caption: $translate('cellar.amount')
                },{
                    field:'date',
                    caption: 'Fecha',
                    width: '14em',
                    format: function(value) {
                        return $filter('date')(value,'dd-MM-yyyy');
                    }
                }
            ]
        };
    
    }]);


    return cellar;
});