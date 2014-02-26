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
            controller: function($scope, $interpolate, $timeout) {
                $scope.listviewConfig = $scope.listviewConfig || {};

                //Pagination
                $scope.pagination = {
                    pageSize:$scope.listviewConfig.pageSize || 10,
                    page: 1
                };

                //Query Object
                var query = {
                    limit: $scope.pagination.pageSize,
                    skip: $scope.pagination.pageSize * ($scope.pagination.page-1)
                };

                //Search
                $scope.searchCriteria = '';
                var activeTimeout = null;
                $scope.search = function() {
                    if ( activeTimeout ) $timeout.cancel(activeTimeout);
                    activeTimeout = $timeout(function() {
                        query["filter[name][$regex]"] = $scope.searchCriteria;
                        query["filter[name][$options]"] = "i";
                        reloadCount();
                        reload();
                    },500);
                };
                $scope.clearSearch = function() {
                    $scope.searchCriteria = ""
                    delete query["filter[name][$regex]"];
                    delete query["filter[name][$options]"];
                    reloadCount();
                    reload();
                };
                

                if ( $scope.listviewSort && $scope.listviewSort.initial ) {
                    query.sort = $scope.listviewSort.initial;
                } else {
                    query.sort = $scope.listviewHeader[0].field;
                }

                if ( !$scope.listviewConfig.notQueryOnLoad ) {
                    // $scope.models = $scope.listviewData.query(query);
                    reloadCount();
                }
                
                $scope.$watch("pagination.page", function(page, old) {
                    if ( page && old ) {
                        query.skip = $scope.pagination.pageSize * ($scope.pagination.page-1);
                        reload(); 
                    }
                });

                function reload() {
                    $scope.loading = true;
                    $scope.models = $scope.listviewData.query(query, function() {
                        $scope.loading = false;
                    });
                }

                function reloadCount() {
                    $scope.listviewData.count(query, function(value) {
                        $scope.pagination.totalItems = value.count;
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

                $scope.getPageCount = function(length) {
                    var pageSize = $scope.pagination.pageSize;
                    return Math.ceil(length/pageSize);
                };
            }

        };
    });

});