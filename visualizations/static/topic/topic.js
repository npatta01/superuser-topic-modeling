/// <reference path="../references.ts" />
var topic_app;
(function (topic_app) {
    var TopicCtrl = (function () {
        function TopicCtrl($routeParams, TopicService) {
            var _this = this;
            this.$routeParams = $routeParams;
            this.TopicService = TopicService;
            this.dataReady = false;
            this.topic = {};
            this.numberOfWords = 10;
            this.topics = null;
            this.options = {};
            this.data = [];
            this.selectedTopic = 0;
            TopicService.getAllTopics().then(function (result) {
                _this.topics = result;
                var topicId = parseInt($routeParams.topicId) || 0;
                _this.topic = _this.topics[topicId];
                _this.selectedTopic = topicId;
                _this.updatePage();
            });
        }
        TopicCtrl.prototype.updatePage = function () {
            var _this = this;
            this.TopicService.getTopicDetail(this.selectedTopic, this.numberOfWords).then(function (result) {
                _this.topic = result.data.res;
                _this.createChart();
            });
        };
        TopicCtrl.prototype.createChart = function () {
            this.options = {
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
            this.data = [
                {
                    "key": "words",
                    "color": "#1f77b4",
                    "values": this.topic.counts
                }
            ];
        };
        TopicCtrl.$inject = ['$routeParams', 'TopicService'];
        return TopicCtrl;
    })();
    topic_app.TopicCtrl = TopicCtrl;
    topic_app.topic_app_topic = angular.module('topic_app.topic', ['ngRoute', 'angular-jqcloud']);
    topic_app.topic_app_topic.config(['$routeProvider', function ($routeProvider) {
            $routeProvider.when('/topic/:topicId?', {
                templateUrl: 'static/topic/topic.html',
                controller: 'TopicCtrl as vm'
            });
        }]);
    topic_app.topic_app_topic.controller('TopicCtrl', TopicCtrl);
})(topic_app || (topic_app = {}));
//# sourceMappingURL=topic.js.map