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
    topic_app.topic_app_topic.controller('LdaVizCtrl', LdaVizCtrl);
})(topic_app || (topic_app = {}));
//# sourceMappingURL=pyldaviz.js.map