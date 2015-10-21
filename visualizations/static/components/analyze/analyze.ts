/// <reference path="../../references.ts" />

module topic_app {


    export class AnalyzeCtrl {
        public static $inject = ['$routeParams', '$http', 'SuperUserService'];


        private question_id:number;
        public content:string;
        public result:string;

        constructor(private $routeParams:any
            , private $http:angular.IHttpService
            , private SuperUserService:SuperUserService) {


        }


        public fetchQuestion() {
            this.$http.get("/api/sample_doc").then((result:any)=> {
                var data:Post = result.data.res;
                this.question_id = data.id;
                this.content = data.title + " \n\n" + data.body
            });
        }

        public getTopics() {


            this.$http.post('/api/analyze', {content: this.content}).then((result:any)=> {
                this.result = result.data.res;
            });
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

