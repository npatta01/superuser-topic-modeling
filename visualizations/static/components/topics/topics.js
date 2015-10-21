/// <reference path="../../references.ts" />
var topic_app;
(function (topic_app) {
    var TopicService = (function () {
        function TopicService($http, $q) {
            this.$http = $http;
            this.$q = $q;
            this.default_num_words = 10;
        }
        TopicService.prototype.allTopicsPromise = function () {
            return this.$http
                .get('/api/topics', {
                params: {
                    words_in_topic: this.default_num_words
                }
            });
        };
        TopicService.prototype.allTopicDescriptionsPromise = function () {
            return this.$http
                .get('/api/topic_descriptions');
        };
        TopicService.prototype.getAllTopics = function () {
            if (this.fetchedPromise) {
                return this.fetchedPromise;
            }
            var deferred = this.$q.defer();
            if (this.topics && this.topics.length > 0) {
                deferred.resolve(this.topics);
            }
            else {
                var combinedPromise = this.$q.all({
                    allTopics: this.allTopicsPromise(),
                    allTopicDescriptions: this.allTopicDescriptionsPromise()
                });
                combinedPromise.then(function (responses) {
                    this.topics = responses.allTopics.data.res;
                    this.topic_descriptions = responses.allTopicDescriptions.data.res;
                    for (var i = 0; i < this.topics.length; i++) {
                        var t = this.topics[i];
                        var td = this.topic_descriptions[i];
                        t.name = td.name;
                        t.description = td.description;
                    }
                    deferred.resolve(this.topics);
                });
            }
            this.fetchedPromise = deferred.promise;
            return deferred.promise;
        };
        TopicService.prototype.getTopicDetail = function (topic_id, words_in_topic) {
            var _this = this;
            var deferred = this.$q.defer();
            this.fetchedPromise.then(function (result) {
                _this.$http.get('/api/topic', {
                    params: {
                        words_in_topic: words_in_topic,
                        topic_id: topic_id
                    }
                }).success(function (result) {
                    var topic = result.res;
                    var t = _this.topics[topic_id];
                    topic.name = t.name;
                    topic.description = t.description;
                    deferred.resolve(topic);
                }).error(function (result) {
                    var k = result;
                });
            });
            return deferred.promise;
        };
        TopicService.prototype.getStrongestDocsForTopic = function (topic_id) {
            return this.$http
                .get('/api/topic_docs', {
                params: {
                    topic_id: topic_id
                }
            });
        };
        TopicService.prototype.getTopicDescription = function (topic_id) {
            var _this = this;
            var deferred = this.$q.defer();
            var topic_id = topic_id || 0;
            if (this.topic_descriptions != null) {
                deferred.resolve(this.topic_descriptions[topic_id]);
            }
            else {
                this.$http
                    .get('/api/topic_descriptions', {}).success(function (result) {
                    _this.topic_descriptions = result.res;
                    deferred.resolve(_this.topic_descriptions);
                });
            }
            return deferred.promise;
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
            topic.active = false;
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
                templateUrl: 'static/components/topics/topics.html',
                controller: 'TopicsCtrl as vm'
            });
        }]);
})(topic_app || (topic_app = {}));
//# sourceMappingURL=topics.js.map