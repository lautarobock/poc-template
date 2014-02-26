define([], function() {

    var listview = angular.module("gt.listview", []);

    listview.directive("listview", function() {
        return {
            restrict : 'EA',
            replace : false,
            templateUrl: 'listview/listview.html',
            scope : {
                listviewData: '=',
                listviewHeader: '=',
                listviewConfig: '=?',
                listviewSort: '=?'
            },
            controller: function($scope, $interpolate, $compile) {
                $scope.listviewConfig = $scope.listviewConfig || {};

                var PAGE_SIZE = $scope.listviewConfig.pageSize || 10;    

                var page = 1;

                var query = {
                    limit: PAGE_SIZE,
                    skip: PAGE_SIZE * (page-1)
                };
                if ( $scope.listviewSort && $scope.listviewSort.initial ) {
                    query.sort = $scope.listviewSort.initial;
                } else {
                    query.sort = $scope.listviewHeader[0].field;
                }

                if ( !$scope.listviewConfig.notQueryOnLoad ) {
                    $scope.models = $scope.listviewData.query(query);
                    $scope.listviewData.count(query, function(value) {
                        $scope.totalItems = value.count;
                    });
                }
                


                $scope.getValue = function(header, $model) {
                    if ( header.templateUrl ) {

                    } else if ( header.template ) {
                        return $interpolate(header.template)({$model:$model, header: header});
                    } else if ( header.value instanceof Function ) {

                    } else {
                        return $interpolate('{{$model.'+header.field+'}}')({$model:$model, header: header});
                    }
                };

                $scope.getStyle = function(header) {
                    var style = header.style || {};
                    if ( header.width ) {
                        style.width = header.width;
                    }
                    return style;
                };
            }

        };
    });

});