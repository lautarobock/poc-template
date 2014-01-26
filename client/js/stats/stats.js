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


    stats.controller("StatsController", 
        ['$scope','Rating',
        function($scope,Rating) {
            
            $scope.$watch("user", function(user) {
                if ( user ) {
                    loadData();
                }
            });

            

            function loadData() {
                Rating.query(function(ratings) {
                    $scope.myStats = {};

                    if ( ratings.length == 0 ) return;

                    $scope.myStats.maxABV = ratings[0].beer;
                    $scope.myStats.minABV = ratings[0].beer;
                    $scope.myStats.maxScore = ratings[0];
                    $scope.myStats.minScore = ratings[0];

                    angular.forEach(ratings, function(rat) {
                        if ( rat.beer.abv > $scope.myStats.maxABV.abv ) {
                            $scope.myStats.maxABV = rat.beer;
                        }
                        if ( rat.beer.abv < $scope.myStats.minABV.abv ) {
                            $scope.myStats.minABV = rat.beer;
                        }
                        if ( rat.finalScore && rat.finalScore > $scope.myStats.maxScore.finalScore ) {
                            $scope.myStats.maxScore = rat;
                        }
                        if ( rat.finalScore && rat.finalScore < $scope.myStats.minScore.finalScore ) {
                            $scope.myStats.minScore = rat;
                        }
                    });
                });
            }
    }]);

    return stats;
});