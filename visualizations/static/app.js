'use strict';


// Declare app level module which depends on views, and components
angular.module('topic_app', [
    'ngRoute',
    'topic_app.topics',
    'topic_app.topic',
    'topic_app.about'
])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.otherwise({redirectTo: '/topics'});
    }])
    .controller('NavCtrl', ['$scope', '$location',function ($scope, $location) {


        $scope.items = [
            {path: '/topics', title: 'Topics', tab_name: 'tab_topics'},
            {path: '/topic', title: 'Topic', tab_name: 'tab_topic'},

            {path: '/about', title: 'About', tab_name: 'tab_about'}

        ];


        $scope.isActive = function (item) {
            if (item.path == $location.path()) {
                return true;
            }
            return false;
        };

    }]);