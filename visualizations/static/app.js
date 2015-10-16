/// <reference path="references.ts" />
var topic_app;
(function (topic_app_1) {
    var NavCtrl = (function () {
        function NavCtrl($mdSidenav, $location) {
            this.$mdSidenav = $mdSidenav;
            this.$location = $location;
            this.sections = [];
            this.sections = [
                { path: '/topics', title: 'Topics', tab_name: 'tab_topics' },
                { path: '/topic', title: 'Topic', tab_name: 'tab_topic' },
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
        'topic_app.about'
    ]);
    topic_app_1.topic_app.config(['$routeProvider', '$mdThemingProvider', '$mdIconProvider', function ($routeProvider, $mdThemingProvider, $mdIconProvider) {
            $mdIconProvider
                .icon("menu", "/static/svg/menu.svg", 24);
            // $routeProvider.otherwise({redirectTo: '/topics'});
        }]);
    topic_app_1.topic_app.controller('NavCtrl', NavCtrl);
})(topic_app || (topic_app = {}));
//# sourceMappingURL=app.js.map