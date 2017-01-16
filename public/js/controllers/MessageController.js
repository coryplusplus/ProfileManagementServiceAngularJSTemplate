(function () {

    var app = angular.module("ProfileManagement.controllers");


    console.log("Running Message Controller")
    var MessageController = function (authService, messageService, $scope, $location, $anchorScroll, commentService) {

        $scope.currentPage = 0
        $scope.currentMessage = messageService.getCurrentMessage()
        $scope.messages = messageService.getMessages()
        messageService.clearSearchMessages()
        $scope.searchMessages = []

        $scope.totalComments = commentService.getTotalCommentCount()
        $scope.unreadComments = commentService.getUnreadCommentCount()
        $scope.paginationCount = messageService.getPaginationCount()
        $scope.searchNotCommentedBy = ""
        $scope.searchNotRatedBy = ""
        $scope.searchDay = ""
        $scope.searchMonth = ""
        $scope.searchYear = ""
        $scope.searchKeyword = ""
        $scope.searchProfilName = ""
        $scope.searchByDayOfWeek = ""


        $scope.logout = function () {
            authService.logout()
            $location.path("login")
        }

        if (!authService.getAuthenticated()) {
            $location.path("/login")
        }

        var updateMessages = function () {
            $scope.messages = messageService.getMessages()
            $scope.searchMessages = messageService.getSearchMessages()

            $scope.paginationCount = messageService.getPaginationCount()
            $scope.currentMessage = messageService.getCurrentMessage()
            $scope.totalComments = commentService.getTotalCommentCount()
            $scope.unreadComments = commentService.getUnreadCommentCount()



        }

        messageService.registerObserverCallback(updateMessages)


        $scope.getNumber = function (num) {
            return new Array(num);
        }


        $scope.goToMessages = function () {
            // set the location.hash to the id of
            // the element you wish to scroll to.
            $location.hash('messages');

            // call $anchorScroll()
            $anchorScroll();
        };

        $scope.hash = function (hashValue) {
            // set the location.hash to the id of
            // the element you wish to scroll to.
            $location.hash(hashValue);

        };

        var onError = function onError(reason) {
            $scope.error = reason;
        }

        var postMessageComplete = function postMessageComplete(resp) {
            $scope.status = resp.status
            if ($scope.status == 200) {

                console.log("successfully retrieved message")
                $scope.error = ""
                $scope.errorMessage = ""
                $scope.success = "Successfully retrieved message."
                $scope.messages = $scope.loadMessages(0)
            } else {
                $scope.error = "Failed to retrieve message";

                $scope.errorMessage = resp.data["errorMessage"];

                console.log("Error message is equal to " + $scope.errorMessage)


            }
        }
        var getMessageComplete = function getMessageComplete(resp) {
            $scope.status = resp.status
            if ($scope.status == 200) {

                console.log("successfully retrieved message")
                $scope.error = ""
                $scope.errorMessage = ""
                $scope.success = "Successfully retrieved message."
                $scope.currentMessage = messageService.getCurrentMessage()
                $scope.totalComments = commentService.getTotalCommentCount()
                $location.path("message")
            } else {
                $scope.error = "Failed to retrieve message";

                $scope.errorMessage = resp.data["errorMessage"];

                console.log("Error message is equal to " + $scope.errorMessage)


            }
        }
        $scope.getMessage = function (messageId, index) {
            $scope.currentMessageIndex = index
            console.log("Just set currentMessageindex to " + index)
            messageService.setCurrentMessageIndex($scope.currentMessageIndex)
            messageService.getMessage(messageId).then(getMessageComplete, onError);
        }


        $scope.loadMessages = function (index, search) {
            $scope.currentPage = index
            console.log("setting current page equal to " + index)
            console.log("calling load messages with index " + index)
            messageService.loadMessages(index);
        }

        $scope.postMessage = function (message) {
            $scope.clearText()
            console.log("Posting message: " + message)
            messageService.postMessage(message).then(postMessageComplete, onError)
        }
        
        $scope.clearText = function()
        {
            $scope.description = ""
        }

        $scope.clearSearch = function () {
            $scope.searchNotCommentedBy = ""
            $scope.searchNotRatedBy = ""
            $scope.searchDay = ""
            $scope.searchMonth = ""
            $scope.searchYear = ""
            $scope.searchKeyword = ""
            $scope.searchProfileName = ""
            $scope.searchByDayOfWeek = ""
            messageService.clearSearchMessages()
            $scope.results = null
            $scope.searchMessages = []

        }



        var onComplete = function onComplete(resp) {
            $scope.status = resp.status
            if ($scope.status == 200) {

                $scope.error = ""
                $scope.errorMessage = ""
                $scope.success = "Success"

                if ($scope.searchMessages && $scope.searchMessages.length == 0) {
                    $scope.results = "No results found"
                    console.log("setting results to no results found")
                } else {
                    $scope.results = null
                }

            } else if ($scope.status == 404) {
                $scope.error = "Unauthorized";
            } else {
                $scope.error = "Failure";

                $scope.errorMessage = resp.data["errorMessage"];

                console.log("Error message is equal to " + resp.errorMessage)


            }
        }

        $scope.search = function () {
            console.log("Calling search for messages")
            var searchMonth = $scope.searchMonth;
            var searchDayOfWeek = $scope.searchByDayOfWeek;
            if ($scope.searchMonth == 0) {
                searchMonth = ""
            }
            if ($scope.searchByDayOfWeek == 0) {
                searchDayOfWeek = ""
            }

            messageService.updateSearchCriteria($scope.searchNotCommentedBy, $scope.searchNotRatedBy,
                $scope.searchDay, searchMonth, $scope.searchYear, $scope.searchKeyword, $scope.searchProfileName, searchDayOfWeek);
            messageService.populateMessagesFromSearch().then(onComplete, onError)


        }




    };


    app.controller("MessageController", MessageController);


})();