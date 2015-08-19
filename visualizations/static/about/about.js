'use strict';

angular.module('topic_app.about', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/about', {
    templateUrl: 'static/about/about.html',
    controller: 'AboutCtrl'
  });
}])

.controller('AboutCtrl', ['$scope', function($scope) {
      $scope.items = [
        {path: '/topics', title: 'Topics', tab_name: 'tab_topics'},
        {path: '/about', title: 'About', tab_name: 'tab_about'}

      ];

}]);