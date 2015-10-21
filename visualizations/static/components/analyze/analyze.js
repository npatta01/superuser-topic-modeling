/// <reference path="../../references.ts" />
var topic_app;
(function (topic_app) {
    var AnalyzeCtrl = (function () {
        function AnalyzeCtrl($routeParams, $http, SuperUserService) {
            this.$routeParams = $routeParams;
            this.$http = $http;
            this.SuperUserService = SuperUserService;
        }
        AnalyzeCtrl.prototype.fetchQuestion = function () {
            var _this = this;
            this.$http.get("/api/sample_doc").then(function (result) {
                var data = result.data.res;
                _this.question_id = data.id;
                _this.content = data.title + " \n\n" + data.body;
            });
        };
        AnalyzeCtrl.prototype.getTopics = function () {
            var _this = this;
            this.$http.post('/api/analyze', { content: this.content }).then(function (result) {
                _this.result = result.data.res;
            });
        };
        AnalyzeCtrl.$inject = ['$routeParams', '$http', 'SuperUserService'];
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
//# sourceMappingURL=analyze.js.map