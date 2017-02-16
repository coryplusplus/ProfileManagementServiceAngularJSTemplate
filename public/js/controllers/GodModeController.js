(function () {

    var app = angular.module("ProfileManagement.controllers");


    console.log("Running God Mode Controller")
    var GodModeController = function (userLogin,authService, profilesService, $scope, $http, $location) {

        $scope.locations = []
        $scope.markers = []
        var updateLocations = function () {
            console.log("Update locations called in god controller")
            $scope.locations = []
            $scope.markers = []

            $scope.locations = profilesService.getLocations()

            for (i = 0; i < $scope.locations.length; i++) {
                var marker = {
                    id: i,
                    coords: {
                        latitude: $scope.locations[i].latitude,
                        longitude: $scope.locations[i].longitude,
                    },
                    options: {
                        draggable: false,
                        label: $scope.locations[i].profileName,
                    },
                    events: {
                        dragend: function (marker, eventName, args) {
                            $log.log('marker dragend');
                            var lat = marker.getPosition().lat();
                            var lon = marker.getPosition().lng();
                            $log.log(lat);
                            $log.log(lon);

                            marker.options = {
                                draggable: true,
                                labelContent: "lat: " + marker.coords.latitude + ' ' + 'lon: ' + marker.coords.longitude,
                                labelAnchor: "100 0",
                                labelClass: "marker-labels"
                            };
                        }
                    }
                };
                
                $scope.markers.push(marker)
            }
            console.log($scope.markers)
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

        var init = function () {
            profilesService.registerObserverCallback(updateLocations)
            profilesService.populateAllLocations().then(onComplete, onError)

        }

        
        $scope.updateLocation = function (latitude, longitude)
        {
            profilesService.updateProfileLocation(userLogin.getUserName(),latitude,longitude).then(onComplete,onError)

        }

        $scope.map = {
            center: {
                latitude: 30.307182,
                longitude: -97.755996
            },
            zoom: 8
        }



        if (!authService.getAuthenticated()) {
            $location.path("/login")
        }

        $scope.logout = function () {
            authService.logout()
            $location.path("login")
        }



        init()

    };


    app.controller("GodModeController", GodModeController);


})();