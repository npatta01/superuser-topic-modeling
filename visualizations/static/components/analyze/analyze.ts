/// <reference path="../../references.ts" />

module topic_app {


    export class AnalyzeCtrl {
        public static $inject = ['$routeParams', '$http', 'SuperUserService', 'TopicService'];


        private question_id:number;
        public content:string;
        public result:string;

        public strongestTopics:Array<any>;

        constructor(private $routeParams:any
            , private $http:angular.IHttpService
            , private SuperUserService:SuperUserService
            , private TopicService:TopicService) {


        }


        public sampleQuestion() {
            this.strongestTopics = null;
            this.$http.get("/api/sample_doc").then((result:any)=> {
                var data:Post = result.data;
                this.question_id = data.id;
                this.content = data.title + " \n\n" + data.body
            });
        }

        public getTopics() {

            this.strongestTopics = null;
            this.$http.post('/api/analyze', {content: this.content}).then((result:any)=> {
                this.strongestTopics = result.data.res;

            });
        }

        public questionIdChanged() {

            this.content = "";

            this.strongestTopics = [];
            if (angular.isDefined(this.question_id)) {
                this.SuperUserService.getSpecificPost(this.question_id).then((result:Post)=> {
                    console.log(result);
                    this.question_id = result.id;
                    this.content = result.title + "\n\n" + result.body;


                });
            }


        }


    }

    export var topic_app_analyze = angular.module('topic_app.analyze',
        []);


    topic_app_analyze.config(['$routeProvider', function ($routeProvider:angular.route.IRouteProvider) {
        $routeProvider.when('/analyze', {
            templateUrl: 'static/components/analyze/analyze.html',
            reloadOnSearch: false,
            controller: 'AnalyzeCtrl as vm'
        });
    }]);


    topic_app_analyze.controller('AnalyzeCtrl', AnalyzeCtrl);


}

