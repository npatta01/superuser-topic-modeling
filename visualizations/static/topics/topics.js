'use strict';

angular.module('topic_app.topics', ['ngRoute','ngAria'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/topics', {
    templateUrl: 'static/topics/topics.html',
    controller: 'TopicsCtrl'
  });
}])

.controller('TopicsCtrl', [function() {

}]);