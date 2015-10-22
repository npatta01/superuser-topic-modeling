/// <reference path="../../references.ts" />

module topic_app {


    export class AboutCtrl {
        public static $inject = ['$http'];

        public content:string;

        constructor($http:angular.IHttpService) {

            $http.get('/static/components/about/about.md').success((data:any)=> {
                this.content = data;
            });



        }


    }


    export var topic_app_about = angular.module('topic_app.about',
        ['ngRoute']);


    topic_app_about.config(['$routeProvider', function ($routeProvider:angular.route.IRouteProvider) {
        $routeProvider.when('/about', {
            templateUrl: 'static/components/about/about.html',
            controller: 'AboutCtrl as vm'
        });
    }]);


    topic_app_about.controller('AboutCtrl', AboutCtrl);


}

