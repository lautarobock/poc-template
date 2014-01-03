define([], function() {

    var rating = angular.module("dl.rating", []);

    rating.controller("RatingEditController", [
        '$scope', '$routeParams', 'Rating', '$location', 'Beer',
        function($scope, $routeParams, Rating, $location, Beer) {

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
                        loadBeer();
                    }
                }
            });
            
            $scope.hoveringOverAroma = function(value) {
                $scope.overAroma = value;
            };
            function loadBeer() {
                $scope.beer = Beer.get({_id: $scope.rating.beer, populate:true});
            }

        }]);

    return rating;

});