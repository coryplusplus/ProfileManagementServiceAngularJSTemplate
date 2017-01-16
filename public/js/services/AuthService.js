(function () {

    console.log("running AuthService");
    var app = angular.module("ProfileManagement.services");

    var authService = function ($http, urlService) {


        var username;
        var token;
        var password;
        var authenticated;

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
            return username;
        }
        var setUsername = function (name) {
            username = name;
        };

        var setPassword = function (password) {
            this.password = password
        }

        var getPassword = function () {
            return password
        }

        var setToken = function (t) {
            console.log("Setting token")
            token = t
        }

        var getToken = function () {
            return token;
        }

        var logout = function () {
            console.log("logging out")
            setAuthenticated(false)
            setToken("")
            setUsername("")
            setPassword("")
        }




        var requestSingleUseToken = function () {

            var credentials = btoa("ckelly@cloudconfidant.com" + ':' + "XZR2PRUyr4dw+Nh9MxwW5w==");


            return $http.get(urlService.getSingleUseToken(), {
                    headers: {
                        'Authorization': credentials
                    }
                })
                .then(function (resp) {
                    return resp.data["token"];
                }, function (reason) {
                    return reason;
                });
        };


        var requestToken = function (uname, password) {

            var credentials = btoa(uname + ':' + password);

            setUsername(uname)

            return $http.get(urlService.getRequestTokenURL() + uname, {
                    headers: {
                        'Authorization': credentials
                    }
                })
                .then(function (resp) {
                    setToken(resp.data["token"])
                    setAuthenticated(true)
                    notifyObservers()
                    return resp;
                }, function (reason) {
                    return reason;
                });
        };

        return {
            logout: logout,
            requestToken: requestToken,
            getToken: getToken,
            setAuthenticated: setAuthenticated,
            getAuthenticated: getAuthenticated,
            getUsername: getUsername,
            registerObserverCallback: registerObserverCallback,
            requestSingleUseToken: requestSingleUseToken,

        };
    };

    app.service("authService", authService);

})();