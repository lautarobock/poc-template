define([], function() {

	var helper = angular.module("dl.helper", []);

	helper.factory("DLHelper", function() {
		return {
			colorByScore: function(score) {
				if ( score <= 20 ) return null;
                if ( score <= 29 ) return 'danger';
                if ( score <= 37 ) return 'warning';
                if ( score <= 44 ) return 'info';
                return 'success';
			}
		};
	});

	return helper;
});