var projectApp = angular.module("projectApp", ["ui.router", "LocalStorageModule", "angularUtils.directives.dirPagination"]);

OAuth.initialize('EOOZvyRx3tiLJtpgEHLDT15rvk0');

projectApp.config(function (localStorageServiceProvider) {
  localStorageServiceProvider
    .setPrefix("projectApp")
    .setStorageType("localStorage")
    .setNotify(true, true)
});

projectApp.config(["$urlRouterProvider", "$stateProvider", function ($urlRouterProvider, $stateProvider) {
	$stateProvider
	
	.state("home",{
		url: "/",
		templateUrl:"templates/homepage.html",
		controller:"mainCtrl"
	})

	.state("home.sendPlaylist",{
		url: "/sendPlaylist",
		templateUrl:"templates/sendPlaylist.html",
		controller:"mainCtrl"
	})

	.state("home.localPlaylist",{
		url: "/localPlaylist",
		templateUrl:"templates/localPlaylist.html",
		controller:"mainCtrl"
	})

	.state("home.getPlaylist",{
		url: "/getPlaylist",
		templateUrl:"templates/getPlaylist.html",
		controller:"mainCtrl"
	})

	.state("home.getPlaylist.tracks",{
		url: "/getPlaylistTracks",
		templateUrl:"templates/getPlaylistTracks.html",
		controller:"mainCtrl"
	})


	$urlRouterProvider.otherwise("/");
	
}]);

projectApp.service("mainService", ["localStorageService", function (localStorageService) {

	this.saveLocalPlaylist = function (localPlaylist){
		localStorageService.set("localPlaylist", localPlaylist);
	};

	this.clearLocalPlaylist = function () {
		localStorageService.clearAll();
	}

}]);

projectApp.controller("mainCtrl", ["$scope", "$http", "localStorageService", "mainService", function ($scope, $http, localStorageService, mainService) {
	$scope.localPlaylist = localStorageService.get("localPlaylist") || [];
	

/***********************Login to Spotify***********************/
	$scope.login = function () {
		OAuth.popup('spotify').done(function(result) {
			$scope.token = result.access_token;
			result.me().done(function(data){
				$scope.user = data.id;
				$scope.loggedIn = true;
				$scope.$apply();
			})
		})
	};

/******************Search tracks based on user query******************/
// When I try to do this with an ajax call I can't show the results in the view. 
// Am I missing something?

	$scope.searchTracks = function () {
		$http.get("https://api.spotify.com/v1/search?q=" + $scope.trackSearch + "&type=track&limit=30")
		.then(function(response){
			$scope.searchResponse = response.data.tracks.items;
		})

	/*$.ajax({
			url: "https://api.spotify.com/v1/search?q=" + $scope.trackSearch + "&type=track&limit=30",
			success: function(data){
				$scope.searchResponse = data.tracks.items;
				console.log($scope.searchResponse)
			}
		});*/
	};



/******************Local playlist******************/
	$scope.addToLocalPlaylist = function (track) {
		if (track) {
			$scope.localPlaylist.push(track);
			mainService.saveLocalPlaylist($scope.localPlaylist);
		}
	};

	$scope.removeFromLocalPlaylist = function (index) {
		$scope.localPlaylist.splice(index, 1);
		console.log($scope.localPlaylist);
		mainService.saveLocalPlaylist($scope.localPlaylist);
	};


/******************Send playlist to Spotify******************/
	$scope.sendPlaylist = function () {
		var playlistID = "";
		var uris = [];

		for (var index = 0; index < $scope.localPlaylist.length; index++) {
			uris.push($scope.localPlaylist[index].uri);
		}

		$.ajax({
			url: "https://api.spotify.com/v1/users/" + $scope.user + "/playlists",
			headers: {
				"Authorization": "Bearer " + $scope.token,
				"Content-Type": "application/json" 
			},
			data: JSON.stringify({
				"name": $scope.newPlaylist,
			}),
			dataType:"json",
			type: "post",
			success: function (data) {
				playlistID = data.id;
				$.ajax({
					url: "https://api.spotify.com/v1/users/" + $scope.user + "/playlists/" + playlistID + "/tracks",
					headers: {
						"Authorization": "Bearer " + $scope.token,
						"Content-Type": "application/json" 
					},
					data: JSON.stringify({
						"uris": uris,
					}),
					dataType:"json",
					type: "post",
					success: function () {
						mainService.clearLocalPlaylist();
					},
					error: function () {
						console.log("Tracks failed");
					}			
				});
			},
			error: function () {
				console.log("Playlist failed");
			}
		})	
	};

/******************Get playlists from Spotify*****************/	
// Same as in searchTracks
	$scope.getPlaylists = function () {
		$http({
			method: "GET",
			url: "https://api.spotify.com/v1/users/" + $scope.user + "/playlists",
			headers: {
				"Authorization": "Bearer " + $scope.token,
				"Content-Type": "application/json" 
			},
			dataType:"json",
		}).then(function(response){
			$scope.userPlaylists = response.data.items;
			console.log($scope.userPlaylists);
		});

		/*$.ajax({
			url: "https://api.spotify.com/v1/users/" + $scope.user + "/playlists",
			headers: {
				"Authorization": "Bearer " + $scope.token,
				"Content-Type": "application/json" 
			},
			dataType:"json",
			type: "get",
			success: function (data){
				console.log(data);
				$scope.userPlaylists = data.items;
				console.log($scope.userPlaylists[1].name);
			}
		});*/
	};

/******************Get playlists from Spotify*****************/	
//Not getting the tracks from Spotify, only an href and the total
	$scope.getPlaylistTracks = function (index) {
		$scope.selectedPlaylist = $scope.userPlaylists[index].tracks;
		console.log($scope.selectedPlaylist);
	};

}]);
