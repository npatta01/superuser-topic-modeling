'use strict';


// Declare app level module which depends on views, and components
angular.module('topic_app', [
    'ngRoute',
    'nvd3',
    'ngMaterial',
    'angular-loading-bar',
    'hc.marked',
    'ngAnimate',
    'topic_app.topics',
    'topic_app.topic',
    'topic_app.about'
])
    .config(['$routeProvider', '$mdThemingProvider', '$mdIconProvider', function ($routeProvider, $mdThemingProvider, $mdIconProvider) {


        $mdIconProvider
            .icon("menu"       , "/static/svg/menu.svg"        , 24);


        // $routeProvider.otherwise({redirectTo: '/topics'});
    }])
    .controller('NavCtrl', ['$mdSidenav','$scope', '$location', function ($mdSidenav, $scope, $location) {


        $scope.sections = [
            {path: '/topics', title: 'Topics', tab_name: 'tab_topics'},
            {path: '/topic', title: 'Topic', tab_name: 'tab_topic'},

            {path: '/about', title: 'About', tab_name: 'tab_about'}

        ];



        $scope.toggleMenu=function() {
            $mdSidenav('left').toggle();
        };


        $scope.isActive = function (item) {
            if (item.path == $location.path()) {
                return true;
            }
            return false;
        };

    }])
    .service('TopicService', ['$http', '$q', function ($http, $q) {

        var default_num_words = 10;

        var topics = null;

        this.getAllTopics = function () {
            var deferred = $q.defer();

            if (topics != null) {
                deferred.resolve(topics);
            } else {
                $http
                    .get('/api/topics', {
                        params: {
                            words_in_topic: default_num_words
                        }
                    }).success(function (result) {
                        deferred.resolve(result.res);
                    });
            }


            return deferred.promise;

        };

        this.getTopicDetail = function (topic_id, words_in_topic) {
            return $http
                .get('/api/topic', {
                    params: {
                        words_in_topic: words_in_topic,
                        topic_id: topic_id
                    }
                });
        }

    }]);