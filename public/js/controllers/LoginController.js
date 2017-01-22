(function () {

    var app = angular.module("ProfileManagement.controllers");


    console.log("Running Login Controller")
    var LoginController = function (userLogin, authService, $scope, $http, $location, $window, $rootScope) {


        $scope.username = ""
        $scope.password = ""
        var onLoginComplete = function onLoginComplete(resp) {
            $scope.status = resp.status
            if ($scope.status == 200) {

                $scope.error = ""
                $scope.errorMessage = ""
                $scope.success = "Login success."
                $location.path("messageFeed")

            } else {
                $scope.error = "Login Failed";

                $scope.errorMessage = resp.data["errorMessage"];
                $scope.success = ""

                console.log("Error message is equal to " + resp.errorMessage)


            }
        }

        var onResetPasswordComplete = function onResetPasswordComplete(resp) {
            $scope.status = resp.status
            if ($scope.status == 200) {

                $scope.error = ""
                $scope.errorMessage = ""
                $scope.success = "Password Reset Success. Please check your email for next steps"
            } else {
                $scope.error = "Password Reset Failed";

                $scope.errorMessage = resp.data["errorMessage"];

                console.log("Error message is equal to " + resp.errorMessage)


            }
        }

        var onError = function onError(reason) {
            $scope.error = reason;
        }


        var onAuthComplete = function onAuthComplete(resp) {
            console.log("running on auth complete")
            $scope.status = resp.status
            console.log($scope.status)
            if ($scope.status == 200) {
                $scope.sucess = "Auth Success"
                userLogin.userLogin($scope.username, $scope.password).then(onLoginComplete, onError);


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









        $scope.userLogin = function (username, password) {
            $scope.username = username;
            $scope.password = password
            console.log("running userLogin");
            userLogin.userLogin($scope.username, $scope.password).then(onLoginComplete, onError);




        }

        $scope.resetPassword = function (username) {
            if (username == null || username.length <= 0) {
                $scope.error = "Please enter email"

            } else {
                $scope.error = ""
                $scope.username = username;
                userLogin.resetPassword(username).then(onResetPasswordComplete, onError);

            }


        }

        $scope.logout = function () {
            authService.logout()
        }

    };


    app.controller("LoginController", LoginController);


})();