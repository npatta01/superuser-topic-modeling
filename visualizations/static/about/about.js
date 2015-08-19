'use strict';

angular.module('topic_app.topic', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/topic', {
    templateUrl: 'topic/topic.html',
    controller: 'TopicCtrl'
  });
}])

.controller('TopicCtrl', [function() {

}]);