'use strict';

/* Controllers */

angular.module('ProfileManagement.controllers', []).
controller('AppCtrl', function ($scope, $http, authService) {


    var onError = function onError(reason) {
        $scope.error = reason;
    }

    var onAuthComplete = function onAuthComplete(resp) {
        console.log("running on auth complete")
        $scope.status = resp.status
        console.log($scope.status)
        if ($scope.status == 200) {
            $scope.sucess = "Auth Success"

        } else {
            $scope.error = "Auth Failed";

            $scope.errorMessage = resp.data["errorMessage"];

            console.log("Error message is equal to " + resp.errorMessage)


        }
    }

    var requestToken = function (username, password) {
        console.log("running requestToken");
        authService.requestToken(username, password).then(onAuthComplete, onError);
    }


    $scope.authorize = function () {
        if (authService.getToken() == undefined) {
            requestToken("test@cloudconfidant.com", "Password123!@#")

        }


    }

    $http({
        method: 'GET',
        url: '/api/name'
    }).
    success(function (data, status, headers, config) {
        $scope.name = data.name;
    }).
    error(function (data, status, headers, config) {
        $scope.name = 'Error!';
    });

}).
controller('MyCtrl1', function ($scope) {
    // write Ctrl here

}).
controller('MyCtrl2', function ($scope) {
        // write Ctrl here

    }




);