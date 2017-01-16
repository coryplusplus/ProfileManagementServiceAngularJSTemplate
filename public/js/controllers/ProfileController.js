(function () {

    var app = angular.module("ProfileManagement.controllers");


    console.log("Running Profile Controller")
    var ProfileController = function (authService, profilesService, $scope, $http, $location, $anchorScroll, commentService, urlService) {





        var updateProfiles = function () {
            console.log("Updating profiles method called in home controller")
            $scope.profiles = profilesService.getProfiles()
            $scope.searchProfiles = profilesService.getSearchProfiles()
            if ($scope.searchProfiles.length != 0) {
                $scope.results = null
            }



        }





        $scope.createProfile = function (userName, firstName, lastName, email, password, deviceId, avatar) {
            profilesService.createProfile(userName, firstName, lastName, email, password, deviceId, avatar).then(onProfileCreationComplete, onError);
        }

        var onProfileEditComplete = function onProfileEditComplete(resp) {
            $scope.status = resp.status
            if ($scope.status == 200) {

                $scope.error = ""
                $scope.errorMessage = ""
                $scope.success = "Profile Edited Successfully."
                $location.path("home")
                $scope.clearSearch()
                profilesService.loadProfiles(0)


            } else {
                $scope.error = "Profile Edit Failed";

                $scope.errorMessage = resp.data["errorMessage"];

                console.log("Error message is equal to " + resp.errorMessage)


            }
        }

        $scope.editProfile = function (userName, firstName, lastName, email, password, deviceId, avatar, banned, reportedCount) {
            console.log("calling edit profile for user " + userName)
            profilesService.editProfile(userName, firstName, lastName, email, password, deviceId, avatar, banned, reportedCount, $scope.currentProfileIndex).then(onProfileEditComplete, onError);
        }

        var onError = function onError(reason) {
            $scope.error = reason;
        }



        var onProfileCreationComplete = function onProfileCreationComplete(resp) {
            $scope.status = resp.status
            if ($scope.status == 200) {

                $scope.error = ""
                $scope.errorMessage = ""
                $scope.success = "Profile Created Successfully."
                $location.path("login")

            } else {
                $scope.error = "Profile Creation Failed";

                $scope.errorMessage = resp.data["errorMessage"];

                console.log("Error message is equal to " + resp.errorMessage)


            }
        }


        var onProfileDeleteComplete = function onProfileDeleteComplete(resp) {
            $scope.status = resp.status
            if ($scope.status == 204) {

                $scope.error = ""
                $scope.errorMessage = ""
                $scope.success = "Successfully deleted profile."
                $scope.getProfiles()
                $location.path("home")
                $scope.clearSearch()
                profilesService.loadProfiles(0)

            } else {
                $scope.error = "Failed to delete profile";

                $scope.errorMessage = resp.data["errorMessage"];

                console.log("Error message is equal to " + $scope.errorMessage)


            }
        }

        var getProfileComplete = function getProfileComplete(resp) {
            $scope.status = resp.status
            if ($scope.status == 200) {

                $scope.error = ""
                $scope.errorMessage = ""
                $scope.success = "Successfully retrieved profile."
                $scope.currentProfile = profilesService.getCurrentProfile()
                $location.path("editProfile")
            } else {
                $scope.error = "Failed to retrieve profile";

                $scope.errorMessage = resp.data["errorMessage"];

                console.log("Error message is equal to " + $scope.errorMessage)


            }
        }

        $scope.deleteProfile = function (profile) {
            profilesService.deleteProfile(name).then(onProfileDeleteComplete, onError);


        }

        $scope.getProfile = function (profileName, index) {
            $scope.currentProfileIndex = index
            console.log("Just set currentProfileIndex to " + index)
            profilesService.setCurrentProfileIndex($scope.currentProfileIndex)
            profilesService.getProfile(profileName).then(getProfileComplete, onError);
        }

        $scope.search = function () {
            var searchMonth = $scope.searchMonth;
            var searchDayOfWeek = $scope.searchByDayOfWeek;
            if ($scope.searchMonth == 0) {
                searchMonth = ""
            }
            if ($scope.searchByDayOfWeek == 0) {
                searchDayOfWeek = ""
            }
            profilesService.updateSearchCriteria($scope.searchProfileName, $scope.searchEmail, $scope.searchYear, searchMonth, $scope.searchDay, searchDayOfWeek);
            $scope.loadProfiles(0, true);
            if ($scope.searchProfiles && $scope.searchProfiles.length == 0) {
                $scope.results = "No results found"
            } else {
                $scope.results = null
            }

        }




    };


    app.controller("ProfileController", ProfileController);


})();