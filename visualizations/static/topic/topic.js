'use strict';

angular.module('topic_app.topic', ['ngRoute','angular-jqcloud'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/topic', {
            templateUrl: 'static/topic/topic.html',
            controller: 'TopicCtrl'
        });
    }])

    .controller('TopicCtrl', ['$scope', function ($scope) {

        $scope.words = [
            {text: "Lorem", weight: 0.01},
            {text: "Ipsum", weight: 0.5},
            {text: "Dolor", weight: 0.03},
            {text: "Sit", weight: 0.7}

        ];

    }]);