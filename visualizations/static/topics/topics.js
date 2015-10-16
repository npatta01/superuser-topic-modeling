var topic_app;
(function (topic_app) {
    var TopicService = (function () {
        function TopicService($http, $q) {
            this.$http = $http;
            this.$q = $q;
            this.default_num_words = 10;
            this.topics = null;
        }
        TopicService.prototype.getAllTopics = function () {
            var deferred = this.$q.defer();
            if (this.topics != null) {
                deferred.resolve(this.topics);
            }
            else {
                this.$http
                    .get('/api/topics', {
                    params: {
                        words_in_topic: this.default_num_words
                    }
                }).success(function (result) {
                    deferred.resolve(result.res);
                });
            }
            return deferred.promise;
        };
        TopicService.prototype.getTopicDetail = function (topic_id, words_in_topic) {
            return this.$http
                .get('/api/topic', {
                params: {
                    words_in_topic: words_in_topic,
                    topic_id: topic_id
                }
            });
        };
        TopicService.$inject = [
            '$http',
            '$q'];
        return TopicService;
    })();
    topic_app.TopicService = TopicService;
    var TopicsCtrl = (function () {
        function TopicsCtrl(TopicService) {
            var _this = this;
            this.topics = [];
            TopicService.getAllTopics().then(function (result) {
                _this.topics = result;
            });
        }
        TopicsCtrl.prototype.hoverIn = function (topic) {
            topic.active = true;
        };
        TopicsCtrl.prototype.hoverOut = function (topic) {
            topic.active = true;
        };
        TopicsCtrl.$inject = ['TopicService'];
        return TopicsCtrl;
    })();
    topic_app.TopicsCtrl = TopicsCtrl;
    topic_app.topic_app_topics = angular.module('topic_app.topics', ['ngRoute', 'ngAria']);
    topic_app.topic_app_topics.service('TopicService', TopicService);
    topic_app.topic_app_topics.controller('TopicsCtrl', TopicsCtrl);
    topic_app.topic_app_topics.config(['$routeProvider', function ($routeProvider) {
            $routeProvider.when('/topics', {
                templateUrl: 'static/topics/topics.html',
                controller: 'TopicsCtrl as vm'
            });
        }]);
})(topic_app || (topic_app = {}));
//# sourceMappingURL=topics.js.map