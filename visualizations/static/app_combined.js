/// <reference path="../../references.ts" />
var topic_app;
(function (topic_app) {
    var AboutCtrl = (function () {
        function AboutCtrl($http) {
            var _this = this;
            $http.get('/static/components/about/about.md').success(function (data) {
                _this.content = data;
            });
        }
        AboutCtrl.$inject = ['$http'];
        return AboutCtrl;
    })();
    topic_app.AboutCtrl = AboutCtrl;
    topic_app.topic_app_about = angular.module('topic_app.about', ['ngRoute']);
    topic_app.topic_app_about.config(['$routeProvider', function ($routeProvider) {
            $routeProvider.when('/about', {
                templateUrl: 'static/components/about/about.html',
                controller: 'AboutCtrl as vm'
            });
        }]);
    topic_app.topic_app_about.controller('AboutCtrl', AboutCtrl);
})(topic_app || (topic_app = {}));
/// <reference path="../../references.ts" />
var topic_app;
(function (topic_app) {
    var AnalyzeCtrl = (function () {
        function AnalyzeCtrl($routeParams, $http, SuperUserService, TopicService) {
            this.$routeParams = $routeParams;
            this.$http = $http;
            this.SuperUserService = SuperUserService;
            this.TopicService = TopicService;
        }
        AnalyzeCtrl.prototype.sampleQuestion = function () {
            var _this = this;
            this.strongestTopics = null;
            this.$http.get("/api/sample_doc").then(function (result) {
                var data = result.data;
                _this.question_id = data.id;
                _this.content = data.title + " \n\n" + data.body;
            });
        };
        AnalyzeCtrl.prototype.getTopics = function () {
            var _this = this;
            this.strongestTopics = null;
            this.$http.post('/api/analyze', { content: this.content }).then(function (result) {
                _this.strongestTopics = result.data.res;
            });
        };
        AnalyzeCtrl.prototype.questionIdChanged = function () {
            var _this = this;
            this.content = "";
            this.strongestTopics = [];
            if (angular.isDefined(this.question_id)) {
                this.SuperUserService.getSpecificPost(this.question_id).then(function (result) {
                    console.log(result);
                    _this.question_id = result.id;
                    _this.content = result.title + "\n\n" + result.body;
                });
            }
        };
        AnalyzeCtrl.$inject = ['$routeParams', '$http', 'SuperUserService', 'TopicService'];
        return AnalyzeCtrl;
    })();
    topic_app.AnalyzeCtrl = AnalyzeCtrl;
    topic_app.topic_app_analyze = angular.module('topic_app.analyze', []);
    topic_app.topic_app_analyze.config(['$routeProvider', function ($routeProvider) {
            $routeProvider.when('/analyze', {
                templateUrl: 'static/components/analyze/analyze.html',
                reloadOnSearch: false,
                controller: 'AnalyzeCtrl as vm'
            });
        }]);
    topic_app.topic_app_analyze.controller('AnalyzeCtrl', AnalyzeCtrl);
})(topic_app || (topic_app = {}));
/// <reference path="../../references.ts" />
var topic_app;
(function (topic_app) {
    var Section = (function () {
        function Section() {
        }
        return Section;
    })();
    topic_app.Section = Section;
    var Topic = (function () {
        function Topic() {
        }
        return Topic;
    })();
    topic_app.Topic = Topic;
    var Document = (function () {
        function Document() {
        }
        return Document;
    })();
    topic_app.Document = Document;
    var TopicDetail = (function () {
        function TopicDetail() {
        }
        return TopicDetail;
    })();
    topic_app.TopicDetail = TopicDetail;
    var Post = (function () {
        function Post() {
        }
        return Post;
    })();
    topic_app.Post = Post;
})(topic_app || (topic_app = {}));
/// <reference path="../../references.ts" />
var topic_app;
(function (topic_app) {
    var LdaVizCtrl = (function () {
        function LdaVizCtrl($http, $sce) {
            var _this = this;
            this.content = "cat";
            $http.get('static/components/pyldaviz/lda_viz.html').success(function (data) {
                _this.lda_content = $sce.trustAsHtml(data);
            });
        }
        LdaVizCtrl.$inject = ['$http', '$sce'];
        return LdaVizCtrl;
    })();
    topic_app.LdaVizCtrl = LdaVizCtrl;
    topic_app.topic_app_pyldaviz = angular.module('topic_app.pyldaviz', []);
    topic_app.topic_app_pyldaviz.config(['$routeProvider', function ($routeProvider) {
            $routeProvider.when('/topic_pca', {
                templateUrl: 'static/components/pyldaviz/pyldaviz.html',
                controller: 'LdaVizCtrl as vm'
            });
        }]);
    topic_app.topic_app_pyldaviz.controller('LdaVizCtrl', LdaVizCtrl);
})(topic_app || (topic_app = {}));
/// <reference path="../../references.ts" />
var topic_app;
(function (topic_app) {
    var TopicCtrl = (function () {
        function TopicCtrl($routeParams, $location, TopicService, SuperUserService) {
            var _this = this;
            this.$routeParams = $routeParams;
            this.$location = $location;
            this.TopicService = TopicService;
            this.SuperUserService = SuperUserService;
            this.topic = {};
            this.numberOfWords = 20;
            this.topics = null;
            this.chart_options = null;
            this.data_ready = false;
            this.selectedTopic = 0;
            this.strongest_docs = null;
            var topicId = parseInt($routeParams.topicId) || 0;
            TopicService.getAllTopics().then(function (result) {
                _this.topics = result;
                _this.topic = _this.topics[topicId];
                _this.selectedTopic = topicId;
                _this.updatePage();
            });
        }
        TopicCtrl.prototype.topicChanged = function () {
            this.$location.update_path("/topic/" + this.selectedTopic);
            this.updatePage();
        };
        TopicCtrl.prototype.updatePage = function () {
            var _this = this;
            this.topic = this.topics[this.selectedTopic];
            this.TopicService.getTopicDetail(this.selectedTopic, this.numberOfWords).then(function (result) {
                _this.topic = result;
                _this.createChart();
                _this.data_ready = true;
            });
            this.TopicService.getStrongestDocsForTopic(this.selectedTopic).then(function (result) {
                _this.strongest_docs = result.data.docs;
                for (var _i = 0, _a = _this.strongest_docs; _i < _a.length; _i++) {
                    var doc = _a[_i];
                    doc.url = _this.SuperUserService.getUrl(doc.id);
                }
            });
            this.$routeParams.topicId = this.selectedTopic;
        };
        TopicCtrl.prototype.createChart = function () {
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
                    "key": "words",
                    "color": "#1f77b4",
                    "values": this.topic.counts
                }
            ];
        };
        TopicCtrl.$inject = ['$routeParams', '$location', 'TopicService', 'SuperUserService'];
        return TopicCtrl;
    })();
    topic_app.TopicCtrl = TopicCtrl;
    topic_app.topic_app_topic = angular.module('topic_app.topic', ['ngRoute', 'angular-jqcloud', 'ngLocationUpdate', 'bgf.paginateAnything', 'angularUtils.directives.dirPagination']);
    topic_app.topic_app_topic.config(['$routeProvider', function ($routeProvider) {
            $routeProvider.when('/topic/:topicId?', {
                templateUrl: 'static/components/topic/topic.html',
                reloadOnSearch: false,
                controller: 'TopicCtrl as vm'
            });
        }]);
    topic_app.topic_app_topic.controller('TopicCtrl', TopicCtrl);
})(topic_app || (topic_app = {}));
/// <reference path="../../references.ts" />
var topic_app;
(function (topic_app) {
    var TopicService = (function () {
        function TopicService($http, $q) {
            this.$http = $http;
            this.$q = $q;
            this.default_num_words = 10;
            this.getAllTopics();
        }
        TopicService.prototype.allTopicsPromise = function () {
            return this.$http
                .get('/api/topics', {
                params: {
                    words_in_topic: this.default_num_words
                }
            });
        };
        TopicService.prototype.allTopicDescriptionsPromise = function () {
            return this.$http
                .get('/api/topic_descriptions');
        };
        TopicService.prototype.getAllTopics = function () {
            var _this = this;
            if (this.fetchedPromise) {
                return this.fetchedPromise;
            }
            var deferred = this.$q.defer();
            if (this.topics && this.topics.length > 0) {
                deferred.resolve(this.topics);
            }
            else {
                var combinedPromise = this.$q.all({
                    allTopics: this.allTopicsPromise(),
                    allTopicDescriptions: this.allTopicDescriptionsPromise()
                });
                combinedPromise.then(function (responses) {
                    _this.topics = responses.allTopics.data.res;
                    _this.topic_descriptions = responses.allTopicDescriptions.data.res;
                    for (var i = 0; i < _this.topics.length; i++) {
                        var t = _this.topics[i];
                        var td = _this.topic_descriptions[i];
                        t.name = td.name;
                        t.description = td.description;
                    }
                    deferred.resolve(_this.topics);
                });
            }
            this.fetchedPromise = deferred.promise;
            return deferred.promise;
        };
        TopicService.prototype.getTopicDetail = function (topic_id, words_in_topic) {
            var _this = this;
            var deferred = this.$q.defer();
            this.fetchedPromise.then(function (result) {
                if (!_this.topics) {
                    _this.topics = result;
                }
                var topics = result;
                _this.$http.get('/api/topic', {
                    params: {
                        words_in_topic: words_in_topic,
                        topic_id: topic_id
                    }
                }).success(function (result) {
                    var topic = result.res;
                    var t = topics[topic_id];
                    topic.name = t.name;
                    topic.description = t.description;
                    deferred.resolve(topic);
                }).error(function (result) {
                    var k = result;
                });
            });
            return deferred.promise;
        };
        TopicService.prototype.getStrongestDocsForTopic = function (topic_id) {
            return this.$http
                .get('/api/topic_docs', {
                params: {
                    topic_id: topic_id
                }
            });
        };
        TopicService.prototype.getTopicName = function (topic_id) {
            var _this = this;
            var deferred = this.$q.defer();
            this.fetchedPromise.then(function (result) {
                if (!angular.isDefined(_this.topics)) {
                    _this.topics = result;
                }
                var name = result[topic_id].name;
                deferred.resolve(name);
            });
            return deferred.promise;
        };
        TopicService.prototype.getTopicDescription = function (topic_id) {
            var _this = this;
            var deferred = this.$q.defer();
            var topic_id = topic_id || 0;
            if (this.topic_descriptions != null) {
                deferred.resolve(this.topic_descriptions[topic_id]);
            }
            else {
                this.$http
                    .get('/api/topic_descriptions', {}).success(function (result) {
                    _this.topic_descriptions = result.res;
                    deferred.resolve(_this.topic_descriptions);
                });
            }
            return deferred.promise;
        };
        TopicService.$inject = [
            '$http',
            '$q'];
        return TopicService;
    })();
    topic_app.TopicService = TopicService;
    var TopicsCtrl = (function () {
        function TopicsCtrl(TopicService) {
            var _this = this;
            this.topics = [];
            TopicService.getAllTopics().then(function (result) {
                _this.topics = result;
            });
        }
        TopicsCtrl.prototype.hoverIn = function (topic) {
            topic.active = true;
        };
        TopicsCtrl.prototype.hoverOut = function (topic) {
            topic.active = false;
        };
        TopicsCtrl.$inject = ['TopicService'];
        return TopicsCtrl;
    })();
    topic_app.TopicsCtrl = TopicsCtrl;
    topic_app.topic_app_topics = angular.module('topic_app.topics', ['ngRoute', 'ngAria']);
    topic_app.topic_app_topics.service('TopicService', TopicService);
    topic_app.topic_app_topics.controller('TopicsCtrl', TopicsCtrl);
    topic_app.topic_app_topics.config(['$routeProvider', function ($routeProvider) {
            $routeProvider.when('/topics', {
                templateUrl: 'static/components/topics/topics.html',
                controller: 'TopicsCtrl as vm'
            });
        }]);
})(topic_app || (topic_app = {}));
/// <reference path="references.ts" />
var topic_app;
(function (topic_app_1) {
    var SuperUserService = (function () {
        function SuperUserService($http, $q) {
            this.$http = $http;
            this.$q = $q;
        }
        SuperUserService.prototype.getUrl = function (post_id) {
            return "http://superuser.com/questions/" + post_id;
        };
        SuperUserService.prototype.getSamplePost = function () {
            var deferred = this.$q.defer();
            this.$http
                .get('/api/sample_doc')
                .then(function (result) {
                var topic = result.data;
                deferred.resolve(topic);
            });
            return deferred.promise;
        };
        SuperUserService.prototype.getSpecificPost = function (question_id) {
            var deferred = this.$q.defer();
            var url = "https://api.stackexchange.com/2.1/questions/" + question_id;
            this.$http.get(url, {
                params: {
                    site: "superuser",
                    filter: "withbody"
                }
            }).success(function (result) {
                var topic = result.items[0];
                if (!angular.isDefined(topic)) {
                    topic = {};
                    topic.body = "Invalid Question Id";
                    topic.title = "";
                }
                topic.id = question_id;
                deferred.resolve(topic);
            }).error(function (result) {
                var topic = {};
                topic.id = question_id;
                topic.body = "Invalid Request";
                deferred.resolve(topic);
            });
            return deferred.promise;
        };
        SuperUserService.$inject = ['$http', '$q'];
        return SuperUserService;
    })();
    topic_app_1.SuperUserService = SuperUserService;
    var NavCtrl = (function () {
        function NavCtrl($mdSidenav, $location) {
            this.$mdSidenav = $mdSidenav;
            this.$location = $location;
            this.sections = [];
            this.sections = [
                { path: '/topics', title: 'Topics', tab_name: 'tab_topics' },
                { path: '/topic', title: 'Topic', tab_name: 'tab_topic' },
                { path: '/topic_pca', title: 'Topic Pca', tab_name: 'tab_pca' },
                { path: '/analyze', title: 'Analyze', tab_name: 'tab_analyze' },
                { path: '/about', title: 'About', tab_name: 'tab_about' }
            ];
        }
        NavCtrl.prototype.toggleMenu = function () {
            this.$mdSidenav('left').toggle();
        };
        NavCtrl.prototype.isActive = function (item) {
            if (item.path == this.$location.path()) {
                return true;
            }
            return false;
        };
        NavCtrl.$inject = ['$mdSidenav', '$location'];
        return NavCtrl;
    })();
    topic_app_1.NavCtrl = NavCtrl;
    topic_app_1.topic_app = angular.module("topic_app", ['ngRoute',
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
    topic_app_1.topic_app.config(['$routeProvider', '$mdThemingProvider', '$mdIconProvider', function ($routeProvider, $mdThemingProvider, $mdIconProvider) {
            $mdThemingProvider.theme('default')
                .primaryPalette('brown')
                .accentPalette('red');
            ;
            $mdIconProvider
                .icon("menu", "/static/svg/menu.svg", 24);
            $routeProvider.otherwise({
                redirectTo: '/topics'
            });
            // $routeProvider.otherwise({redirectTo: '/topics'});
        }]);
    topic_app_1.topic_app.controller('NavCtrl', NavCtrl);
    topic_app_1.topic_app.service('SuperUserService', SuperUserService);
})(topic_app || (topic_app = {}));
/// <reference path="../typings/tsd.d.ts" />
//grunt-start
/// <reference path="components/about/about.ts" />
/// <reference path="components/analyze/analyze.ts" />
/// <reference path="components/main/models.ts" />
/// <reference path="components/pyldaviz/pyldaviz.ts" />
/// <reference path="components/topic/topic.ts" />
/// <reference path="components/topics/topics.ts" />
//grunt-end
/// <reference path="app.ts" /> 
//# sourceMappingURL=app_combined.js.map