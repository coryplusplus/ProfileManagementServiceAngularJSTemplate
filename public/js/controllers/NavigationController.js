(function () {

    var app = angular.module("ProfileManagement.controllers");


    console.log("Running Navigation Controller")
    var NavigationController = function ($scope,$location) {

        $scope.isActive = function (viewLocation) {
            return viewLocation === $location.path();
        };


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


    app.controller("NavigationController", NavigationController);


})();