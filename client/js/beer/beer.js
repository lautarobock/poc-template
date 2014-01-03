define(['../resources'], function() {
	
	var beer = angular.module("dl.beer", ["dl.resources"]);

	beer.controller("BeerController", function($scope, Beer) {
		$scope.beers = Beer.query();
	});

	beer.controller("NewStyleByLabelController", function($scope, $modalInstance, StyleByLabel) {

		$scope.styleByLabel = new StyleByLabel();

		$scope.ok = function () {
		    $modalInstance.close($scope.styleByLabel);
		};

		$scope.cancel = function () {
		    $modalInstance.dismiss('cancel');
		};

	});

	beer.controller("BeerDetailController", 
		        ['$scope', 'Beer','$routeParams', 'Style', 'StyleByLabel', '$location', '$modal',
		function( $scope,   Beer,  $routeParams,   Style,   StyleByLabel,   $location,   $modal) {
			
			//Load Styles
			$scope.styles = Style.query();
			$scope.stylesByLabel = StyleByLabel.query();

			//Load Beer o create New
			if ( $routeParams.beer_id ) {
				$scope.beer = Beer.get({_id: $routeParams.beer_id});
			} else {
				$scope.beer = new Beer();
			}


			$scope.openNewStyleByLabel = function () {
				var modalInstance = $modal.open({
				  	templateUrl: 'beer/style-by-label.html',
				  	controller: 'NewStyleByLabelController'
				});

				modalInstance.result.then(function (styleByLabel) {
				  	console.log("StyleByLabel",styleByLabel);
				  	styleByLabel._id = styleByLabel.name;
				  	styleByLabel.$save(function(saved) {
						$scope.stylesByLabel = StyleByLabel.query(function() {
							$scope.beer.styleByLabel = saved._id;
						});
					});
				}, function () {
				  
				});
			};

			//Save
			$scope.save = function() {
				if ( !$scope.beer._id ) {
					$scope.beer._id = $scope.beer.name + "-" + new Date().getTime();
				}
				$scope.beer.$save(function(beer) {
					$location.path('/beer/edit/' + beer._id);
				});
			};


	}]);

	return beer;
});