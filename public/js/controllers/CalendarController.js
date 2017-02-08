(function () {

    var app = angular.module("ProfileManagement.controllers");


    console.log("Running Home Controller")
    var CalendarController = function ($scope, $http, $location, calendarConfig, calendarService) {

        var vm = this;

        $scope.calendarEntries = calendarService.getCalendarEntries()


        $scope.init = function init() {
            calendarService.populateCalendarEntries(vm.viewDate)
            $scope.calendarEntries = calendarService.getCalendarEntries()
            populateEvents()
        }

        var updateCalendarEntries = function updateCalendarEntries() {
            console.log("Updating calendar entries")
            $scope.calendarEntries = calendarService.getCalendarEntries()
            populateEvents()

        }

        var populateEvents = function populateEvents() {
            var arrayLength = $scope.calendarEntries.length;arrayLength
            vm.events = []
            for (var i = 0; i < arrayLength; i++) {
                console.log("Adding a calendar entry")
                vm.events.push({
                    title: $scope.calendarEntries[i].profileName + ":" + $scope.calendarEntries[i].description,
                    startsAt: new Date($scope.calendarEntries[i].startDate*1000),
                    endsAt: new Date($scope.calendarEntries[i].stopDate*1000),
                    color: calendarConfig.colorTypes.important,
                    draggable: true,
                    resizable: true
                });
                //Do something
            }
        }
        calendarService.registerObserverCallback(updateCalendarEntries)

        
        $scope.previousSelected = function previousSelected()
        {
            vm.cellIsOpen = false
            calendarService.populateCalendarEntries(vm.viewDate)
        }
        
        $scope.nextSelected = function nextSelected()
        {
            vm.cellIsOpen = false
            calendarService.populateCalendarEntries(vm.viewDate)
        }
        //These variables MUST be set as a minimum for the calendar to work
        vm.calendarView = 'year';
        vm.viewDate = new Date();
        var actions = [{
            label: '<i class=\'glyphicon glyphicon-pencil\'></i>',
            onClick: function (args) {
                alert.show('Edited', args.calendarEvent);
            }
    }, {
            label: '<i class=\'glyphicon glyphicon-remove\'></i>',
            onClick: function (args) {
                alert.show('Deleted', args.calendarEvent);
            }
    }];
        vm.events = [
            {
                title: 'An event',
                color: calendarConfig.colorTypes.warning,
                startsAt: moment().startOf('week').subtract(2, 'days').add(8, 'hours').toDate(),
                endsAt: moment().startOf('week').add(1, 'week').add(9, 'hours').toDate(),
                draggable: true,
                resizable: true,
                actions: actions
      }, {
                title: '<i class="glyphicon glyphicon-asterisk"></i> <span class="text-primary">Another event</span>, with a <i>html</i> title',
                color: calendarConfig.colorTypes.info,
                startsAt: moment().subtract(1, 'day').toDate(),
                endsAt: moment().add(5, 'days').toDate(),
                draggable: true,
                resizable: true,
                actions: actions
      }, {
                title: 'This is a really long event title that occurs on every year',
                color: calendarConfig.colorTypes.important,
                startsAt: moment().startOf('day').add(7, 'hours').toDate(),
                endsAt: moment().startOf('day').add(19, 'hours').toDate(),
                recursOn: 'year',
                draggable: true,
                resizable: true,
                actions: actions
      }
    ];

        vm.cellIsOpen = false;

        vm.addEvent = function () {
            vm.events.push({
                title: 'New event',
                startsAt: moment().startOf('day').toDate(),
                endsAt: moment().endOf('day').toDate(),
                color: calendarConfig.colorTypes.important,
                draggable: true,
                resizable: true
            });
        };

        vm.eventClicked = function (event) {
            console.log("Clicked")
            alert.show('Clicked', event);
        };

        vm.eventEdited = function (event) {
            alert.show('Edited', event);
        };

        vm.eventDeleted = function (event) {
            alert.show('Deleted', event);
        };

        vm.eventTimesChanged = function (event) {
            alert.show('Dropped or resized', event);
        };

        vm.toggle = function ($event, field, event) {
            $event.preventDefault();
            $event.stopPropagation();
            event[field] = !event[field];
        };

        vm.timespanClicked = function (date, cell) {

            if (vm.calendarView === 'month') {
                if ((vm.cellIsOpen && moment(date).startOf('day').isSame(moment(vm.viewDate).startOf('day'))) || cell.events.length === 0 || !cell.inMonth) {
                    vm.cellIsOpen = false;
                } else {
                    vm.cellIsOpen = true;
                    vm.viewDate = date;
                }
            } else if (vm.calendarView === 'year') {
                if ((vm.cellIsOpen && moment(date).startOf('month').isSame(moment(vm.viewDate).startOf('month'))) || cell.events.length === 0) {
                    vm.cellIsOpen = false;
                } else {
                    vm.cellIsOpen = true;
                    vm.viewDate = date;
                }
            }

        };




    };


    app.controller("CalendarController", CalendarController);


})();