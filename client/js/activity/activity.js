define(['../resources'], function() {

    var activity = angular.module("dl.activity", ["dl.resources"]);

    activity.controller("ActivityController", ['$scope','Activity',function($scope,Activity) {
        $scope.activities = Activity.query();
    }]);
});