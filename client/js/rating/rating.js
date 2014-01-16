define([], function() {

    var rating = angular.module("dl.rating", []);



    rating.controller("RatingEditController", [
        '$scope', '$routeParams', 'Rating', '$location', 'Beer', '$translate', 'DLHelper',
        function($scope, $routeParams, Rating, $location, Beer, $translate, DLHelper) {

            $scope.initialScore = null;

            $scope.$watch("user._id", function(user_id) {
                if ( user_id ) {
                    //Load or create Rating
                    if ( $routeParams.rating_id ) {
                        $scope.rating = Rating.get({_id: $routeParams.rating_id}, function() {
                            $scope.initialScore = $scope.rating.finalScore;
                            loadBeer();
                        });
                    } else {
                        $scope.rating = new Rating();
                        $scope.rating.beer = $location.search().beer_id;
                        $scope.rating.user = $scope.user._id;
                        $scope.rating.date = new Date();
                        loadBeer();
                    }
                }
            });

            $scope.tmpScore = {};
            $scope.toggleScore = function() {
                if ( $scope.rating.score ) {
                    $scope.tmpScore = $scope.rating.score;
                    $scope.rating.score = null;
                } else {
                    $scope.rating.score = $scope.tmpScore;
                    $scope.tmpScore = null;
                }
            }

            $scope.scoreType = [{
                name: 'appearance',
                max: 3
            },{
                name: 'aroma',
                max: 12
            },{
                name: 'flavor',
                max: 20
            },{
                name: 'mouthfeel',
                max: 5
            },{
                name: 'overall',
                max: 10
            }];

            $scope.over = {};
            $scope.hoveringOver = function(value,type) {
                $scope.over[type] = value;
            };
            
            function loadBeer() {
                $scope.beer = Beer.get({_id: $scope.rating.beer, populate:true});

                $scope.$watch("rating.score", function(score) {
                    if ( score ) {
                        var sum = 0;
                        angular.forEach($scope.scoreType, function(t) {
                            sum +=  parseInt($scope.rating.score[t.name]) || 0;
                        });
                        $scope.rating.finalScore = sum;
                    }
                }, true);
            }

            $scope.typeBar = function(score) {
                return DLHelper.colorByScore(score);
            };

            $scope.valueBar = function(score) {
                if ( score <= 13 ) return $translate('rating.data.score.problematic');
                if ( score <= 20 ) return $translate('rating.data.score.fair');
                if ( score <= 29 ) return $translate('rating.data.score.good');
                if ( score <= 37 ) return $translate('rating.data.score.veryGood');
                if ( score <= 44 ) return $translate('rating.data.score.excellent');
                return $translate('rating.data.score.outstanding');
            };

            $scope.array = function(from, to) {
                var values = [];
                for ( var i=from; i<=to; i++ ) {
                    values.push(i);
                }
                return values;
            };

            $scope.opened = {
                date: false,
                bottled: false,
                expiration: false
            };
            
            $scope.open = function($event, type) {
                $event.preventDefault();
                $event.stopPropagation();

                $scope.opened[type] = true;
            };

            $scope.save = function() {

                $scope.rating.$save(function(rating) {
                    //Esto deberia hacerlo en el servidor y luego de el $save deberia volver a cargar el 
                    //usuario, nada mas.
                    var result = util.Arrays.filter($scope.user.ratings, function(item) {
                        return item.beer == rating.beer ? 0 : -1;
                    });
                    if ( rating.finalScore ) {
                        if ( result.length != 0 ) {
                            //Esto quiere decir q esta editando y que tenia un valor antes (lo elimino)
                            if ( $scope.initialScore ) {
                                util.Arrays.remove(result[0].finalScore,$scope.initialScore);
                            }
                            //Ahora ya puedo agregar el valor
                            result[0].finalScore.push(rating.finalScore);
                        } else {
                            $scope.user.ratings.push({
                                beer: rating.beer,
                                finalScore: [rating.finalScore]
                            });    
                        }
                        $scope.user.$save(function() {
                            window.history.back();
                        });
                    } else if ( result.length == 0 ) {
                        $scope.user.ratings.push({
                            beer: rating.beer,
                            finalScore: []
                        });
                        $scope.user.$save(function() {
                            window.history.back();
                        });
                    } else {
                        window.history.back();    
                    }
                    
                });

            };


        }]);

    rating.controller("RatingBeerController", [
        '$scope', 'Rating','$filter', '$translate','DLHelper',
        function($scope,Rating,$filter,$translate,DLHelper) {
            
            $scope.config = {
                data: Rating,
                name: "Calificaciones",
                singular: "Calificacion",
                orderBy: "date",
                orderDir: "-",
                headers: [{
                        field:'beer.name',
                        caption: 'Cerveza',
                        type: 'link',
                        href: function(row) {return '#/beer/detail/' + row.beer._id;}
                    },{
                        field:'score.appearance',
                        caption: $translate('rating.data.appearance.short'),
                        tooltip: $translate('rating.data.appearance')
                    },{
                        field:'score.aroma',
                        caption: $translate('rating.data.aroma.short'),
                        tooltip: $translate('rating.data.aroma')
                    },{
                        field:'score.flavor',
                        caption: $translate('rating.data.flavor.short'),
                        tooltip: $translate('rating.data.flavor')
                    },{
                        field:'score.mouthfeel',
                        caption: $translate('rating.data.mouthfeel.short'),
                        tooltip: $translate('rating.data.mouthfeel')
                    },{
                        field:'score.overall',
                        caption: $translate('rating.data.overall.short'),
                        tooltip: $translate('rating.data.overall')
                    },{
                        field:'finalScore',
                        caption: $translate('beer.data.finalScore.short'),
                        tooltip: $translate('beer.data.finalScore.help'),
                        class: function(rating) {
                            if ( rating.finalScore ) {
                                return 'badge alert-' + DLHelper.colorByScore(rating.finalScore);   
                            } else {
                                return 'badge';
                            }
                        },
                        sort: function (rating) {
                            return rating.finalScore || 0;
                        }
                    },{
                        field:'beer.score',
                        caption: 'G / S',
                        width: '9em',
                        headerStyle: {'text-align': 'center','min-width': '9em'},
                        tooltip: $translate('beer.data.score.gs.help'),
                        valueTemplateUrl: 'score.html'
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

    return rating;

});