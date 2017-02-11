(function () {

    var app = angular.module("ProfileManagement.controllers");


    console.log("Running ScheduleController Controller")
    var ScheduleController = function (authService, $scope, $http, $location, calendarService) {


        var weekday = ["Sunday","Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]


        var monthNames = ["January", "February", "March", "April", "May", "June",
                          "July", "August", "September", "October", "November", "December"
                         ];
        
        $scope.timeSlots = [{"startTime":8,"stopTime":10,"displayText":"8am - 10am","price":"$19.99"},
                        {"startTime":10,"stopTime":10,"displayText":"10am - Noon","price":"$19.99"},
                        {"startTime":12,"stopTime":14,"displayText":"Noon - 2pm","price":"$19.99"},
                        {"startTime":14,"stopTime":16,"displayText":"2pm - 4pm","price":"$19.99"},
                        {"startTime":16,"stopTime":18,"displayText":"4pm - 6pm","price":"$19.99"}]
        $scope.scheduleDates = []
        $scope.scheduleHeaders = []
        var init = function () {
            
            for (i = 0; i < 7; i++) {
                var currentDate = new Date();
                currentDate.setDate(currentDate.getDate() + i);
                var newDate = new Date(currentDate.getTime())
                $scope.scheduleDates.push(newDate)
                var weekdayString = weekday[newDate.getDay()]
                if(i == 0)
                {
                    weekdayString = "Today"
                }
                if(i == 1)
                {
                    weekdayString = "Tomorrow"  
                }
                var dict = {"weekday":weekdayString,"date":newDate.getDate(),"month":monthNames[newDate.getMonth()]}
                $scope.scheduleHeaders.push(dict)

            }
            console.log($scope.scheduleHeaders)
            console.log($scope.scheduleDates)
            console.log($scope.timeSlots)
        }


        $scope.activeTab = 0

        if (!authService.getAuthenticated()) {
            $location.path("/login")
        }

        $scope.logout = function () {
            authService.logout()
            $location.path("login")
        }

        var onError = function onError(reason) {
            $scope.error = reason;
        }

        var onComplete = function onComplete(resp) {
            $scope.status = resp.status
            if ($scope.status == 200) {

                $scope.error = ""
                $scope.errorMessage = ""
                $scope.success = "Success"

            } else if ($scope.status == 404) {
                $scope.error = "Unauthorized";
            } else {
                $scope.error = "Failure";

                $scope.errorMessage = resp.data["errorMessage"];

                console.log("Error message is equal to " + resp.errorMessage)


            }
        }

        var postEntryComplete = function postEntryComplete(resp) {
            $scope.status = resp.status
            if ($scope.status == 200) {

                console.log("successfully posted entry")
                $scope.error = ""
                $scope.errorMessage = ""
                $scope.success = "Successfully posted entry."
            } else {
                $scope.error = "Failed to post entru";

                $scope.errorMessage = resp.data["errorMessage"];

                console.log("Error message is equal to " + $scope.errorMessage)


            }
        }

        $scope.setActiveTab = function (tabToSet) {
            console.log("Setting active tab")
            $scope.activeTab = tabToSet
        }
        
        $scope.addEntry = function (timeSlot,scheduleHeader)
        {
            
            var date = scheduleHeader["date"]
            console.log("date is equal to " + date)
            var startTime = timeSlot["startTime"]
            var stopTime = timeSlot["stopTime"]
            var description = timeSlot["displayText"]
            var startDate = new Date()
            startDate.setHours(startTime)
            startDate.setMinutes(0)
            startDate.setDate(date)
            var stopDate = new Date()
            stopDate.setHours(stopTime)
            stopDate.setMinutes(0)
            stopDate.setDate(date)
            calendarService.addEntry(Math.round(startDate.getTime()/1000),Math.round(stopDate.getTime()/1000),description).then(postEntryComplete, onError)

        }

        init()

    };



    app.controller("ScheduleController", ScheduleController);


})();