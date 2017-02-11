(function () {

    console.log("running AuthService");
    var app = angular.module("ProfileManagement.services");

    var authService = function ($http, urlService, $window) {




        var username;
        var password;
        var authenticated;

        var observerCallbacks = [];

        var setAuthenticated = function (value) {
            console.log("This user is authenticated")
            authenticated = value;
        };

        var retrieveTokenFromLocalStorage = function () {
            console.log("Attempting to retrieve token from local storage")
            var token = JSON.parse($window.localStorage.getItem('bearerToken'));
            console.log("Token is equal to " + token)
            if (token != null && token != '') {
                setAuthenticated(true);
            }
            return token

        }
        var token = retrieveTokenFromLocalStorage()

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





        var getAuthenticated = function () {
            retrieveTokenFromLocalStorage()
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
            $window.localStorage.setItem('bearerToken', JSON.stringify(t));
            token = t

        }

        var getToken = function () {
            if(token == null || token == '')
                setToken(retrieveTokenFromLocalStorage())
            return token;
        }

        var logout = function () {
            console.log("logging out")
            setAuthenticated(false)
            setToken("")
            setUsername("")
            setPassword("")
            console.log("clearing local storage")
            $window.localStorage.clear();
        }


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