var mainApp = angular.module("mainApp", ['ngRoute']);
         mainApp.config(['$routeProvider', function($routeProvider) {
            $routeProvider.
            
            /*when('/addStudent/:guitarID/:testID', {
               templateUrl: 'addStudent.htm',
               controller: 'AddStudentController'
            }).*/

            when('/lane/:laneID', {
               templateUrl: 'view/lane.html',
               controller: 'LaneController'
            }).
            
            /*when('/viewStudents', {
               templateUrl: 'view/viewStudents.html',
               controller: 'ViewStudentsController'
            }).*/
            
            otherwise({
               redirectTo: '/'
            });
         }]);
         
         