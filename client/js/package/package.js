(function() {

	angular.module("package", [])
		.controller('PackageController',function($scope,Package) {
			this.packages = Package.query();
	    })
		.controller('PackageEditController', function(Package,$routeParams) {
			this.package = Package.get({Id:$routeParams.Id});
		});
})();
