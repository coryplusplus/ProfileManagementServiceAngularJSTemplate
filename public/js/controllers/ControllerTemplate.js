(function () {

    var app = angular.module("ProfileManagement.controllers");


    console.log("Running Home Controller")
    var ControllerName = function (authService, customerDetails, profilesService, $scope, $http, $location) {


        if (!authService.getAuthenticated()) {
            $location.path("/login")
        }

        $scope.logout = function () {
            authService.logout()
            $location.path("login")
        }

        var onError = function onError(reason) {
            $scope.error = reason;
        }

        var onComplete = function onComplete(resp) {
            $scope.status = resp.status
            if ($scope.status == 200) {

                $scope.error = ""
                $scope.errorMessage = ""
                $scope.success = "Success"

            } else if ($scope.status == 404) {
                $scope.error = "Unauthorized";
            } else {
                $scope.error = "Failure";

                $scope.errorMessage = resp.data["errorMessage"];

                console.log("Error message is equal to " + resp.errorMessage)


            }
        }



    };


    app.controller("ControllerName", ControllerName);


})();