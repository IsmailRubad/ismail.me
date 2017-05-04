mainApp.controller('LoginCtrl', ['$scope', '$rootScope',
	function LoginCtrl($scope, $rootScope) {
		
		var email;
	    
	    $scope.userExists = false;

		checkUser = function(email){

			firebase.database().ref('/users').once('value').then(function(snapshot) {
			  	
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

		if(sessionStorage.email){

			$scope.userName = sessionStorage.userName;
	
			$scope.userImgUrl = sessionStorage.userImgUrl;

			email = sessionStorage.email;

			checkUser(email);

			$scope.signedIn = true;
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

				email = user.email;

				if(typeof(Storage) !== "undefined") {
			        
		            sessionStorage.userName = $scope.userName;
		            sessionStorage.userImgUrl = $scope.userImgUrl;
		            sessionStorage.email = email;

			    } else {

			    }
				
				$scope.signedIn = true;

				checkUser(email);

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
	    }
	    
	    $scope.userLanes = [];

	    $scope.getLanes = function(email){

	    	return firebase.database().ref('/users').once('value').then(function(snapshot) {
		
				var obj = snapshot.val();
		
				var count = 0;
		
				var tempLanes = [];
				
				var userKeys = Object.keys(snapshot.val());
				
				snapshot.forEach(function(childSnapshot) {
			    
					var childData = childSnapshot.val();

					if (email==childData.email) {

						$rootScope.userId = userKeys[count];

						if(childData.lanes===undefined) return;

						var keys = Object.keys(childData.lanes);

						for (var i = 0; i < keys.length; i++) {
							
							var laneObj = {};
							
							laneObj.laneId = keys[i];
							
							laneObj.img_url = childData['lanes'][keys[i]]['img_url'];
							
							laneObj.lane_name = childData['lanes'][keys[i]]['lane_name'];

							tempLanes.push(laneObj);
						}

						$scope.$apply(function(){
							$scope.userLanes = tempLanes;
						});
					}

					count++;
					
			    });

			});			
	    }

	    $scope.hidelanes = function(){
			$scope.hide_lanes = true;
	    }

	    $scope.createLane = function(lane_title,lane_imgUrl){
	    	
	    	if(lane_title === undefined || lane_title === ""){
	    		alert("Enter a lane name");
	    		return;
	    	}

	    	if(lane_imgUrl === undefined){
	    		lane_imgUrl = "";
	    	}

	    	console.log(lane_title);

	    	var laneKey = firebase.database().ref().child('lanes').push().key;
	    	
	    	firebase.database().ref('users/' + $rootScope.userId + '/lanes/' + laneKey).set({
			    lane_name: lane_title,
			    img_url: lane_imgUrl
			});

			setTimeout(function(){ 
				$scope.getLanes(email);
			}, 2000);
	    }

	    $rootScope.signOut = function(){
	    	firebase.auth().signOut().then(function() {
	    		
	    		sessionStorage.clear();
	    		
	    		var base_url = window.location.origin+"/ismail.me/projects/timelane";
	    		
	    		window.location = base_url;
			
			}).catch(function(error) {
			  // An error happened.
			});
	    }
}]);


mainApp.controller('LaneController', ['$scope', '$rootScope','$routeParams', '$filter',
	function LaneController($scope, $rootScope, $routeParams,$filter){
		
		$rootScope.single_lane = false;
		
		$scope.id = $routeParams.laneID;

		$scope.date = new Date();
		
		$scope.getLaneInfo = function(userId, laneID){
			
			return firebase.database().ref('/users/' + userId + '/lanes/'+laneID).once('value').then(function(snapshot) {
				
				$scope.$apply(function(){
					$scope.laneName = snapshot.val().lane_name;
					$scope.laneImgUrl = snapshot.val().img_url;
			  	});
			});
		}

		$scope.getEvents = function(userId, laneID){

			$scope.eventsInfo = [];
			
			return firebase.database().ref('/users/' + userId+ '/lanes/'+laneID+'/events').once('value').then(function(snapshot) {

				var obj = snapshot.val();
				
				var tempEventsInfo = [];

				snapshot.forEach(function(childSnapshot) {
					
					var childData = childSnapshot.val();
					
					var eventObj = {};
					
					eventObj.day_date = childData.day_date;
					
					eventObj.day_name = childData.day_name;
					
					eventObj.month_name = childData.month_name;
					
					var events = childData.event_on_this_day;
					
					var tempEvents = [];
					
					childSnapshot.child("event_on_this_day").forEach(function(event_on_this_day){
						
						var eventChildData = event_on_this_day.val();
						
						tempEvents.push(eventChildData);
					});

					eventObj.events = tempEvents;

					tempEventsInfo.push(eventObj);

				});
				
				$scope.$apply(function(){
					$scope.eventsInfo = tempEventsInfo;
			  	});

			});
		}

		$scope.createEvent = function(){

			if($scope.event_title === undefined || $scope.event_title === ""){
	    		alert("Enter an event name");
	    		return;
	    	}

	    	if($scope.event_desc === undefined){
	    		$scope.event_desc = "Details not added!";
	    	}

			var dateKey = $filter('date')($scope.date, "yyyy-MM-dd");

			var day_date = $filter('date')($scope.date, "dd");
			
			var day_name = $filter('date')($scope.date, "EEEE");
			
			var month_name = $filter('date')($scope.date, "MMM");
			
			var sameDayEventKey = firebase.database().ref().child('events').push().key;
		
			firebase.database().ref('/users/' + $rootScope.userId+ '/lanes/'+$routeParams.laneID+'/events/'+dateKey).once('value').then(function(snapshot) {
				
				if (snapshot.val()==null) {
					
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
				
			});

			setTimeout(function(){ 
				$scope.getEvents($rootScope.userId,$routeParams.laneID);
			}, 2000);

		}

		if($routeParams){

			$scope.getLaneInfo($rootScope.userId,$routeParams.laneID);
			$scope.getEvents($rootScope.userId,$routeParams.laneID);
		}
		
}]);
