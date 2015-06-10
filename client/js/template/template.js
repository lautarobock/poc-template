(function() {

	var beer = angular.module("template", []);

    beer.controller('TemplateController',function(
		$scope
	) {
		$scope.text = 'Hola';
    });
})();
