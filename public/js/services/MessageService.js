(function () {

        console.log("running messageService");
        var app = angular.module("ProfileManagement.services");

        var messageService = function ($http, urlService, authService, commentService, ratingService, userLogin) {


            var base_size = 20
            var base_start = 0
            var start = 0
            var size = base_size
            var paginationCount = 0
            var totalMessageCount = 0
            var currentMessage
            var currentMessageIndex

            var observerCallbacks = [];
            var currentProfileName
            var messages = []
            var searchMessages = []

            var searchProfileName = ""
            var searchKeyword = ""
            var searchNotCommentedBy = ""
            var searchNotRatedBy = ""
            var searchDay = ""
            var searchMonth = ""
            var searchYear = ""
            var searchByDayOfWeek = ""



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

            var setCurrentMessage = function (message) {
                currentMessage = message
            }

            var getCurrentMessage = function () {
                return currentMessage
            }

            var setCurrentMessageIndex = function (index) {
                currentMessageIndex = index
            }

            var setTotalMessageCount = function (messageCount) {
                totalMessageCount = messageCount
            }

            var clearSearchMessages = function () {
                searchMessages = []
                notifyObservers()
            }
            
            var clearMessages = function() {
                messages = []
            }
            var populateMessages = function (profileName) {
                messages = []
                currentProfileName = profileName
                var credentials = "Bearer " + authService.getToken()

                console.log("Attempting to populate messages")
                var queryParams = ""//?start=" + start + "&size=" + size
                if (profileName != undefined && profileName != "") {
                    queryParams = queryParams + "?author=" + profileName
                }


                return $http.get(urlService.getMessageURL() + queryParams, {
                        headers: {
                            'Authorization': credentials
                        }
                    })
                    .then(function (resp) {
                        if (resp.data.length != 0)
                            angular.forEach(resp.data, function (data) {
                                messages.push(data)

                            });
                        notifyObservers();
                        return resp;
                    }, function (reason) {
                        return reason;
                    });



            };

            var populateMessagesFromSearch = function () {
                searchMessages = []
                var credentials = "Bearer " + authService.getToken()
                var queryParams = "?keyword=" + searchKeyword + "&dayOfMonth=" + searchDay + "&month=" + searchMonth + "&year=" + searchYear + "&notCommentedBy=" + searchNotCommentedBy + "&notRatedBy=" + searchNotRatedBy + "&dayOfWeek=" + searchByDayOfWeek

                var author = ""
                if (searchProfileName != undefined && searchProfileName != "") {
                    queryParams = queryParams + "&autor=" + author
                }
                console.log("Attempting to populate messages for search")
                console.log("queryParams: " + queryParams)


                return $http.get(urlService.getMessageURL() + queryParams, {
                        headers: {
                            'Authorization': credentials
                        }
                    })
                    .then(function (resp) {
                        if (resp.data.length != 0)
                            angular.forEach(resp.data, function (data) {
                                searchMessages.push(data)

                            });
                        notifyObservers();
                        return resp;
                    }, function (reason) {
                        return reason;
                    });



            };


            var loadMessages = function (index) {
                start = base_size * index
                populateMessages()
            }

            var updatePaginationCount = function () {
                console.log("Updating pagination count")
                paginationCount = Math.floor(totalMessageCount / size)
                if (totalMessageCount % size != 0) {
                    paginationCount = paginationCount + 1
                }

            }


            var getPaginationCount = function () {
                updatePaginationCount();
                return paginationCount;
            }
            var getMessages = function () {
                return messages
            }

            var getSearchMessages = function () {
                return searchMessages
            }

            var getMessage = function (messageId) {

                var credentials = "Bearer " + authService.getToken()


                return $http.get(urlService.getMessageURL() + "/" + messageId, {
                        headers: {
                            'Authorization': credentials
                        }
                    })
                    .then(function (resp) {
                        currentMessage = resp.data
                        commentService.populateComments(currentMessage["id"])
                        commentService.setTotalCommentCount(currentMessage["totalComments"])
                        commentService.setUnreadCommentCount(currentMessage["unreadComments"])
                        ratingService.populateAverageRating(currentMessage["id"])
                        return resp;
                    }, function (reason) {
                        return reason;
                    });



            };

            var postMessage = function (message) {
                var credentials = "Bearer " + authService.getToken()


                return $http.post(urlService.getMessageURL(), {
                        "messageName":"Message",
                        "message": message,
                        "author": userLogin.getUserName()
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
                
            }



        var updateSearchCriteria = function (notCommentedBy, notRatedBy, day, month, year, keyword, profileName, dayOfWeek) {
            console.log("Updating search criteria for messages")
            searchKeyword = keyword
            searchNotCommentedBy = notCommentedBy
            searchNotRatedBy = notRatedBy
            searchDay = day
            searchMonth = month
            searchYear = year
            searchProfileName = profileName
            searchByDayOfWeek = dayOfWeek
            console.log("Search profile name: " + searchProfileName)
        }

        return {
            getMessages: getMessages,
            populateMessages: populateMessages,
            registerObserverCallback: registerObserverCallback,
            setTotalMessageCount: setTotalMessageCount,
            loadMessages: loadMessages,
            getPaginationCount: getPaginationCount,
            setCurrentMessage: setCurrentMessage,
            setCurrentMessageIndex: setCurrentMessageIndex,
            getMessage: getMessage,
            getCurrentMessage: getCurrentMessage,
            updateSearchCriteria: updateSearchCriteria,
            getSearchMessages: getSearchMessages,
            populateMessagesFromSearch: populateMessagesFromSearch,
            clearSearchMessages: clearSearchMessages,
            postMessage: postMessage,
            clearMessages : clearMessages,


        };

    };

    app.service("messageService", messageService);

})();