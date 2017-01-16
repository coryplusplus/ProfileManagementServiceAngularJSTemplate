(function () {

    console.log("running messageService");
    var app = angular.module("ProfileManagement.services");

    var commentService = function ($http, urlService, authService,userLogin) {


        var base_size = 20
        var base_start = 0
        var start = 0
        var size = base_size
        var paginationCount = 0
        var totalCommentCount = 0
        var unreadCommentCount = 0

        var observerCallbacks = [];
        var currentComment
        var currentCommentIndex
        var comments = []
        var currentMessageId

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


        var getCurrentComment = function () {
            return currentComment
        }

        var setCurrentComment = function (comment) {
            currentComment = comment
        }

        var setCurrentCommentIndex = function (index) {
            currentCommentIndex = index
        }
        var setTotalCommentCount = function (commentCount) {
            totalCommentCount = commentCount
        }

        var getTotalCommentCount = function () {
            return totalCommentCount
        }

        var setUnreadCommentCount = function (commentCount) {
            unreadCommentCount = commentCount
        }

        var getUnreadCommentCount = function () {
            return unreadCommentCount
        }

        var setPaginationCount = function () {
            return paginationCount
        }
        var populateComments = function (messageId) {
            comments = []
            currentMessageId = messageId
            var credentials = "Bearer " + authService.getToken()

            console.log("Attempting to populate comments")
            var queryParams = "?start=" + start + "&size=" + size


            return $http.get(urlService.getMessageURL() + "/" + messageId + "/comments/" + queryParams, {
                    headers: {
                        'Authorization': credentials
                    }
                })
                .then(function (resp) {

                    if (resp.data.length != 0)
                        angular.forEach(resp.data, function (data) {
                            comments.push(data)

                        });
                    notifyObservers();
                    return resp;
                }, function (reason) {
                    return reason;
                });



        };


        var postComment = function (messageId, comment) {
            var credentials = "Bearer " + authService.getToken()


            return $http.post(urlService.getMessageURL() + "/" + messageId + "/comments", {
                    "message": comment,
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

        var loadComments = function (messageId, index) {
            start = base_size * index
            populateComments(messageId)
        }

        var setStart = function (startValue) {
            start = startValue
        }
        var updatePaginationCount = function () {
            console.log("Updating pagination count")
            paginationCount = Math.floor(totalCommentCount / size)
            if (totalCommentCount % size != 0) {
                paginationCount = paginationCount + 1
            }

        }


        var getPaginationCount = function () {
            updatePaginationCount();
            return paginationCount;
        }
        var getComments = function () {
            return comments
        }

        var getComment = function (commentId) {

            var credentials = "Bearer " + authService.getToken()


            return $http.get(urlService.getMessageURL() + "/" + currentMessageId + "/comments/" + commentId, {
                    headers: {
                        'Authorization': credentials
                    }
                })
                .then(function (resp) {
                    currentComment = resp.data
                        //commentService.populateComments(currentMessage["id"])
                    return resp;
                }, function (reason) {
                    return reason;
                });



        };

        return {
            getComments: getComments,
            populateComments: populateComments,
            registerObserverCallback: registerObserverCallback,
            setTotalCommentCount: setTotalCommentCount,
            loadComments: loadComments,
            getPaginationCount: getPaginationCount,
            setCurrentComment: setCurrentComment,
            setCurrentCommentIndex: setCurrentCommentIndex,
            getComment: getComment,
            getCurrentComment: getCurrentComment,
            getTotalCommentCount: getTotalCommentCount,
            getUnreadCommentCount: getUnreadCommentCount,
            setUnreadCommentCount: setUnreadCommentCount,
            setPaginationCount: setPaginationCount,
            setStart: setStart,
            postComment: postComment,


        };

    };

    app.service("commentService", commentService);

})();