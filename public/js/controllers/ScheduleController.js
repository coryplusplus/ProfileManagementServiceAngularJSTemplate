(function () {

    var app = angular.module("ProfileManagement.controllers");


    console.log("Running ScheduleController Controller")
    var ScheduleController = function (authService, $scope, $http, $location, calendarService) {


        var weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]


        var monthNames = ["January", "February", "March", "April", "May", "June",
                          "July", "August", "September", "October", "November", "December"
                         ];


        //This variable determines the maximum number of existing 
        //entries that can exist and still allow us to add another identical entry
        $scope.countMax = 1
        $scope.count = 0
        $scope.scheduleDates = []
        $scope.scheduleHeaders = []
        $scope.existingEntries = []

        var onError = function onError(reason) {
            $scope.error = reason;
        }


        var setupTimeSlots = function setupTimeSlots() {
            $scope.timeSlots = []

            for (i = 0; i < 7; i++) {
                var currentDate = new Date();
                currentDate.setDate(currentDate.getDate() + i);
                var date = currentDate.getDate()
                var existingEntry = $scope.existingEntries[date]
                var defaultTimes = [{
                        "available": true,
                        "startTime": 8,
                        "stopTime": 10,
                        "displayText": "8am - 10am",
                        "price": "$19.99"
                    },
                    {
                        "available": true,
                        "startTime": 10,
                        "stopTime": 10,
                        "displayText": "10am - Noon",
                        "price": "$19.99"
                    },
                    {
                        "available": true,
                        "startTime": 12,
                        "stopTime": 14,
                        "displayText": "Noon - 2pm",
                        "price": "$19.99"
                    },
                    {
                        "available": true,
                        "startTime": 14,
                        "stopTime": 16,
                        "displayText": "2pm - 4pm",
                        "price": "$19.99"
                    },
                    {
                        "available": true,
                        "startTime": 16,
                        "stopTime": 18,
                        "displayText": "4pm - 6pm",
                        "price": "$19.99"
                    }]
                var updatedTimeSlot = defaultTimes
                if (existingEntry != null) {
                    console.log("found an existing entry for date: " + date)
                    for (j = 0; j < updatedTimeSlot.length; j++) {
                        var entry = existingEntry[updatedTimeSlot[j]["startTime"]]
                        if (entry != null) {
                            console.log("found an existing entry")
                            console.log("Entry not available for time " + updatedTimeSlot[j]["startTime"])
                            updatedTimeSlot[j]["available"] = false

                        } else {
                            updatedTimeSlot[j]["available"] = true

                        }
                    }

                }


                $scope.timeSlots.push(updatedTimeSlot)
            }
            console.log($scope.timeSlots)

        }


        var setupSchedules = function setupSchedules() {
            $scope.scheduleDates = []
            $scope.scheduleHeaders = []

            for (i = 0; i < 7; i++) {
                var currentDate = new Date();
                currentDate.setDate(currentDate.getDate() + i);
                var newDate = new Date(currentDate.getTime())
                $scope.scheduleDates.push(newDate)
                var weekdayString = weekday[newDate.getDay()]
                if (i == 0) {
                    weekdayString = "Today"
                }
                if (i == 1) {
                    weekdayString = "Tomorrow"
                }
                var dict = {
                    "weekday": weekdayString,
                    "date": newDate.getDate(),
                    "month": monthNames[newDate.getMonth()]
                }
                $scope.scheduleHeaders.push(dict)

            }

            setupTimeSlots()

        }
        var updateCalendarEntries = function updateCalendarEntries() {
            //We are making a map here of all current entries for the month
            //We will use this to disable selections
            console.log("Updating calendar entries")
            $scope.calendarEntries = calendarService.getCalendarEntries()
            for (i = 0; i < $scope.calendarEntries.length; i++) {
                var newDate = new Date($scope.calendarEntries[i].startDate * 1000)
                    //$scope.existingEntries[date.getHours()] = $scope.calendarEntries[i]
                var date = newDate.getDate()
                var dateMap = $scope.existingEntries[date]
                var hour = newDate.getHours()
                var dict = {}
                dict[hour] = $scope.calendarEntries[i]

                if (dateMap == null) {
                    $scope.existingEntries[date] = dict
                } else {
                    dateMap[hour] = $scope.calendarEntries[i]
                    $scope.existingEntries[date] = dateMap
                }
            }
            console.log("UpdateCalendarEntries")
            console.log($scope.existingEntries)
            setupSchedules()

        }

        var onPopulateCalendarEntriesComplete = function onPopulateCalendarEntriesComplete(resp) {
            $scope.status = resp.status
            if ($scope.status == 200) {

                $scope.error = ""
                $scope.errorMessage = ""
                $scope.success = "Successfully populated calendar entries."

            } else {
                $scope.error = "Failed to populate calendar entries";

                $scope.errorMessage = resp.data["errorMessage"];

                console.log("Error message is equal to " + resp.errorMessage)


            }
        }

        var onGetCountComplete = function onGetCountComplete(resp) {
            $scope.status = resp.status
            if ($scope.status == 200) {

                $scope.error = ""
                $scope.errorMessage = ""
                $scope.success = "Successfully retrieved count."

            } else {
                $scope.error = "Failed to retrieve count";

                $scope.errorMessage = resp.data["errorMessage"];

                console.log("Error message is equal to " + resp.errorMessage)


            }
        }


        var getCount = function (date) {
            console.log("calling getCount")
            calendarService.populateCount(date).then(onGetCountComplete, onError)

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
            //Refresh entries here
            calendarService.populateCalendarEntries(new Date()).then(onPopulateCalendarEntriesComplete, onError)

        }

        var add = function () {
            console.log("Calling the add method")
            if (calendarService.getCount() >= $scope.countMax) {
                console.log("Sorry someone has already taken this spot")
                return
            }
            var date = $scope.currentScheduleHeader["date"]
            console.log("date is equal to " + date)
            var startTime = $scope.currentTimeSlot["startTime"]
            var stopTime = $scope.currentTimeSlot["stopTime"]
            var description = $scope.currentTimeSlot["displayText"]
            var startDate = new Date()
            startDate.setHours(startTime)
            startDate.setMinutes(0)
            startDate.setDate(date)

            var stopDate = new Date()
            stopDate.setHours(stopTime)
            stopDate.setMinutes(0)
            stopDate.setDate(date)
            calendarService.addEntry(Math.round(startDate.getTime() / 1000), Math.round(stopDate.getTime() / 1000), description).then(postEntryComplete, onError)

        }


        var init = function () {
            calendarService.registerObserverCallback(updateCalendarEntries)
            calendarService.registerGetCountCallback(add)
            calendarService.populateCalendarEntries(new Date()).then(onPopulateCalendarEntriesComplete, onError)
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



        $scope.setActiveTab = function (tabToSet) {
            console.log("Setting active tab")
            $scope.activeTab = tabToSet
        }



        $scope.addEntry = function (timeSlot, scheduleHeader) {

            $scope.currentTimeSlot = timeSlot
            $scope.currentScheduleHeader = scheduleHeader

            var date = scheduleHeader["date"]
            console.log("date is equal to " + date)
            var startTime = timeSlot["startTime"]
            var stopTime = timeSlot["stopTime"]
            var description = timeSlot["displayText"]
            var startDate = new Date()
            startDate.setHours(startTime)
            startDate.setMinutes(0)
            startDate.setDate(date)

            getCount(startDate)

        }

        init()

    };



    app.controller("ScheduleController", ScheduleController);


})();