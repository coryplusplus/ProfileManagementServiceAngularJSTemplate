(function () {

    console.log("running calendar service");
    var app = angular.module("ProfileManagement.services");

    var calendarService = function ($http, urlService, authService) {


        var calendarEntries = []
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

        var getCalendarEntries = function()
        {
            return calendarEntries
        }
        
        var populateCalendarEntries = function (date) {

            var credentials = "Bearer " + authService.getToken()

            var month = date.getUTCMonth() + 1; //months from 1-12
            var day = date.getUTCDate();
            var year = date.getUTCFullYear();


            return $http.get(urlService.getCalendarURL() + "?month="+month + "&year="+year , {
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

        return {
            registerObserverCallback: registerObserverCallback,
            populateCalendarEntries:populateCalendarEntries,
            getCalendarEntries:getCalendarEntries,

        };
    };

    app.service("calendarService", calendarService);

})();