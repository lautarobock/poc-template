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

    directives.directive('secure', function() {
        return function(scope,element) {
            scope.$watch("user", function(value, old) {
                if ( value ) {
                    element.removeClass('hidden');
                } else {
                    element.addClass('hidden');
                }
            });
        };
    });

    directives.directive('notLogged', function() {
        return function(scope,element) {
            scope.$watch("user", function(value, old) {
                if ( value ) {
                    element.addClass('hidden');
                } else {
                    element.removeClass('hidden');
                }
            });
        };
    });

    directives.directive('secureAdmin', function() {
        return function(scope,element) {
            scope.$watch("user.isAdmin", function(value, old) {
                if ( value ) {
                    element.removeClass('hidden');
                } else {
                    element.addClass('hidden');
                }
            });
        };
    });

    directives.directive('logIn', function() {
        return {
            restrict: 'AE',
            replace: true,
            template: '<a not-logged href="javascript:googleLogIn()">{{caption}}</a>',
            link: function(scope, element) {
                scope.caption = element.attr("caption") || "Acceder";
            }
        };
    });

    directives.directive('signIn', function() {
        return {
            restrict: 'AE',
            replace: true,
            template: '<a not-logged href="javascript:googleSignIn()">{{caption}}</a>',
            link: function(scope, element) {
                scope.caption = element.attr("caption") || "Registrarse";
            }
        };
    });


    directives.directive('dlIcon', function() {
        return function(scope, element) {
            element.html('<img src="../images/'+element.attr('dl-icon')+'.png"/>');
        };
    });

    directives.directive('mainContent', function() {
        return function(scope, element) {
            element.addClass("col-md-9");
        };
    });

    directives.directive('sideBar', function() {
        return function(scope, element) {
            element.addClass("col-md-3");
        };
    });


    //Filters (in other file)
    directives.filter("enrich", function() {
        return function(value) {
            if ( value ) return markdown.toHTML(value);
            return value;
        };
    });

    directives.directive('focusOn', function() {
        return function(scope, elem, attr) {
            scope.$on('focusOn', function(e, name) {
                if(name === attr.focusOn) {
                    elem[0].focus();
                }
            });
        };
    });

    directives.factory('focus', ['$rootScope', '$timeout',function ($rootScope, $timeout) {
        return function(name) {
            $timeout(function (){
                $rootScope.$broadcast('focusOn', name);
            },100);
        };
    }]);

    directives.filter("formatDate", ['$filter',function($filter) {
        return function(date) {
            return util.formatDate(date,$filter('date'));
        };
    }]);

	directives.directive('dateDiff', function() {
		return {
			restrict : 'EA',
			scope : {
				from: '=',
				to: '='
			},
			template: '<span>{{value}}</span>',
			controller: function($scope) {

				$scope.$watch("from + to",function() {
					if ( $scope.from && $scope.to ) {
						$scope.value = util.dateDiff($scope.from, $scope.to);
					} else {
						$scope.value = '';
					}
				});

			}
		};
	});


	return directives;
});
