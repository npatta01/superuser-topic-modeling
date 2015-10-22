/// <reference path="../../references.ts" />
module topic_app {


    export class TopicService {

        public static $inject = [
            '$http',
            '$q'];

        public default_num_words = 10;

        public topics:Array<Topic>;

        public topic_descriptions:Array<TopicDetail>;

        private fetchedPromise:any;

        public constructor(private $http:angular.IHttpService, private $q:angular.IQService) {

            this.getAllTopics();
        }

        private allTopicsPromise() {
            return this.$http
                .get('/api/topics', {
                    params: {
                        words_in_topic: this.default_num_words
                    }
                });
        }

        private allTopicDescriptionsPromise() {
            return this.$http
                .get('/api/topic_descriptions');

        }

        public getAllTopics() {

            if (this.fetchedPromise) {
                return this.fetchedPromise;
            }

            var deferred = this.$q.defer();

            if (this.topics && this.topics.length > 0) {
                deferred.resolve(this.topics);
            } else {

                var combinedPromise = this.$q.all({
                    allTopics: this.allTopicsPromise(),
                    allTopicDescriptions: this.allTopicDescriptionsPromise()
                });

                combinedPromise.then((responses:any)=> {
                    this.topics = responses.allTopics.data.res;
                    this.topic_descriptions = responses.allTopicDescriptions.data.res;

                    for (var i = 0; i < this.topics.length; i++) {
                        var t = this.topics[i];
                        var td = this.topic_descriptions[i];

                        t.name = td.name;
                        t.description = td.description;


                    }


                    deferred.resolve(this.topics);

                });


            }

            this.fetchedPromise = deferred.promise;
            return deferred.promise;
        }

        public getTopicDetail(topic_id:number, words_in_topic:number) {

            var deferred = this.$q.defer();


            this.fetchedPromise.then((result:any)=> {
                if (!this.topics) {
                    this.topics = result;

                }

                var topics = result;

                this.$http.get('/api/topic', {
                    params: {
                        words_in_topic: words_in_topic,
                        topic_id: topic_id
                    }
                }).success((result:any)=> {
                    var topic:Topic = <Topic>result.res;
                    var t = topics[topic_id];
                    topic.name = t.name;
                    topic.description = t.description;

                    deferred.resolve(topic);
                }).error((result:any)=> {
                    var k = result;

                });


            });
            return deferred.promise;
        }


        public getStrongestDocsForTopic(topic_id:number) {
            return this.$http
                .get('/api/topic_docs', {
                    params: {
                        topic_id: topic_id
                    }
                });
        }


        public getTopicName(topic_id:number) {

            var deferred = this.$q.defer();


            this.fetchedPromise.then((result:any)=> {

                if (!angular.isDefined(this.topics)){
                    this.topics = result;
                }

                var name = result[topic_id].name;

                deferred.resolve(name);


            });
            return deferred.promise;


        }

        public getTopicDescription(topic_id:number) {
            var deferred = this.$q.defer();
            var topic_id = topic_id || 0;

            if (this.topic_descriptions != null) {
                deferred.resolve(this.topic_descriptions[topic_id]);
            } else {
                this.$http
                    .get('/api/topic_descriptions', {}
                ).success((result:any)=> {
                        this.topic_descriptions = result.res;
                        deferred.resolve(this.topic_descriptions);
                    });
            }


            return deferred.promise;
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
            topic.active = false;
        }


    }

    export var topic_app_topics = angular.module('topic_app.topics', ['ngRoute', 'ngAria']);


    topic_app_topics.service('TopicService', TopicService);

    topic_app_topics.controller('TopicsCtrl', TopicsCtrl);


    topic_app_topics.config(['$routeProvider', function ($routeProvider:angular.route.IRouteProvider) {
        $routeProvider.when('/topics', {
            templateUrl: 'static/components/topics/topics.html',
            controller: 'TopicsCtrl as vm'
        });
    }]);
}




