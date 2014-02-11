define(['../resources'], function() {

    var brewery = angular.module("dl.brewery", ["dl.resources"]);

    brewery.controller("BreweryController", 
        ['$scope', '$translate', 'DLHelper', 'Brewery','$location','Cache', '$log', 'Responsive','RatingService',
        function($scope, $translate, DLHelper, Brewery,$location,Cache, $log, Responsive,RatingService) {

            $scope.config = {
                data: Brewery,
                name: $translate('beer.data.brewery')+'s',
                singular: $translate('beer.data.brewery'),
                filterLabel: $translate('side.search'),
                filterColSpan: 6,
                orderBy: 'name',
                orderDir: "",
                pageSize: Responsive.isXs() || Responsive.isSm() ? 10 : 25,
                emptyResultText: $translate('beer.search.emtpy'),
                headers: [{
                        field:'name',
                        caption: $translate('beer.data.brewery'),
                        type: 'link',
                        class: function() {return "dl-font-bold";},
                        href: function(row) {return '#/brewery/detail/' + row._id;}
                    }
                ]
            };
    }]);

    brewery.controller("BreweryDetailController", 
                ['$scope', 'Brewery','$routeParams', 'Rating', 'DLHelper', '$filter', 
                'MainTitle','CellarService','RatingService', 'YesNo', 'Beer', '$translate', 'Responsive',
        function( $scope,   Brewery,  $routeParams,   Rating,   DLHelper,   $filter, 
            MainTitle, CellarService, RatingService, YesNo, Beer, $translate, Responsive) {
            $scope.map = {
                center: {
                    latitude: 30,
                    longitude: 45
                },
                zoom: 8
            };
            $scope.brewery = Brewery.get({_id: $routeParams.brewery_id}, function() {
                MainTitle.add($scope.brewery.name);
                $scope.$on("$destroy", function() {
                    MainTitle.clearAdd();
                });
                
            });

            function sortScore(beer) {
                if ( beer.score ) {
                    return beer.score.avg || 0;    
                }
                return 0;
            }
            function sortScoreStyle(beer) {
                if ( beer.score ) {
                    return beer.score.style || 0;    
                }
                return 0;   
            }
            function sortOverall(beer) {
                if ( beer.score ) {
                    return beer.score.overall || 0;    
                }
                return 0;   
            }

            $scope.configBeers = {
                collection: Beer.query({brewery: $routeParams.brewery_id}),
                name: $translate('beer.data.beer')+'s',
                singular: $translate('beer.data.beer'),
                filterLabel: $translate('side.search'),
                filterColSpan: 6,
                orderBy: 'name',
                orderDir: "",
                pageSize: Responsive.isXs() || Responsive.isSm() ? 10 : 25,
                emptyResultText: $translate('beer.search.emtpy'),
                headers: [{
                        field:'name',
                        caption: $translate('beer.data.beer'),
                        type: 'link',
                        class: function() {return "dl-font-bold";},
                        href: function(row) {return '#/beer/detail/' + row._id;}
                    },{
                        field:'style.name',
                        caption: $translate('beer.data.style')
                    },{
                        field:'category.name',
                        caption: $translate('beer.data.category'),
                        hidden: {xs: true,sm: true}
                    },{
                        field:'score.avg',
                        caption: $translate('beer.data.score'),
                        width: '7em',
                        tooltip: $translate('beer.data.score.help'),
                        class: function(beer) {
                            if ( beer.score ) {
                                return 'badge alert-' + DLHelper.colorByScore(beer.score.avg);        
                            } else {
                                return 'badge';
                            }
                        },
                        sort: [sortOverall,sortScore]
                    },{
                        field:'score',
                        caption: 'G / S',
                        width: '9em',
                        headerStyle: {'text-align': 'center','min-width': '9em'},
                        tooltip: $translate('beer.data.score.gs.help'),
                        valueTemplateUrl: 'score.html',
                        sort: sortScoreStyle
                    }
                ]
            };

    }]);
});