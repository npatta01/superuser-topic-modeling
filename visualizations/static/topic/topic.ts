/// <reference path="../references.ts" />

module topic_app {


    export class TopicCtrl {
        public static $inject = ['$routeParams', 'TopicService'];

        public dataReady = false;
        public topic:Topic = <Topic>{};
        public numberOfWords = 10;

        public topics:Array<Topic> = null;
        public options = {};
        public data:Array<any> = [];

        public states;

        public selectedTopic = 0;

        constructor(private $routeParams:any, private TopicService:TopicService) {

            TopicService.getAllTopics().then((result:any)=> {
                this.topics = result;
                var topicId = parseInt($routeParams.topicId) || 0;
                this.topic = this.topics[topicId];
                this.selectedTopic=topicId;

                this.updatePage();
            });



        }

        public updatePage() {


            this.TopicService.getTopicDetail(this.selectedTopic, this.numberOfWords).then((result:any)=> {
                this.topic = result.data.res;

                this.createChart();
            });

        }

        private createChart() {

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
                    "key": "words"
                    , "color": "#1f77b4"
                    , "values": this.topic.counts
                }
            ];
        }


    }


    export var topic_app_topic = angular.module('topic_app.topic',
        ['ngRoute', 'angular-jqcloud']);


    topic_app_topic.config(['$routeProvider', function ($routeProvider:angular.route.IRouteProvider) {
        $routeProvider.when('/topic/:topicId?', {
            templateUrl: 'static/topic/topic.html',
            controller: 'TopicCtrl as vm'
        });
    }]);


    topic_app_topic.controller('TopicCtrl', TopicCtrl);


}

