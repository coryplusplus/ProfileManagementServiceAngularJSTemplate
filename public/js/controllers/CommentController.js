(function () {

    var app = angular.module("ProfileManagement.controllers");


    console.log("Running Comment Controller")
    var CommentController = function (authService, commentService, messageService, $scope, $location, $anchorScroll) {

        $scope.currentPage = 0
        $scope.currentComment = commentService.getCurrentComment()
        $scope.comments = commentService.getComments()
        $scope.paginationCount = commentService.getPaginationCount()


        if (!authService.getAuthenticated()) {
            $location.path("/login")
        }

        $scope.logout = function () {
            authService.logout()
            $location.path("login")
        }

        var updateComments = function () {
            $scope.comments = commentService.getComments()
            $scope.paginationCount = commentService.getPaginationCount()
            $scope.currentComment = commentService.getCurrentComment()
        }

        commentService.registerObserverCallback(updateComments)


        $scope.getNumber = function (num) {
            return new Array(num);
        }



        var onError = function onError(reason) {
            $scope.error = reason;
        }
        var getCommentComplete = function getCommentComplete(resp) {
            $scope.status = resp.status
            if ($scope.status == 200) {

                console.log("successfully retrieved comment")
                $scope.error = ""
                $scope.errorMessage = ""
                $scope.success = "Successfully retrieved message."
                $scope.currentMessage = commentService.getCurrentComment()
                $location.path("comment")
            } else {
                $scope.error = "Failed to retrieve comment";

                $scope.errorMessage = resp.data["errorMessage"];

                console.log("Error message is equal to " + $scope.errorMessage)


            }
        }
        $scope.getComment = function (commentId, index) {
            $scope.currentCommentIndex = index
            console.log("Just set currentCommentIndex to " + index)
            commentService.setCurrentCommentIndex($scope.currentCommentIndex)
            commentService.getComment(commentId).then(getCommentComplete, onError);
        }


        $scope.loadComments = function (messageId, index) {
            $scope.currentPage = index
            $scope.messageId = messageId
            console.log("setting current page equal to " + index)
            console.log("calling load messages with index " + index)
            commentService.loadComments(messageId, index);
        }

        $scope.commentsLoaded = function (messageId) {
            console.log("Checking if comments loaded with messageId " + messageId)
            if ($scope.messageId == messageId) {
                return true
            } else {
                return false
            }
        }

        var postCommentComplete = function postCommentComplete(resp) {
            $scope.status = resp.status
            if ($scope.status == 200) {

                console.log("successfully retrieved message")
                $scope.error = ""
                $scope.errorMessage = ""
                $scope.success = "Successfully retrieved message."
                if ($scope.author != undefined) {
                    messageService.clearMessages()
                    messageService.populateMessages($scope.author)
                } else {
                    messageService.loadMessages(0)

                }
            } else {
                $scope.error = "Failed to retrieve message";

                $scope.errorMessage = resp.data["errorMessage"];

                console.log("Error message is equal to " + $scope.errorMessage)


            }
        }
        $scope.postComment = function (messageId, comment, author) {
            $scope.author = author
            $scope.messageId = messageId
            console.log("Posting comment: " + comment)
            commentService.postComment(messageId, comment).then(postCommentComplete, onError)
        }




    };


    app.controller("CommentController", CommentController);


})();