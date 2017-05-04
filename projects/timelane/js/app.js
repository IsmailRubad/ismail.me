var mainApp = angular.module("mainApp", ['ngRoute']);
mainApp.config(['$routeProvider', function($routeProvider) {
   
   $routeProvider.

   when('/lane/:laneID', {
      templateUrl: 'view/lane.html',
      controller: 'LaneController'
   }).
   
   otherwise({
      redirectTo: '/'
   });

}]);
         
         