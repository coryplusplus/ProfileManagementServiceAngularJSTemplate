'use strict';

// Declare app level module which depends on filters, and services

angular.module('ProfileManagement', [
  'ProfileManagement.controllers',
  'ProfileManagement.filters',
  'ProfileManagement.services',
  'ProfileManagement.directives',
  'mwl.calendar',
  'ngRoute',
  'ui.bootstrap',
  'uiGmapgoogle-maps',
]).

config(function ($routeProvider, $locationProvider) {
    $routeProvider.
    when('/login', {
        templateUrl: 'partials/login'
    }).
    when('/createProfile', {
        templateUrl: 'partials/createProfile'
    }).
    when('/createProfile', {
        templateUrl: 'partials/createProfile',
        controller: 'ProfileController'
    }).
    when('/messageFeed', {
        templateUrl: 'partials/messageFeed',
        controller: 'MessageController'
    }).
    when('/profile', {
        templateUrl: 'partials/profilePage',
        controller: 'MessageController'
    }).
    when('/calendar', {
        templateUrl: 'partials/calendar',
        controller: 'CalendarController'
    }).
    when('/schedule', {
        templateUrl: 'partials/schedule',
        controller: 'ScheduleController'
    }).
    when('/godMode', {
        templateUrl: 'partials/godMode',
        controller: 'GodModeController'
    }).
    otherwise({
        redirectTo: 'login'
    });

    $locationProvider.html5Mode(true);
});