module topic_app {


    export class TopicService {

        public static $inject = [
            '$http',
            '$q'];

        public default_num_words = 10;

        public topics:Array<Topic> = null;

        public constructor(private $http:angular.IHttpService, private $q:angular.IQService) {


        }

        public getAllTopics() {
            var deferred = this.$q.defer();

            if (this.topics != null) {
                deferred.resolve(this.topics);
            } else {
                this.$http
                    .get('/api/topics', {
                        params: {
                            words_in_topic: this.default_num_words
                        }
                    }).success(function (result:any) {
                        deferred.resolve(result.res);
                    });
            }


            return deferred.promise;
        }

        public getTopicDetail(topic_id:number, words_in_topic:number) {
            return this.$http
                .get('/api/topic', {
                    params: {
                        words_in_topic: words_in_topic,
                        topic_id: topic_id
                    }
                });
        }


    }


    export class TopicsCtrl {
        public static $inject = ['TopicService'];

        public topics:Array<any> = [];

        constructor(TopicService) {

            TopicService.getAllTopics().then((result)=> {
                this.topics = result;
            });

        }

        public hoverIn(topic:Topic) {
            topic.active = true;
        }

        public hoverOut(topic:Topic) {
            topic.active = true;
        }


    }

    export var topic_app_topics = angular.module('topic_app.topics', ['ngRoute', 'ngAria']);




    topic_app_topics.service('TopicService',TopicService);

    topic_app_topics.controller('TopicsCtrl',TopicsCtrl);


    topic_app_topics.config(['$routeProvider', function ($routeProvider:angular.route.IRouteProvider) {
        $routeProvider.when('/topics', {
            templateUrl: 'static/topics/topics.html',
            controller: 'TopicsCtrl as vm'
        });
    }]);
}




