'use strict';

angular.module('myApp.view2', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view2', {
    templateUrl: 'view2/view2.html',
    controller: 'View2Ctrl'
  });
}])

.controller('View2Ctrl', ['$scope', '$http', '$log', '$interval', function($scope, $http, $log, $interval) {

        $scope.updateList = function(){
            $log.log("Updating list");
            $scope.updating=true;
            $http.get("http://funchat-api.herokuapp.com/messages")
                .success(function(data, status, headers, config) {
                    $scope.messages = data;
                    $scope.updating=false;
                })
                .error(function(data, status, headers, config) {
                    $scope.error = 'ERROR ' + status;
                    $scope.updating=false;
                });
        }
        $scope.updateList();
        $interval($scope.updateList, 500);

        // This is the message to edit
        $scope.message={"content": "", "author": 'Antti Koivisto'};

        $scope.clearMessage = function(){
            $log.log("Clearing message from " + angular.toJson( $scope.message));
            $scope.message = {"content": "", "author": 'Antti Koivisto'};
            $log.log("to " + angular.toJson( $scope.message));
        }

        $scope.remove = function(message){
            $log.log("Would remove " + angular.toJson(message));
            $http.delete("http://funchat-api.herokuapp.com/messages/" +message._id)
        };

        $scope.edit = function(message){
            $log.log("Would edit " + angular.toJson(message));
            $scope.message = message;
        };


}])
    .controller('ChatFormController', ['$scope', '$http', '$log', function($scope, $http, $log) {

        $scope.cancel= function() {
            $scope.$parent.clearMessage();
        };

        $scope.submit = function() {
            $log.log("About to post " + angular.toJson($scope.message));
            $http({
                "method":determineMethod($scope.message),

                "url":constructUrl($scope.message),
                "data": constructData($scope.message)
            })
            .success(function (data, status, headers, config) {
                    $log.log("Success: " + angular.toJson(data));
                    $scope.$parent.clearMessage();
                    $scope.$parent.updateList();
                })
            .error(function (data, status, headers, config) {
                    $scope.$parent.error = 'ERROR ' + status;
                });
        };

        var determineMethod = function(message){
            if(message._id){
                $log.log("PUT");
                return 'PUT';
            }else{
                $log.log("POST");
                return 'POST';
            }
        }

        var constructUrl =  function (message) {
            if(message._id){
                return 'http://funchat-api.herokuapp.com/messages/' + message._id;
            }else{
                $log.log("POST");
                return 'http://funchat-api.herokuapp.com/messages   ';
            }

        }

        var constructData =  function (message) {
            var m = undefined;
            if(message._id){
                m =  {"content":message.content, "author":message.author};
            }else{
                m =  message;
            }
            $log.log("Constructed data: " + angular.toJson(m));

            return m;

        }


    }]);
