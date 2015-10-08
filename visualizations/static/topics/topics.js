'use strict';

angular.module('topic_app.topics', ['ngRoute', 'ngAria'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/topics', {
            templateUrl: 'static/topics/topics.html',
            controller: 'TopicsCtrl'
        });
    }])

    .controller('TopicsCtrl', ['$scope', 'TopicService', function ($scope, TopicService) {


        TopicService.getAllTopics().then(function (result) {
            $scope.topics = result;
        });


    }]);