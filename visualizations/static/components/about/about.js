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
    topic_app.topic_app_topic.controller('AboutCtrl', AboutCtrl);
})(topic_app || (topic_app = {}));
//# sourceMappingURL=about.js.map