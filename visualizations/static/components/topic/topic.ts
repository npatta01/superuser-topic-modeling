/// <reference path="../../references.ts" />

module topic_app {


    export class TopicCtrl {
        public static $inject = ['$routeParams', '$location', 'TopicService', 'SuperUserService'];

        public topic:Topic = <Topic>{};
        public numberOfWords = 20;

        public topics:Array<Topic> = null;
        public chart_options = null;
        public chart_data:Array<any>;
        public data_ready = false;

        public states;

        public selectedTopic = 0;
        public strongest_docs:Array<Document> = null;

        constructor(private $routeParams:any
            , private $location:any
            , private TopicService:TopicService
            , private SuperUserService:SuperUserService) {
            var topicId = parseInt($routeParams.topicId) || 0;


            TopicService.getAllTopics().then((result:any)=> {
                this.topics = result;

                this.topic = this.topics[topicId];
                this.selectedTopic = topicId;

                this.updatePage();
            });


        }

        public topicChanged() {
            this.$location.update_path("/topic/" + this.selectedTopic);
            this.updatePage();

        }

        public updatePage() {
            this.topic = this.topics[this.selectedTopic];

            this.TopicService.getTopicDetail(this.selectedTopic, this.numberOfWords).then((result:any)=> {
                this.topic = result;

                this.createChart();
                this.data_ready = true;
            });

            this.TopicService.getStrongestDocsForTopic(this.selectedTopic).then((result:any)=> {
                this.strongest_docs = result.data.docs;

                for (var doc of this.strongest_docs) {
                    doc.url = this.SuperUserService.getUrl(doc.id);
                }
            });

            this.$routeParams.topicId = this.selectedTopic;


        }

        private createChart() {

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
                    "key": "words"
                    , "color": "#1f77b4"
                    , "values": this.topic.counts
                }
            ];
        }


    }


    export var topic_app_topic = angular.module('topic_app.topic',
        ['ngRoute', 'angular-jqcloud', 'ngLocationUpdate','bgf.paginateAnything','angularUtils.directives.dirPagination']);


    topic_app_topic.config(['$routeProvider', function ($routeProvider:angular.route.IRouteProvider) {
        $routeProvider.when('/topic/:topicId?', {
            templateUrl: 'static/components/topic/topic.html',
            reloadOnSearch: false,
            controller: 'TopicCtrl as vm'
        });
    }]);


    topic_app_topic.controller('TopicCtrl', TopicCtrl);


}

