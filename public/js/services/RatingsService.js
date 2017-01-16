(function () {

    console.log("running ratingService");
    var app = angular.module("ProfileManagement.services");

    var ratingService = function ($http, urlService, authService) {


        var averageRating = 0
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

        var getAverageRating = function()
        {
            return averageRating
        }
        
        var populateAverageRating = function (messageId) {

            var credentials = "Bearer " + authService.getToken()


            return $http.get(urlService.getMessageURL() + "/" + messageId + "/ratings/rating" , {
                    headers: {
                        'Authorization': credentials
                    }
                })
                .then(function (resp) {
                    averageRating = resp.data["rating"]
                    console.log("Setting average rating equal to " + resp.data["rating"])
                    notifyObservers();
                    return resp;
                }, function (reason) {
                    return reason;
                });



        };

        return {
            registerObserverCallback: registerObserverCallback,
            populateAverageRating:populateAverageRating,
            getAverageRating:getAverageRating,

        };
    };

    app.service("ratingService", ratingService);

})();