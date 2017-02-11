(function () {

    console.log("running loginService");
    var app = angular.module("ProfileManagement.services");

    var userLogin = function ($http, urlService, authService, $window) {


        var username = "";
        var authenticated = false;
        var isActive = false
        var role = ""
        var trialPeriodEnd = ""


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
        var setAuthenticated = function (value) {
            authenticated = value;
        };

        var getAuthenticated = function () {
            return authenticated;
        };
        var getUsername = function () {
            return JSON.parse($window.localStorage.getItem('profileName'));
        }
        var setUsername = function (name) {
            $window.localStorage.setItem('profileName', JSON.stringify(name));
            username = name;
        };

        var setIsActive = function (value) {
            isActive = value;
        }

        var getIsActive = function () {
            return isActive
        }

        var setRole = function (value) {
            role = value
        }

        var getRole = function () {
            return role
        }

        var setTrialPeriodEnd = function (value) {
            trialPeriodEnd = value
        }

        var getTrialPeriodEnd = function () {
            return trialPeriodEnd
        }
        var userLogin = function (uname, password) {

            var credentials = "Bearer " + authService.getToken()


            console.log("Setting username equal to " + uname);
            setUsername(uname);
            return $http.post(urlService.getAuthenticateUserURL(), {
                    "profileName": username,
                    "password": password
                }, {
                    headers: {
                        'Authorization': credentials
                    }
                })
                .then(function (resp) {
                    notifyObservers()

                    return resp;
                }, function (reason) {
                    return reason;
                });
        };

        var updatePassword = function (password, newPassword) {

            console.log("Updating password for username " + username);
            return $http.put(urlService.getCustomerAuthenticateURL() + "/update", {
                    "profileName": username,
                    "password": password,
                    "newPassword": newPassword
                }, {})
                .then(function (resp) {
                    return resp;
                }, function (reason) {
                    return reason;
                });
        };

        var resetPassword = function (uname) {

            console.log("Reset password requested for " + uname);
            return $http.put(urlService.getCustomerAuthenticateURL(), {
                    "profileName": uname
                }, {})
                .then(function (resp) {
                    return resp;
                }, function (reason) {
                    return reason;
                });
        };

        return {
            userLogin: userLogin,
            getUserName: getUsername,
            setAuthenticated: setAuthenticated,
            getAuthenticated: getAuthenticated,
            registerObserverCallback: registerObserverCallback,
            setIsActive: setIsActive,
            getIsActive: getIsActive,
            setRole: setRole,
            getRole: getRole,
            resetPassword: resetPassword,
            updatePassword: updatePassword,
            getTrialPeriodEnd: getTrialPeriodEnd,




        };
    };

    app.service("userLogin", userLogin);

})();