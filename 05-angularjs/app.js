var playlistApp = angular.module("playlistApp", ['ui.router']);

playlistApp.config(function ($urlRouterProvider, $stateProvider) {
	$stateProvider
	
	.state("home",{
		url: "/",
		templateUrl:"templates/show.html",
		controller:"playlistCtrl"
	})

	$urlRouterProvider.otherwise("/");
	
});


playlistApp.controller("playlistCtrl", ["$scope", function ($scope) {
	$scope.playlist = ["ASD", "asd"];
	$scope.addTrack = function (){
		if ($scope.newtrack){
			$scope.playlist.push($scope.newtrack);
			$scope.newtrack = "";
		}
	};
}]);
