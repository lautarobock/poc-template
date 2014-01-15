define([], function() {

	var directives = angular.module("dl.directives", []);

    directives.run(['$templateCache',function($templateCache) {
        $templateCache.put("input-text.html",
            '<label tooltip="{{dlTooltip}}" tooltip-placement="right" for="{{id}}" class="control-label">{{caption}}</label>' + 
            '<input focus-on="{{id}}" type="text" ng-model="value" class="form-control" id="{{id}}" placeholder="{{placeholder}}">'
        );
        
        $templateCache.put("input-numeric.html",
            '<label tooltip="{{dlTooltip}}" tooltip-placement="right" for="{{id}}" class="control-label">{{caption}}</label>' + 
            '<input type="number" step="{{step}}" ng-model="value" class="form-control" id="{{id}}" placeholder="{{placeholder}}">'
        );
    }]);

	directives.directive("dlInputText", function() {
		return {
			restrict : 'EA',
            scope : {
                id: '@',
                value: '=',
                caption: '@',
                dlTooltip: '@',
                placeholder: '@'
            },
            templateUrl: 'input-text.html'
		};
	});

    directives.directive("dlInputNumber", function() {
        return {
            restrict : 'EA',
            scope : {
                id: '@',
                value: '=',
                caption: '@',
                step: '@',
                dlTooltip: '@',
                placeholder: '@'
            },
            templateUrl: 'input-numeric.html'
        };
    });


	return directives;
});