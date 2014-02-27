define([], function() {

    var listview = angular.module("gt.listview", []);

    /**
    * listviewSort: {
                    combo: [{label:String, sort:String}],
                    fields: {
                        name: String, //Mandatory
                        asc: String, //String using to asc order. If not, use +{{name}}
                        desc: String //String using to desc order. If not, use -{{name}}
                    } 
                }
    */

    listview.directive("listview", function() {
        return {
            restrict : 'EA',
            replace : false,
            templateUrl: 'listview/listview.html',
            scope : {
                listviewData: '=',
                listviewHeader: '=',
                listviewConfig: '=?',
                listviewSort: '=?',
                listviewFilter: '=?'
            },
            controller: function($scope, $interpolate, $timeout) {
                $scope.listviewConfig = $scope.listviewConfig || {};

                $scope.pluralization = {
                    '0':'No se ha encontrado ningun resultado con su busqueda',
                    'one': '1 ' +($scope.listviewConfig.singular||'')+ ' encontrada',
                    'other':'{} '+($scope.listviewConfig.plural||'')+' encontradas'
                };

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
                $scope.query = query;

                //Search
                //SearchCriteria will be change for advanced text filter
                $scope.searchCriteria = $scope.listviewConfig.searchCriteria || '';
                var activeTimeout = null;
                
                $scope.search = function() {
                    if ( activeTimeout ) $timeout.cancel(activeTimeout);
                    activeTimeout = $timeout(function() {
                        searchWithFilters();
                    },500);
                };

                function searchWithFilters() {

                    if ( $scope.searchCriteria ) {
                        query["filter[searchCriteria]"] = $scope.searchCriteria;
                    }
                    var filters = [];
                    angular.forEach($scope.listviewFilter,function(filter,field) {
                        if (filter.type != 'list' && filter.value || (filter.type == 'list' && filter.value && filter.value.length != 0) ) {
                            query["filter"+field] = filter.value;
                        }
                    });
                    
                    reloadCount();
                    reload();
                }

                $scope.clearSearch = function() {
                    $scope.searchCriteria = ""
                    delete query["filter[searchCriteria]"];
                    // delete query["filter[name][$options]"];
                    reloadCount();
                    reload();
                };

                $scope.clearFilter = function(filter,filterName) {
                    filter.value='';
                    delete query["filter"+filterName];
                    reloadCount();
                    reload();
                }
                

                if ( $scope.listviewSort 
                        && $scope.listviewSort.combo
                        && $scope.listviewSort.combo.length != 0 ) {
                    query.sort = $scope.listviewSort.combo[0].sort;
                } else {
                    query.sort = $scope.listviewHeader[0].field;
                }

                if ( !$scope.listviewConfig.notQueryOnLoad ) {
                    reloadCount();
                }
                
                $scope.$watch("pagination.page", function(page, old) {
                    if ( page && old ) {
                        query.skip = $scope.pagination.pageSize * ($scope.pagination.page-1);
                        searchWithFilters();
                    }
                });
                $scope.$watch("query.sort", function(sort, old) {
                    if ( sort && old ) {
                        $scope.pagination.page = 1;
                        query.skip = 0;
                        searchWithFilters();
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

                $scope.urlTemplate = function(filter) {
                    return 'listview/listview-filter-' + filter.type + ".html";
                };
            }

        };
    });

    // function sortData(startField, startAsc, startSort) {
    //         var data = {
    //             sort: startSort,
    //             asc: startAsc,
    //             field: startField,
    //             orderStyle:{},
    //             orderBy: function() {
    //                 if ( this.sort ) {
    //                     return this.sort;
    //                 } else  {
    //                     return this.field; 
    //                 }
    //             },
    //             reverse: function() {
    //                 return this.asc || this.asc == '-';
    //             },
    //             resort: function(field, sort) {
    //                 if ( field == this.field) {
    //                     if (this.asc == '-' ) {
    //                         this.asc = '';
    //                         this.orderStyle[field] = 'glyphicon glyphicon-chevron-up';
    //                     } else {
    //                         this.asc = '-';
    //                         this.orderStyle[field] = 'glyphicon glyphicon-chevron-down';
    //                     }
    //                 } else {
    //                     angular.forEach(this.orderStyle, function(style ,key) {
    //                         data.orderStyle[key] = '';
    //                     });
    //                     this.orderStyle[field] = 'glyphicon glyphicon-chevron-up';
    //                     this.sort = sort;
    //                     this.field = field;
    //                     this.asc = '';
    //                 }
    //             }
    //         };
    //         if ( startAsc == '-') {
    //             data.orderStyle[startField] = 'glyphicon glyphicon-chevron-down';
    //         } else {
    //             data.orderStyle[startField] = 'glyphicon glyphicon-chevron-up';
    //         }

    //         return data;
    //     };
    // }

});