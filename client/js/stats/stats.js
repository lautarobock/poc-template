define([], function() {

    var stats = angular.module("dl.stats", []);

    /*
    - Genenral
     - Cantidad de Tomadas
     - Cantidad puntuada
     - Cantidad de cervecerias
     - Cantidad de Esilos
     - Cantidad de categorias
     - Con mas %. Top 3 & Bottom 3
     - Con mas ptos. Top 3 & Bottom 3
     - Con max IBUS. Top 3 & Bottom 3
    - Por cantidad
     - Por mes, 12 meses.
     - Por estilo. (3 estilos + otros)
     - Por categoria. (3 cat + otros)
     - Por cerveceria. (3 cerv + otros)
    - Por Puntaje
     - Por mes, 12 meses.
     - Por estilo. (3 estilos + otros)
     - Por categoria. (3 cat + otros)
     - Por cerveceria. (3 cerv + otros)

    */

    stats.filter("notNull",['$interpolate', function($interpolate) {
        return function(list, field) {
            var result = [];
            angular.forEach(list, function(v) {
                var value = $interpolate("{{v."+field+"}}")({v:v});
                if ( value ) result.push(v);
            });
            return result;
        };
    }])

    stats.controller("StatsController", 
        ['$scope','Rating', 'StatsService', '$filter', 'Cache', '$translate', '$location', 'Brewery',
        function($scope,Rating, StatsService, $filter, Cache, $translate,$location, Brewery) {
            
            $scope.$watch("user", function(user) {
                if ( user ) {
                    loadData();
                }
            });


            function loadData() {
                $scope.styles = {};
                $scope.categories = {};
                $scope.breweries = {};
                $scope.context = $scope;
                Cache.styles(function(styles) {
                    angular.forEach(styles, function(style) {
                        $scope.styles[style._id] = style;
                    });
                });
                Cache.categories(function(cats) {
                    angular.forEach(cats, function(cat) {
                        $scope.categories[cat._id] = cat;
                    });
                });
                Brewery.query(function(breweries) {
                   angular.forEach(breweries, function(brewery) {
                        $scope.breweries[brewery._id] = brewery;
                    }); 
                });
                Rating.query(function(ratings) {
                    $scope.myStats = {};

                    if ( ratings.length == 0 ) return;

                    $scope.myStats = StatsService.myStats(ratings);
                    var orderBy = $filter('orderBy');
                    var filter = $filter('filter');
                    function abvDefined(rating) {
                        return rating.beer.abv;
                    }
                    function sortABV(rating) {
                        return rating.beer.abv || 0;
                    }
                    function sortOverall(rating) {
                        return rating.finalScore || 0;
                    }
                    function scoreDefined(rating) {
                        return rating.finalScore;
                    }
                    $scope.myStats.maxABV = orderBy(ratings,sortABV,true)[0].beer;
                    $scope.myStats.minABV = orderBy(filter(ratings,abvDefined),sortABV,false)[0].beer;
                    $scope.myStats.maxScore = orderBy(ratings,sortOverall,true)[0];
                    $scope.myStats.minScore = orderBy(filter(ratings,scoreDefined),sortOverall,false)[0];

                    $scope.styleTBConfig = {
                        rows: $scope.myStats.styles,
                        headers: [{
                            caption: $translate('beer.data.style'),
                            style: {width: '60%'},
                            value: "{{context.styles[row._id].name}} ({{row._id}})",
                            onClick: function(row) {
                                $location.path("/beer").search('style._id',row._id);
                            }
                        },{
                            caption: $translate('stats.amount'),
                            style: {width: '40%'},
                            value: "{{row.count}}"
                        }],
                        orderBy: 'count',
                        top: 3,
                        bottom: 3
                    };

                    $scope.styleAvgTBConfig = {
                        rows: $filter("notNull")($scope.myStats.styles,'avg.value'),
                        headers: [{
                            caption: $translate('beer.data.style'),
                            style: {width: '60%'},
                            value: "{{context.styles[row._id].name}} ({{row._id}})",
                            onClick: function(row) {
                                $location.path("/beer").search('style._id',row._id);
                            }
                        },{
                            caption: $translate('stats.avg'),
                            style: {width: '40%'},
                            value: "{{row.avg.value}} ({{row.count}})"
                        }],
                        orderBy: 'avg.value',
                        top: 3,
                        bottom: 3
                    };

                    $scope.catTBConfig = {
                        rows: $scope.myStats.categories,
                        headers: [{
                            caption: $translate('beer.data.style'),
                            style: {width: '60%'},
                            onClick: function(row) {
                                $location.path("/beer").search('category._id',row._id);
                            },
                            value: "{{context.categories[row._id].name}} ({{row._id}})"
                        },{
                            caption: $translate('stats.amount'),
                            style: {width: '40%'},
                            value: "{{row.count}}"
                        }],
                        orderBy: 'count',
                        top: 3,
                        bottom: 3
                    };

                    $scope.catAvgTBConfig = {
                        rows: $filter("notNull")($scope.myStats.categories,'avg.value'),
                        headers: [{
                            caption: $translate('beer.data.style'),
                            style: {width: '60%'},
                            onClick: function(row) {
                                $location.path("/beer").search('category._id',row._id);
                            },
                            value: "{{context.categories[row._id].name}} ({{row._id}})"
                        },{
                            caption: $translate('stats.avg'),
                            style: {width: '40%'},
                            value: "{{row.avg.value}} ({{row.count}})"
                        }],
                        orderBy: 'avg.value',
                        top: 3,
                        bottom: 3
                    };

                    $scope.breweriesTBConfig = {
                        rows: $scope.myStats.breweries,
                        headers: [{
                            caption: $translate('beer.data.brewery'),
                            style: {width: '60%'},
                            value: "{{context.breweries[row._id].name}}",
                            onClick: function(row) {
                                $location.path("/beer").search('brewery._id',row._id);
                            }
                        },{
                            caption: $translate('stats.amount'),
                            style: {width: '40%'},
                            value: "{{row.count}}"
                        }],
                        orderBy: 'count',
                        top: 3,
                        bottom: 3
                    };

                    $scope.breweriesAvgTBConfig = {
                        rows: $filter("notNull")($scope.myStats.breweries,'avg.value'),
                        headers: [{
                            caption: $translate('beer.data.brewery'),
                            style: {width: '60%'},
                            value: "{{context.breweries[row._id].name}}",
                            onClick: function(row) {
                                $location.path("/beer").search('brewery._id',row._id);
                            }
                        },{
                            caption: $translate('stats.avg'),
                            style: {width: '40%'},
                            value: "{{row.avg.value}} ({{row.count}})"
                        }],
                        orderBy: 'avg.value',
                        top: 3,
                        bottom: 3
                    };
                });
            }
    }]);

    stats.directive("tableTopBottom", function() {
        return {
            scope: {
                config: '=',
                context: '=?'
            },
            templateUrl: 'stats/table-top-bottom.html',
            controller: function($scope, $interpolate) {
                $scope.getValue = function (header, row) {
                    if ( header.value instanceof Function ) {
                        return header.value(row);    
                    } else {
                        return $interpolate(header.value)({row:row, context: $scope.context});
                    }
                    
                };
            }
        };
    });

    stats.factory("StatsService", function() {
        return StatsService;
    })

    return stats;
});