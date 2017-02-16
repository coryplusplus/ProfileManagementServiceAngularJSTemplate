(function () {

    console.log("running profileService");
    var app = angular.module("ProfileManagement.services");

    var profilesService = function ($http, urlService, authService, messageService) {



        var observerCallbacks = [];

        //register an observer
        var registerObserverCallback = function (callback) {
            observerCallbacks.push(callback);
        };

        //call this when you know 'foo' has been changed
        var notifyObservers = function () {
            angular.forEach(observerCallbacks, function (callback) {
                callback();
            });
        };


        var profiles = [];
        var searchProfiles = [];
        var currentProfile;
        var currentProfileIndex;
        var base_size = 10
        var base_start = 0
        var start = 0
        var size = base_size
        var paginationCount = 0
        var searchProfileName = ""
        var searchEmail = ""
        var currentPage = 0
        var searchYear = ""
        var searchMonth = ""
        var searchDay = ""
        var searchByDayOfWeek = ""
        var locations = {}



        var getCurrentProfileMessageCount = function () {
            return currentProfile["messageCount"];
        }

        var getCurrentPage = function () {
            return currentPage;
        }

        var getLocations = function () {
            var onlyLocation = []
            for (var key in locations) {
                onlyLocation.push(locations[key]);
            }
            return onlyLocation;
        }

        var setCurrentPage = function (page) {
            currentPage = page;
        }
        var updateSearchCriteria = function (profileName, email, year, month, day, dayOfWeek) {
            searchProfileName = profileName
            searchEmail = email
            searchYear = year
            searchMonth = month
            searchDay = day
            searchByDayOfWeek = dayOfWeek

        }






        var getSearchProfiles = function () {
            return searchProfiles
        }

        var setSearchProfiles = function (profiles) {
            searchProfiles = profiles
            notifyObservers()
        }
        var getPaginationCount = function () {
            return paginationCount;
        }
        var getProfiles = function () {
            return profiles;
        }

        var setCurrentProfileIndex = function (index) {
            currentProfileIndex = index
        }

        var createProfile = function (userName, firstName, lastName, email, password, deviceId, avatar) {
            var credentials = "Bearer " + authService.getToken()


            return $http.post(urlService.getProfilesURL(), {
                    "profileName": userName,
                    "firstName": firstName,
                    "lastName": lastName,
                    "email": email,
                    "password": password,
                    "deviceId": deviceId,
                    "avatar": avatar
                }, {
                    headers: {
                        'Authorization': credentials
                    }
                })
                .then(function (resp) {
                    if (resp.data.length != 0)
                        angular.forEach(resp.data, function (data) {
                            console.log(data["profileName"])
                            profiles.push(data);
                        });
                    return resp;
                }, function (reason) {
                    return reason;
                });



        };

        var updateProfileLocation = function (userName, latitude, longitude) {
            var credentials = "Bearer " + authService.getToken()


            return $http.put(urlService.getProfilesURL() + "/" + userName + "/location", {
                    "latitude": latitude,
                    "longitude": longitude,
                }, {
                    headers: {
                        'Authorization': credentials
                    }
                })
                .then(function (resp) {
                    var data = {
                        "latitude": resp.latitude,
                        "longitude": resp.longitude,
                        "profileName": resp.profileName,
                    }
                    //Use a map here since more efficient
                    locations[userName] = data
                    notifyObservers();

                    return resp;
                }, function (reason) {
                    return reason;
                });



        };

        var editProfile = function (profileName, firstName, lastName, email, password, deviceId, avatar, banned, reportedCount, index) {
            var credentials = "Bearer " + authService.getToken()


            return $http.put(urlService.getProfilesURL() + "/" + profileName, {
                    "profileName": profileName,
                    "firstName": firstName,
                    "lastName": lastName,
                    "email": email,
                    "password": password,
                    "deviceId": deviceId,
                    "avatar": avatar,
                    "banned": banned,
                    "reportedCount": reportedCount,
                }, {
                    headers: {
                        'Authorization': credentials
                    }
                })
                .then(function (resp) {
                    return resp;
                }, function (reason) {
                    return reason;
                });



        };






        var removeProfile = function (index) {
            console.log("Removing profile at index " + index)
            profiles.splice(index, 1)
            notifyObservers();

        }

        var populateProfiles = function (search) {
            if (search) {
                searchProfiles = []
            } else {
                profiles = []
            }
            var credentials = "Bearer " + authService.getToken()

            var queryParams
            if (search) {
                queryParams = "?start=" + start + "&size=" + size + "&email=" + searchEmail + "&profileName=" + searchProfileName + "&year=" + searchYear + "&month=" + searchMonth + "&dayOfWeek=" + searchByDayOfWeek + "&dayOfMonth=" + searchDay
            } else {
                queryParams = "?start=" + start + "&size=" + size
            }

            return $http.get(urlService.getProfilesURL() + queryParams, {
                    headers: {
                        'Authorization': credentials
                    }
                })
                .then(function (resp) {

                    if (resp.data.length != 0)
                        angular.forEach(resp.data, function (data) {
                            console.log(data["profileName"])
                            if (search) {
                                searchProfiles.push(data)
                            } else {
                                profiles.push(data);

                            }
                        });
                    notifyObservers();
                    return resp;
                }, function (reason) {
                    return reason;
                });



        };

        var deleteProfile = function (profileName) {
            var credentials = "Bearer " + authService.getToken()


            return $http.delete(urlService.getProfilesURL() + "/" + profileName, {
                    headers: {
                        'Authorization': credentials
                    }
                })
                .then(function (resp) {
                    return resp;
                }, function (reason) {
                    return reason;
                });



        };

        var clearProfiles = function () {
            profiles = []
            searchProfiles = []
        }

        var loadProfiles = function (index, search) {
            start = base_size * index
            populateProfiles(search)
        }

        var getProfile = function (profileName) {

            var credentials = "Bearer " + authService.getToken()


            return $http.get(urlService.getProfilesURL() + "/" + profileName, {
                    headers: {
                        'Authorization': credentials
                    }
                })
                .then(function (resp) {
                    currentProfile = resp.data
                    messageService.setTotalMessageCount(currentProfile["messageCount"])
                    messageService.populateMessages(currentProfile["profileName"])
                    notifyObservers();
                    return resp;
                }, function (reason) {
                    return reason;
                });



        };

        var populateAllLocations = function () {

            var credentials = "Bearer " + authService.getToken()


            return $http.get(urlService.getProfilesURL() + "/locations", {
                    headers: {
                        'Authorization': credentials
                    }
                })
                .then(function (resp) {
                    if (resp.data.length != 0)
                        angular.forEach(resp.data, function (data) {
                            locations[data["profileName"]] = data
                        });

                    notifyObservers();
                    return resp;
                }, function (reason) {
                    return reason;
                });



        };

        var getCurrentProfile = function () {
            return currentProfile
        }
        return {
            populateProfiles: populateProfiles,
            getProfiles: getProfiles,
            createProfile: createProfile,
            deleteProfile: deleteProfile,
            removeProfile: removeProfile,
            getCurrentProfile: getCurrentProfile,
            getProfile: getProfile,
            editProfile: editProfile,
            registerObserverCallback: registerObserverCallback,
            setCurrentProfileIndex: setCurrentProfileIndex,
            getPaginationCount: getPaginationCount,
            loadProfiles: loadProfiles,
            updateSearchCriteria: updateSearchCriteria,
            getSearchProfiles: getSearchProfiles,
            setSearchProfiles: setSearchProfiles,
            clearProfiles: clearProfiles,
            getCurrentProfileMessageCount: getCurrentProfileMessageCount,
            getCurrentPage: getCurrentPage,
            setCurrentPage: setCurrentPage,
            getLocations: getLocations,
            populateAllLocations: populateAllLocations,
            updateProfileLocation: updateProfileLocation,


        };

    };

    app.service("profilesService", profilesService);

})();