define([], function() {

	var directives = angular.module("dl.directives", []);

	directives.directive("inputNumeric", function() {
		return {
			restrict : 'EA',
            scope : {
                beer: '=beerDetail'
            },
            templateUrl: 'beer/beer-detail-directive.html'
		};
	});

	return directives;
});