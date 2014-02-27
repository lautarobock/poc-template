define(["resources","util/misc", "util/maps"], function() {

    var stats = angular.module("dl.stats", ['dl.resources','dl.misc','pascalprecht.translate','dl.maps']);

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

    stats.run(['$templateCache',function($templateCache) {
        $templateCache.put("stats-name.html",'<a href="" ng-click="header.onClick(row)">{{context()[row._id].name}}</a>');
    }]);

    stats.controller("StatsController", 
        ['$scope','Rating', 'StatsService', '$filter', 'Cache', '$translate', '$location', 'Brewery', 'GoTo',
        'MapFactory', '$timeout',
        function($scope,Rating, StatsService, $filter, Cache, $translate,$location, Brewery, GoTo,MapFactory,$timeout) {
            
            $scope.$watch("user", function(user) {
                if ( user ) {
                    loadData();
                }
            });


            $scope.tabs = [{
                name: 'general',
                caption: $translate('stats.general')
            },{
                name: 'styles',
                caption: $translate('beer.data.style')
            },{
                name: 'categories',
                caption: $translate('beer.data.category')
            },{
                name: 'breweries',
                caption: $translate('beer.data.brewery')
            },{
                name: 'map',
                caption: $translate('general.map')
            }];
            $scope.tabSelected = $scope.tabs[0];

            $scope.selectTab = function(tab) {
                $scope.tabSelected = tab;
            };


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

                    loadTableData();

                    loadCharts();

                    loadTabs();

                    loadMap(ratings);

                    //Rating per month chart
                    var categories = [];
                    var values = [];
                    var monthNames = [
                        $translate('month.january'),
                        $translate('month.february'),
                        $translate('month.march'),
                        $translate('month.april'),
                        $translate('month.may'),
                        $translate('month.june'),
                        $translate('month.july'),
                        $translate('month.august'),
                        $translate('month.september'),
                        $translate('month.october'),
                        $translate('month.november'),
                        $translate('month.december')
                    ];
                    angular.forEach(orderBy($scope.myStats.months,'_id'), function(month) {
                        var year = month._id.split("_")[0];
                        var monthValue = parseInt(month._id.split("_")[1]);
                        categories.push(monthNames[monthValue-1] + ' ' + year);
                        values.push(month.count);
                    });


                    $scope.beersPerMonth = {
                        options: {
                            chart: {
                                type: 'column'
                            },
                            title: {
                                text: $translate('stats.chart.beerPerMonth')
                            }
                        },
                        xAxis: {
                            categories: categories
                        },
                        yAxis: {
                            min: 0,
                            title: {
                                text: $translate('stats.amount')
                            }
                        },
                        tooltip: {
                            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                                '<td style="padding:0"><b>{point.y:.1f} mm</b></td></tr>',
                            footerFormat: '</table>',
                            shared: true,
                            useHTML: true
                        },
                        series: [{
                            name: $translate('beer.data.beer')+'s',
                            data: values
                        }]
                    };
                });
            }

            function loadTabs() {
                $scope.tabConfig = {};
                $scope.tabConfig.styles = {
                    collection: $scope.myStats.styles,
                    name: $translate('beer.data.style')+'s',
                    singular: $translate('beer.data.style'),
                    filterColSpan: 6,
                    orderBy: 'count',
                    orderDir: "-",
                    pageSize: 25,
                    emptyResultText: $translate('beer.search.emtpy'),
                    headers: [{
                        field:'_id',
                        caption: 'ID'
                    },{
                        field:'name',
                        type: 'link',
                        caption: $translate('beer.data.name'),
                        valueTemplateUrl: 'stats-name.html',
                        onClick: function(row) {
                            GoTo.style(row._id);
                        }

                    },{
                        field:'count',
                        caption: $translate('stats.amount')
                    },{
                        field:'avg.value',
                        caption: $translate('stats.avg')
                    }]
                };
                $scope.tabConfig.categories = {
                    collection: $scope.myStats.categories,
                    name: $translate('beer.data.category')+'s',
                    singular: $translate('beer.data.category'),
                    filterColSpan: 6,
                    orderBy: 'count',
                    orderDir: "-",
                    pageSize: 25,
                    emptyResultText: $translate('beer.search.emtpy'),
                    headers: [{
                        field:'_id',
                        caption: 'ID'
                    },{
                        field:'name',
                        caption: $translate('beer.data.name'),
                        valueTemplateUrl: 'stats-name.html',
                        onClick: function(row) {
                            GoTo.category(row._id);
                        }
                    },{
                        field:'count',
                        caption: $translate('stats.amount')
                    },{
                        field:'avg.value',
                        caption: $translate('stats.avg')
                    }]
                };
                $scope.tabConfig.breweries = {
                    collection: $scope.myStats.breweries,
                    name: $translate('beer.data.brewery')+'s',
                    singular: $translate('beer.data.brewery'),
                    filterColSpan: 6,
                    orderBy: 'count',
                    orderDir: "-",
                    pageSize: 25,
                    emptyResultText: $translate('beer.search.emtpy'),
                    headers: [{
                        field:'name',
                        caption: $translate('beer.data.name'),
                        valueTemplateUrl: 'stats-name.html',
                        onClick: function(row) {
                            GoTo.brewery(row._id);
                        }
                    },{
                        field:'count',
                        caption: $translate('stats.amount')
                    },{
                        field:'avg.value',
                        caption: $translate('stats.avg')
                    }]
                };
            }

            function loadCharts() {

                //Style chart
                var stylesCount = transformChartData($scope.myStats.styles, 9);
                $scope.styleChartConfig = getBaseChart(stylesCount, function() {
                    var style = $scope.styles[this.point.name] || {name:$translate('stats.others')};
                    return '<span style="font-size: 10px">'+style.name+'</span><br/><b>'+Math.round(this.percentage)
                                +'%</b> (' + this.y + ')';
                });

                var categoryCount = transformChartData($scope.myStats.categories, 9);
                $scope.categoryChartConfig = getBaseChart(categoryCount, function() {
                    var category = $scope.categories[this.point.name] || {name:$translate('stats.others')};
                    return '<span style="font-size: 10px">'+category.name+'</span><br/><b>'+Math.round(this.percentage)
                                +'%</b> (' + this.y + ')';
                });      
                
                var breweryCount = transformChartData($scope.myStats.breweries, 9);
                $scope.breweriesChartConfig = getBaseChart(breweryCount, function() {
                    var brewery = $scope.breweries[this.point.name] || {name:$translate('stats.others')};
                    return '<span style="font-size: 10px">'+brewery.name+'</span><br/><b>'+Math.round(this.percentage)
                                +'%</b> (' + this.y + ')';
                });
                $scope.breweriesChartConfig.options.plotOptions.pie.dataLabels.enabled = false;

                var countryCount = transformChartData($scope.myStats.countries, 9);
                $scope.countryChartConfig = getBaseChart(countryCount, function() {
                    var country = this.point.name || $translate('stats.others');
                    return '<span style="font-size: 10px">'+country+'</span><br/><b>'+Math.round(this.percentage)
                                +'%</b> (' + this.y + ')';
                });      
            }

            function getBaseChart(data, formatter) {
                return {
                    options: {
                        chart: {
                            reflow: false,
                            height: 250
                        },
                        title: {
                            text: null
                        },
                        plotOptions: {
                            pie: {
                                allowPointSelect: true,
                                cursor: 'pointer',
                                dataLabels: {
                                    enabled: true,
                                    distance: -20
                                },
                                showInLegend: false
                            }
                        },
                        tooltip: {
                            formatter: formatter
                        }
                    },
                    series: [{
                        type: 'pie',
                        name: $translate('stats.amount'),
                        data: data
                    }]
                };
            }



            function transformChartData(data, count) {
                var orderBy = $filter('orderBy');
                
                var sumOthers = 0;
                var result = [];
                angular.forEach(orderBy(data,'-count'), function(style, index) {
                    if ( index < count ) {
                        result.push([style._id,style.count]);
                    } else {
                        sumOthers += style.count;
                    }
                });
                if ( sumOthers > 0 ) {
                    result.push([$translate('stats.others'),sumOthers]);
                }
                return result;
            }

            function loadTableData() {

                $scope.styleTBConfig = {
                    rows: $scope.myStats.styles,
                    headers: [{
                        caption: $translate('beer.data.style'),
                        style: {width: '60%'},
                        value: "{{context.styles[row._id].name}} ({{row._id}})",
                        onClick: function(row) {
                            // $location.path("/beer").search('style._id',row._id);
                            GoTo.style(row._id);
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
                            GoTo.style(row._id);
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
                            // $location.path("/beer").search('category._id',row._id);
                            GoTo.category(row._id);
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
                            GoTo.category(row._id);
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
                            GoTo.brewery(row._id);
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
                            GoTo.brewery(row._id);
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

                $scope.countryTBConfig = {
                    rows: $scope.myStats.countries,
                    headers: [{
                        caption: $translate('beer.data.country'),
                        style: {width: '60%'},
                        // onClick: function(row) {
                        //     // $location.path("/beer").search('category._id',row._id);
                        //     GoTo.category(row._id);
                        // },
                        value: "{{row._id}}"
                    },{
                        caption: $translate('stats.amount'),
                        style: {width: '40%'},
                        value: "{{row.count}}"
                    }],
                    orderBy: 'count',
                    top: 3,
                    bottom: 3
                };

                $scope.countryAvgTBConfig = {
                    rows: $filter("notNull")($scope.myStats.countries,'avg.value'),
                    headers: [{
                        caption: $translate('beer.data.country'),
                        style: {width: '60%'},
                        // onClick: function(row) {
                        //     GoTo.category(row._id);
                        // },
                        value: "{{row._id}}"
                    },{
                        caption: $translate('stats.avg'),
                        style: {width: '40%'},
                        value: "{{row.avg.value}} ({{row.count}})"
                    }],
                    orderBy: 'avg.value',
                    top: 3,
                    bottom: 3
                };

            }

            function loadMap(ratings) {

                $scope.changeSource = function() {
                    var list = [];
                    angular.forEach(ratings, function(rating) { 
                        if ( $scope.conf.pointsSource == "rating" ) {
                            if ( rating.location && rating.location.latitude ) {
                                list.push({
                                    latitude: rating.location.latitude,
                                    longitude: rating.location.longitude,
                                    name: rating.location.name,
                                    icon: rating.location.icon,
                                    beer: rating.beer.name,
                                    popup: rating.beer.name + " - " + rating.location.name,
                                    _id: rating._id
                                });
                            }    
                        } else {
                            var brewery = $scope.breweries[rating.beer.brewery];
                            if ( brewery.location && brewery.location.latitude ) {
                                list.push({
                                    latitude: brewery.location.latitude,
                                    longitude: brewery.location.longitude,
                                    name: brewery.location.name,
                                    icon: brewery.location.icon,
                                    beer: brewery.name,
                                    popup: brewery.name + " - " + brewery.location.name,
                                    _id: brewery._id
                                });
                            }
                        }
                    });
                    $scope.map.setPoints(list);
                };

                $scope.conf = {
                    pointsSource: "rating"
                };

                $scope.map = MapFactory.map({
                    fit:true,
                    clusterOptions:{},
                    doCluster: true,
                    events: {
                        tilesloaded: function(map) {
                            $scope.$apply(function() {
                                $scope._map = map;
                            });
                        }
                    }
                });

                $scope.changeSource();
                
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