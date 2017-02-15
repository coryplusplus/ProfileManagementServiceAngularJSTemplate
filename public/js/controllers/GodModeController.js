(function () {

    var app = angular.module("ProfileManagement.controllers");


    console.log("Running God Mode Controller")
    var GodModeController = function (authService, profilesService, $scope, $http, $location) {

        $scope.map = {
            center: {
                latitude: 30.307182,
                longitude: -97.755996
            },
            zoom: 8
        }

        $scope.marker = {
            id: 0,
            coords: {
                latitude: 30.307182,
                longitude: -97.755996
            },
            options: {
                draggable: false
            },
            events: {
                dragend: function (marker, eventName, args) {
                    $log.log('marker dragend');
                    var lat = marker.getPosition().lat();
                    var lon = marker.getPosition().lng();
                    $log.log(lat);
                    $log.log(lon);

                    $scope.marker.options = {
                        draggable: true,
                        labelContent: "lat: " + $scope.marker.coords.latitude + ' ' + 'lon: ' + $scope.marker.coords.longitude,
                        labelAnchor: "100 0",
                        labelClass: "marker-labels"
                    };
                }
            }
        };

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


    app.controller("GodModeController", GodModeController);


})();