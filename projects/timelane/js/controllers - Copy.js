/*mainApp.controller('AddStudentController', function($scope,$routeParams) {
	$scope.message = "This page will be used to display add student form";
	console.log($routeParams.guitarID);
	console.log($routeParams.testID);
});

mainApp.controller('ViewStudentsController', function($scope) {
	$scope.message = "This page will be used to display all the students";
});*/

mainApp.controller('LaneController', ['$scope', '$rootScope','$routeParams', '$filter',
	function LaneController($scope, $rootScope, $routeParams,$filter){
		$rootScope.single_lane = false;
		$scope.id = $routeParams.laneID;

		/*$rootScope.$on('$locationChangeSuccess', function (next, last) {
		   console.log($rootScope.userId);
		});*/

		$scope.date = new Date();
		
		$scope.getLaneInfo = function(userId, laneID){
			return firebase.database().ref('/users/' + userId + '/lanes/'+laneID).once('value').then(function(snapshot) {
				
				$scope.$apply(function(){
					$scope.laneName = snapshot.val().lane_name;
					$scope.laneImgUrl = snapshot.val().img_url;
			  	});
			});
			// alert($scope.laneName+$scope.laneImgUrl);

		}

		$scope.getEvents = function(userId, laneID){
			$scope.eventsInfo = [];
			return firebase.database().ref('/users/' + userId+ '/lanes/'+laneID+'/events').once('value').then(function(snapshot) {
				// console.log(snapshot.val());
				var obj = snapshot.val();
				
				var tempEventsInfo = [];

				snapshot.forEach(function(childSnapshot) {
					var childData = childSnapshot.val();
					var eventObj = {};
					eventObj.day_date = childData.day_date;
					eventObj.day_name = childData.day_name;
					eventObj.month_name = childData.month_name;
					var events = childData.event_on_this_day;
					// console.log(events);
					var tempEvents = [];
					childSnapshot.child("event_on_this_day").forEach(function(event_on_this_day){
						// console.log(event_on_this_day.val());
						var eventChildData = event_on_this_day.val();
						tempEvents.push(eventChildData);
					});

					eventObj.events = tempEvents;

					tempEventsInfo.push(eventObj);

					// console.log(eventObj.events[0].eventdesc);
				});
				$scope.$apply(function(){
					$scope.eventsInfo = tempEventsInfo;
			  	});
				console.log($scope.eventsInfo);
				// console.log(tempEventsInfo);
			});
		}

		/*$scope.testDate = function(){
			console.log($scope.date.getTime());
			console.log($scope.date.getDay());
			console.log($scope.date.getDate());
			console.log($scope.event.title);
			console.log($scope.event.description);
		}*/

		$scope.createEvent = function(){
			// alert($scope.event_title);
			console.log($filter('date')($scope.date, "yyyy-MM-dd-EEEE"));
			var dateKey = $filter('date')($scope.date, "yyyy-MM-dd");

			var day_date = $filter('date')($scope.date, "dd");
			var day_name = $filter('date')($scope.date, "EEEE");
			var month_name = $filter('date')($scope.date, "MMM");
			
			var sameDayEventKey = firebase.database().ref().child('events').push().key;
			
			
		
			firebase.database().ref('/users/' + $rootScope.userId+ '/lanes/'+$routeParams.laneID+'/events/'+dateKey).once('value').then(function(snapshot) {
				if (snapshot.val()==null) {
					// alert();
					firebase.database().ref('/users/' + $rootScope.userId+ '/lanes/'+$routeParams.laneID+'/events/'+dateKey).set({
					    day_date: day_date,
					    day_name : day_name,
					    month_name: month_name
					});
				}

				firebase.database().ref('/users/' + $rootScope.userId+ '/lanes/'+$routeParams.laneID+'/events/'+dateKey+'/event_on_this_day/'+sameDayEventKey).set({
				    eventdesc: $scope.event_desc,
				    eventname : $scope.event_title
				});	
				// var userKeys = Object.keys(snapshot.val());
				// console.log(userKeys.length+userKeys);
				/*if(userKeys.length==0){
					aiert();
					setTimeout(function(){
						console.log('set');
						firebase.database().ref('/users/' + $rootScope.userId+ '/lanes/'+$routeParams.laneID+'/events/'+dateKey).set({
						    day_date: day_date,
						    day_name : day_name,
						    month_name: month_name
						});
					},3000);
				}*/
			});

			/*firebase.database().ref('/users/' + $rootScope.userId+ '/lanes/'+$routeParams.laneID+'/events/'+dateKey).set({
			    day_date: day_date,
			    day_name : day_name,
			    month_name: month_name
			});

			firebase.database().ref('/users/' + $rootScope.userId+ '/lanes/'+$routeParams.laneID+'/events/'+dateKey+'/event_on_this_day/'+sameDayEventKey).set({
			    eventdesc: "desc",
			    eventname : "name"
			});*/

			setTimeout(function(){ 
				$scope.getEvents($rootScope.userId,$routeParams.laneID);
			}, 2000);

		}

		if($routeParams){

			$scope.getLaneInfo($rootScope.userId,$routeParams.laneID);
			$scope.getEvents($rootScope.userId,$routeParams.laneID);
		}

		
}]);

mainApp.controller('LoginCtrl', ['$scope', '$rootScope',
	function LoginCtrl($scope, $rootScope) {
		// $scope.lane_title = "";
		var email;

		$scope.test = "";
		// $scope.hide_lane = true;
	    $scope.userExists = false;

		checkUser = function(email){
			// alert();
			
			firebase.database().ref('/users').once('value').then(function(snapshot) {
			  	console.log(snapshot.val());
			  	snapshot.forEach(function(childSnapshot) {
					var childData = childSnapshot.val();
					
					if(childData.email == email){

						$scope.getLanes(email);
						
						$scope.$apply(function(){
							$scope.userExists = true;
					  	});
					}
			    });
			    if(!$scope.userExists){
			    	console.log("user"+$scope.userExists);
			    	createAccount(email);
				}
			});
			
		}

		createAccount = function(email){
			$rootScope.userId = firebase.database().ref().child('users').push().key;
			firebase.database().ref('/users/' + $rootScope.userId).set({
			    email: email
			});
		}

	    $scope.signIn = function(){

	    	var provider = new firebase.auth.GoogleAuthProvider();
		
			firebase.auth().signInWithPopup(provider).then(function(result) {
				// This gives you a Google Access Token. You can use it to access the Google API.
				var token = result.credential.accessToken;
				// The signed-in user info.
				var user = result.user;

				$scope.userName = user.displayName;
				$scope.userImgUrl = user.photoURL;

				console.log(user);

				email = user.email;
				
				$scope.signedIn = true;

				checkUser(email);
				// $scope.lanes = LoginService.getUserLanes(user.email);
				// $scope.getLanes(email);
				// ...
			}).catch(function(error) {
				$scope.signedIn = false;
				// Handle Errors here.
				var errorCode = error.code;
				var errorMessage = error.message;
				// The email of the user's account used.
				// var email = error.email;
				// The firebase.auth.AuthCredential type that was used.
				var credential = error.credential;
				// ...
			});
		    // $scope.users = LoginService.sign();
	    }

	    
	    $scope.userLanes = [{
	    						laneId:"fdazzass",
	    						img_url:"img_url.jpg",
	    						lane_name:"per"
							}];
		// $rootScope.userId = "ff";
	    $scope.getLanes = function(email){
	    	return firebase.database().ref('/users').once('value').then(function(snapshot) {
				var obj = snapshot.val();
				var count = 0;
				var tempLanes = [];
				// console.log(Object.keys(snapshot.val()));
				var userKeys = Object.keys(snapshot.val());
				snapshot.forEach(function(childSnapshot) {
			      var childData = childSnapshot.val();

			      if (email==childData.email) {

			      	$rootScope.userId = userKeys[count];
					var keys = Object.keys(childData.lanes);
					// console.log(keys);
					for (var i = 0; i < keys.length; i++) {
						var laneObj = {};
						laneObj.laneId = keys[i];
						laneObj.img_url = childData['lanes'][keys[i]]['img_url'];
						laneObj.lane_name = childData['lanes'][keys[i]]['lane_name'];
						// console.log(laneObj);
						tempLanes.push(laneObj);
					}
					$scope.$apply(function(){
				  		$scope.userLanes = tempLanes;
				  	});
					console.log(tempLanes);

					
			      }
			      count++;
					
			    });
			    console.log($rootScope.userId);

			});
			
			
	    }

	    $scope.hidelanes = function(){
			$scope.hide_lanes = true;
	    }



	    $scope.createLane = function(lane_title,lane_imgUrl){
	    	// alert(lane_title+lane_imgUrl);
	    	var laneKey = firebase.database().ref().child('lanes').push().key;
	    	firebase.database().ref('users/' + $rootScope.userId + '/lanes/' + laneKey).set({
			    lane_name: lane_title,
			    img_url: lane_imgUrl
			});

			setTimeout(function(){ 
				$scope.getLanes(email);
			}, 2000);
	    }

}]);