'use strict';

// Declare app level module which depends on filters, and services

angular.module('ProfileManagement', [
  'ProfileManagement.controllers',
  'ProfileManagement.filters',
  'ProfileManagement.services',
  'ProfileManagement.directives'
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
    otherwise({
        redirectTo: 'login'
    });

    $locationProvider.html5Mode(true);
});