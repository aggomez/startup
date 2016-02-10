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

	.state("home.localPlaylist",{
		url: "/localPlaylist",
		templateUrl:"templates/localPlaylist.html",
		controller:"mainCtrl"
	})

	.state("home.sendPlaylist",{
		url: "/sendPlaylist",
		templateUrl:"templates/sendPlaylist.html",
		controller:"sendPlaylistCtrl"
	})

	.state("home.getPlaylist",{
		url: "/getPlaylist",
		templateUrl:"templates/getPlaylist.html",
		controller:"getPlaylistCtrl"
	})

	.state("home.getPlaylist.tracks",{
		url: "/getPlaylistTracks",
		templateUrl:"templates/getPlaylistTracks.html",
		controller:"getPlaylistCtrl"
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
	if ($scope.localPlaylist[0]) {
		$scope.localData = true;
	}

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
	$scope.searchTracks = function () {
		$http.get("https://api.spotify.com/v1/search?q=" + $scope.trackSearch + "&type=track&limit=30")
		.then(function(response){
			$scope.searchResponse = response.data.tracks.items;
			$scope.searchDone= true;
		})
	};

/******************Local playlist******************/
	$scope.addToLocalPlaylist = function (track) {
		if (track) {
			$scope.localPlaylist.push(track);
			mainService.saveLocalPlaylist($scope.localPlaylist);
		}
		if ($scope.localPlaylist[0]) {
			$scope.localData = true;
		}
	};

	$scope.removeFromLocalPlaylist = function (track) {
		for (var index = 0; index < $scope.localPlaylist.length; index++) {
			if (track === $scope.localPlaylist[index]) {
				$scope.localPlaylist.splice(index, 1);
				mainService.saveLocalPlaylist($scope.localPlaylist);
				if (!$scope.localPlaylist[0]) {
					$scope.localData = false;
				}
			}
		}
	};

}]);

projectApp.controller("sendPlaylistCtrl", ["$scope", "localStorageService", "mainService", function ($scope, localStorageService, mainService) {
	$scope.localPlaylist = localStorageService.get("localPlaylist") || [];
	if ($scope.localPlaylist[0]) {
		$scope.localData = true;
	}

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
						$scope.localData = false;
						$scope.$apply();
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
}]);

projectApp.controller("getPlaylistCtrl", ["$scope", "$http", function ($scope, $http) {

/******************Get playlists from Spotify*****************/	
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
			$scope.playlistData = true;
		});
	};

/******************Get playlists from Spotify*****************/	
	$scope.getPlaylistTracks = function (playlist) {
		for (var index = 0; index < $scope.userPlaylists.length; index++) {
			if (playlist === $scope.userPlaylists[index]){
				$scope.selectedPlaylistName = $scope.userPlaylists[index].name;
				$scope.selectedPlaylist = $scope.userPlaylists[index].tracks;
			}
		}
		$http({
			method: "GET",
			url: $scope.selectedPlaylist.href,
			headers: {
				"Authorization": "Bearer " + $scope.token,
				"Content-Type": "application/json" 
			},
			dataType:"json",
		}).then(function(response){
			$scope.selectedPlaylistTracks = response.data.items;
		});
	};

}]);
