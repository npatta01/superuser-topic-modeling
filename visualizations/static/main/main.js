'use strict';

angular.module('topic_app.main', [])


    .controller('MainController', ['$scope', '$routeParams', function ($scope, $routeParams) {

        $scope.dataReady = false;

        $scope.topic = null;

        $scope.numberOfWords = 10;

        TopicService.getAllTopics().then(function (result) {
            $scope.topics = result;
            var topicId=parseInt($routeParams.topicId);
            $scope.topic = $scope.topics[topicId] ;
            $scope.updatePage();

        });


        $scope.updatePage = function () {
            var that = this;


            that.createChart = function () {
                $scope.options = {
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
                $scope.data = [
                    {
                        "key": "words"
                        , "color": "#1f77b4"
                        , "values": $scope.topic.counts
                    }
                ];
            };

            TopicService.getTopicDetail($scope.topic.topic_id, $scope.numberOfWords).then(function (result) {
                $scope.topic = result.data.res;

                that.createChart();
            });
        };


    }]);