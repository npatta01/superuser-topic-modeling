/// <reference path="../../references.ts" />

module topic_app {


    export class LdaVizCtrl {
        public static $inject = ['$http', '$sce'];

        public content:string;

        public lda_content:string;

        constructor($http:angular.IHttpService, $sce:angular.ISCEService) {
            this.content = "cat";

            $http.get('static/components/pyldaviz/lda_viz.html').success((data:any)=> {
                this.lda_content = $sce.trustAsHtml(data);


            });

        }

    }

    export var topic_app_pyldaviz = angular.module('topic_app.pyldaviz',
        []);


    topic_app_pyldaviz.config(['$routeProvider', function ($routeProvider:angular.route.IRouteProvider) {
        $routeProvider.when('/topic_pca', {
            templateUrl: 'static/components/pyldaviz/pyldaviz.html',
            controller: 'LdaVizCtrl as vm'
        });
    }]);


    topic_app_pyldaviz.controller('LdaVizCtrl', LdaVizCtrl);


}

