/// <reference path="../../references.ts" />
var topic_app;
(function (topic_app) {
    var TopicCtrl = (function () {
        function TopicCtrl($routeParams, $location, TopicService, SuperUserService) {
            var _this = this;
            this.$routeParams = $routeParams;
            this.$location = $location;
            this.TopicService = TopicService;
            this.SuperUserService = SuperUserService;
            this.topic = {};
            this.numberOfWords = 10;
            this.topics = null;
            this.chart_options = null;
            this.data_ready = false;
            this.selectedTopic = 0;
            this.strongest_docs = null;
            var topicId = parseInt($routeParams.topicId) || 0;
            TopicService.getAllTopics().then(function (result) {
                _this.topics = result;
                _this.topic = _this.topics[topicId];
                _this.selectedTopic = topicId;
                _this.updatePage();
            });
        }
        TopicCtrl.prototype.topicChanged = function () {
            this.$location.update_path("/topic/" + this.selectedTopic);
            this.updatePage();
        };
        TopicCtrl.prototype.updatePage = function () {
            var _this = this;
            this.topic = this.topics[this.selectedTopic];
            this.TopicService.getTopicDetail(this.selectedTopic, this.numberOfWords).then(function (result) {
                _this.topic = result.data.res;
                _this.createChart();
                _this.data_ready = true;
            });
            this.TopicService.getStrongestDocsForTopic(this.selectedTopic).then(function (result) {
                _this.strongest_docs = result.data.docs;
                for (var _i = 0, _a = _this.strongest_docs; _i < _a.length; _i++) {
                    var doc = _a[_i];
                    doc.url = _this.SuperUserService.getUrl(doc.id);
                }
            });
            this.$routeParams.topicId = this.selectedTopic;
        };
        TopicCtrl.prototype.createChart = function () {
            this.chart_options = {
                chart: {
                    type: 'multiBarHorizontalChart',
                    height: 600,
                    x: function (d) {
                        return d.text;
                    },
                    y: function (d) {
                        return d.weight;
                    },
                    showControls: false,
                    showValues: false,
                    transitionDuration: 500,
                    xAxis: {
                        showMaxMin: false
                    },
                    yAxis: {
                        axisLabel: 'Weight',
                        tickFormat: function (d) {
                            return d3.format(',.2f')(d);
                        }
                    }
                }
            };
            this.chart_data = [
                {
                    "key": "words",
                    "color": "#1f77b4",
                    "values": this.topic.counts
                }
            ];
        };
        TopicCtrl.$inject = ['$routeParams', '$location', 'TopicService', 'SuperUserService'];
        return TopicCtrl;
    })();
    topic_app.TopicCtrl = TopicCtrl;
    topic_app.topic_app_topic = angular.module('topic_app.topic', ['ngRoute', 'angular-jqcloud', 'ngLocationUpdate']);
    topic_app.topic_app_topic.config(['$routeProvider', function ($routeProvider) {
            $routeProvider.when('/topic/:topicId?', {
                templateUrl: 'static/components/topic/topic.html',
                reloadOnSearch: false,
                controller: 'TopicCtrl as vm'
            });
        }]);
    topic_app.topic_app_topic.controller('TopicCtrl', TopicCtrl);
})(topic_app || (topic_app = {}));
//# sourceMappingURL=topic.js.map