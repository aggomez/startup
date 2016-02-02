var playlistApp = angular.module("playlistApp", ["ui.router", "LocalStorageModule"]);

playlistApp.config(function (localStorageServiceProvider) {
  localStorageServiceProvider
    .setPrefix('playlistApp')
    .setStorageType('localStorage')
    .setNotify(true, true)
});

playlistApp.config(["$urlRouterProvider", "$stateProvider", function ($urlRouterProvider, $stateProvider) {
	$stateProvider
	
	.state("home",{
		url: "/",
		templateUrl:"templates/show.html",
		controller:"playlistCtrl"
	})

	.state("home.details",{
		url: "/details",
		templateUrl:"templates/details.html",
		controller:"detailsCtrl"
	})

	.state("home.edit",{
		url: "/edit",
		templateUrl:"templates/edit.html",
		controller:"playlistCtrl"
	})

	$urlRouterProvider.otherwise("/");
	
}]);


playlistApp.controller("playlistCtrl", ["$scope", "localStorageService", "detailsService", function ($scope, localStorageService, detailsService) {
	var playlistInStore = localStorageService.get("playlist");

	$scope.playlist = playlistInStore || [];

	$scope.$watch('playlist', function () {
		localStorageService.set('playlist', $scope.playlist);
	}, true);

	$scope.addTrack = function (){
		if ($scope.newtrack){
			$scope.playlist.push($scope.newtrack);
			$scope.newtrack = "";
		}
	};

	$scope.removeTrack = function (index){
		$scope.playlist.splice(index, 1);
	};

	$scope.details = function (trackDetails) {
		detailsService.setTrackDetails(trackDetails);
	};

	$scope.edit = function (index) {
		$scope.editedIndex = index;
	};

	$scope.saveEdit = function () {
		$scope.playlist[$scope.editedIndex] = $scope.editedTrack;
	};

}]);

playlistApp.controller("detailsCtrl", ["$scope", "detailsService", function ($scope, detailsService) {
	$scope.trackDetails = detailsService.getTrackDetails();
}]);

playlistApp.service("detailsService", function() {
	var details = "";

	this.setTrackDetails = function (trackDetails) {
		details = trackDetails;
	};

	this.getTrackDetails = function () {
		return details;
	};
	
});