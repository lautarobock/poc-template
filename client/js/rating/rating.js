define([], function() {

    var rating = angular.module("dl.rating", []);



    rating.controller("RatingEditController", [
        '$scope', '$routeParams', 'Rating', '$location', 'Beer', '$translate',
        function($scope, $routeParams, Rating, $location, Beer, $translate) {

            $scope.$watch("user._id", function(user_id) {
                if ( user_id ) {
                    //Load or create Rating
                    if ( $routeParams.rating_id ) {
                        $scope.rating = Rating.get({_id: $routeParams.rating_id}, function() {
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
                if ( score <= 20 ) return null;
                if ( score <= 29 ) return 'danger';
                if ( score <= 37 ) return 'warning';
                if ( score <= 44 ) return 'info';
                return 'success';
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

                $scope.rating.$save();

            };


        }]);

    rating.controller("RatingBeerController", [
        '$scope', 'Rating','$filter',
        function($scope,Rating,$filter) {
            $scope.config = {
                data: Rating,
                name: "Calificaciones",
                singular: "Calificacion",
                orderBy: "date",
                orderDir: "-",
                headers: [{
                        field:'date',
                        caption: 'Fecha',
                        format: function(value) {
                            return $filter('date')(value,'dd-MM-yyyy');
                        }
                    },{
                        field:'beer.name',
                        caption: 'Cerveza',
                        valueTemplateUrl: 'rating/list/link.html'
                    },{
                        field:'finalScore',
                        caption: 'Score'
                    }
                ]
            };

        }]);

    return rating;

});