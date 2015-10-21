/// <reference path="references.ts" />


module topic_app {


    export class SuperUserService{
        public static $inject = ['$http','$q'];
        constructor(private $http:angular.IHttpService,private $q:angular.IQService){

        }

        public getUrl(post_id:number){
            return "http://superuser.com/questions/"+post_id
        }


        public getRandomPost(){

            var deferred = this.$q.defer();


            this.$http
                .get('/api/sample_doc' )


                .then((result)=> {
                    var topic:Post = <Post>result.data;

                    deferred.resolve(topic);
                });

            return deferred.promise;

        }


    }


    export class NavCtrl {
        public static $inject = ['$mdSidenav', '$location'];

        public sections:Array<Section> = [];

        constructor(private $mdSidenav:angular.material.ISidenavService
            , private $location:angular.ILocationService) {

            this.sections = [
                {path: '/topics', title: 'Topics', tab_name: 'tab_topics'},
                {path: '/topic', title: 'Topic', tab_name: 'tab_topic'},
                {path: '/topic_pca', title: 'Topic Pca', tab_name: 'tab_pca'},
                {path: '/analyze', title: 'Analyze', tab_name: 'tab_analyze'},

                {path: '/about', title: 'About', tab_name: 'tab_about'}

            ];


        }

        public toggleMenu(){
            this.$mdSidenav('left').toggle();
        }

        public isActive(item:any){
            if (item.path == this.$location.path()) {
                return true;
            }
            return false;
        }

    }


    export var topic_app = angular.module("topic_app", ['ngRoute',
        'nvd3',
        'ngMaterial',
        'angular-loading-bar',
        'hc.marked',
        'ngAnimate',
        'topic_app.topics',
        'topic_app.topic',
        'topic_app.pyldaviz',
        'topic_app.analyze',
        'topic_app.about'
    ]);


    topic_app.config(['$routeProvider', '$mdThemingProvider', '$mdIconProvider', function ($routeProvider:angular.route.IRouteProvider, $mdThemingProvider:angular.material.IThemingProvider, $mdIconProvider:angular.material.IIconProvider) {


        $mdIconProvider
            .icon("menu", "/static/svg/menu.svg", 24);


        // $routeProvider.otherwise({redirectTo: '/topics'});
    }]);

    topic_app.controller('NavCtrl',NavCtrl);

    topic_app.service('SuperUserService',SuperUserService);
    //var _topic_app_topic=topic_app_topic;

    //var _topic_app_topics=topic_app_topics;


}
