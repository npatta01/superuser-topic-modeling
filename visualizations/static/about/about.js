'use strict';

angular.module('topic_app.about', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/about', {
            templateUrl: 'static/about/about.html',
            controller: 'AboutCtrl'
        });
    }])

    .controller('AboutCtrl', ['$scope', '$http', function ($scope, $http) {




        $http.get('/static/about.md').success(function (data) {
            $scope.content = data;
        });
    }]);