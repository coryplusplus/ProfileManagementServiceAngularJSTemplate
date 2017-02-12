(function () {

    console.log("running calendar service");
    var app = angular.module("ProfileManagement.services");

    var calendarService = function ($http, urlService, authService, userLogin) {


        var calendarEntries = []
        var observerCallbacks = [];
        var getCountCallbacks = [];
        var count = 0
            //register an observer
        var registerObserverCallback = function (callback) {
            observerCallbacks.push(callback);
        };

        var registerGetCountCallback = function (callback) {
            getCountCallbacks.push(callback);
        };

        //call this when you know 'foo' has been changed
        var notifyObservers = function () {
            angular.forEach(observerCallbacks, function (callback) {
                callback();
            });
        };

        var notifyGetCountObservers = function () {
            angular.forEach(getCountCallbacks, function (callback) {
                callback();
            });
        };

        var getCalendarEntries = function () {
            return calendarEntries
        }

        var populateCalendarEntries = function (date) {

            var credentials = "Bearer " + authService.getToken()

            var month = date.getUTCMonth() + 1; //months from 1-12
            var day = date.getUTCDate();
            var year = date.getUTCFullYear();


            return $http.get(urlService.getCalendarURL() + "?month=" + month + "&year=" + year, {
                    headers: {
                        'Authorization': credentials
                    }
                })
                .then(function (resp) {
                    calendarEntries = resp.data
                    notifyObservers();
                    return resp;
                }, function (reason) {
                    return reason;
                });



        };

        var getCount = function () {
            return count;
        }

        var populateCount = function (date) {

            var credentials = "Bearer " + authService.getToken()


            return $http.get(urlService.getCalendarURL() + "/count/" + Math.round(date.getTime() / 1000), {
                    headers: {
                        'Authorization': credentials
                    }
                })
                .then(function (resp) {
                    count = resp.data["count"]
                    notifyGetCountObservers();
                    return resp;
                }, function (reason) {
                    return reason;
                });



        };

        var addEntry = function (startDate, stopDate, description) {
            var credentials = "Bearer " + authService.getToken()

            console.log("description:" + description)
            return $http.post(urlService.getCalendarURL() + "/entry", {
                    "startDate": startDate,
                    "stopDate": stopDate,
                    "profileName": userLogin.getUserName(),
                    "description": description
                }, {
                    headers: {
                        'Authorization': credentials
                    }
                })
                .then(function (resp) {
                    notifyObservers();
                    return resp;
                }, function (reason) {
                    return reason;
                });

        }

        return {
            registerObserverCallback: registerObserverCallback,
            registerGetCountCallback: registerGetCountCallback,
            populateCalendarEntries: populateCalendarEntries,
            getCalendarEntries: getCalendarEntries,
            addEntry: addEntry,
            populateCount: populateCount,
            getCount: getCount,

        };
    };

    app.service("calendarService", calendarService);

})();