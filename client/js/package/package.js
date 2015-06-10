(function() {

	angular.module("package", [])
		.controller('PackageController',function($scope,Package) {
			this.packages = Package.query();
	    })
		.controller('PackageEditController', function(Package,$stateParams) {
			this.package = Package.get({Id:$stateParams.Id});
			this.defaults = JSON.stringify(this.package.defaults(),null,4);
			this.template = this.package.template();
		});
})();
