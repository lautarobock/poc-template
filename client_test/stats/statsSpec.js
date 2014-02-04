define(["../DataHelper.js"], function(DataHelper) {

    describe("stats", function() {

        beforeEach(angular.mock.module('dl.stats'));

        it("Should load stats", inject(function($controller, $rootScope, Cache, Brewery, Rating, $filter) {

            //Mocks
            // spyOn(Cache, 'styles').andReturn([{_id:'style1', name:'Style 1'}]);
            spyOn(Cache, 'styles').andCallFake(function(cb) {
                cb([{_id:'style1', name:'Style 1'}]);
            });
            // spyOn(Cache, 'categories').andReturn([{_id:'cat1', name:'Cat 1'}]);
            spyOn(Cache, 'categories').andCallFake(function(cb) {
                cb([{_id:'cat1', name:'Cat 1'}]);
            });
            // spyOn(Brewery, 'query').andReturn([{_id:'brew1', name:'Brewery 1'}]);
            spyOn(Brewery, 'query').andCallFake(function(cb) {
                cb([{_id:'brew1', name:'Brewery 1'}]);
            });
            // spyOn(Rating, 'query').andReturn([{_id:'rating1'}]);
            spyOn(Rating, 'query').andCallFake(function(cb) {
                cb(DataHelper.ratings);
            });


            var $scope = $rootScope.$new();

            var statsController = $controller("StatsController", {$scope: $scope});

            $rootScope.user = {name: "jose", _id:'User_ID'};
            $rootScope.$digest();


            expect($scope.styles['style1'].name).toBe('Style 1');
            expect($scope.categories['cat1'].name).toBe('Cat 1');
            expect($scope.breweries['brew1'].name).toBe('Brewery 1');
            expect($scope.myStats).toBeDefined();
            expect($scope.myStats.maxABV.name).toBe('Schloss Eggenberg Samichlaus Classic');
            expect($scope.myStats.minABV.name).toBe('Lindemans Pêcheresse');
            expect($scope.myStats.maxScore.finalScore).toBe(49);
            expect($scope.myStats.maxScore.beer.name).toBe('Cocoa Psycho');
            expect($scope.myStats.minScore.finalScore).toBe(1);
            expect($scope.myStats.minScore.beer.name).toBe('Bischofshof Hefe-Weissbier Dunkel');

            var notNull = $filter("notNull");
            expect(notNull).toBeDefined();

            //Tables
            expect($scope.styleTBConfig.rows).toBe($scope.myStats.styles);
            expect($scope.styleAvgTBConfig.rows).toEqual(notNull($scope.myStats.styles,'avg.value'));

            expect($scope.catTBConfig.rows).toBe($scope.myStats.categories);
            expect($scope.catAvgTBConfig.rows).toEqual(notNull($scope.myStats.categories,'avg.value'));

            expect($scope.breweriesTBConfig.rows).toBe($scope.myStats.breweries);
            expect($scope.breweriesAvgTBConfig.rows).toEqual(notNull($scope.myStats.breweries,'avg.value'));

            //Charts
            //Cantidad por estilo
            expect($scope.styleChartConfig.series[0].data.length).toBe(11);
            expect($scope.styleChartConfig.series[0].data[0]).toEqual(['18e',19]);
            expect($scope.styleChartConfig.series[0].data[9]).toEqual(['18a',8]);
            expect($scope.styleChartConfig.series[0].data[10]).toEqual(['Otros',114]);
            //Cervezas por mes
            expect($scope.beersPerMonth.xAxis.categories.length).toEqual(11);
            expect($scope.beersPerMonth.series[0].data.length).toEqual(11);
            expect($scope.beersPerMonth.series[0].data[0]).toEqual(1);
            expect($scope.beersPerMonth.series[0].data[1]).toEqual(36);

            

        }));

    });

});