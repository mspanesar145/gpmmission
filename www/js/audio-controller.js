myapp.controller('AudioController', function($scope,$rootScope,$window,$ionicModal,$stateParams,$http,$ionicLoading,$ionicScrollDelegate,$ionicSideMenuDelegate,$ionicHistory) {
	var media;
	$scope.playSong = function(src) {
		if(media) media.stop();
        media = new Media(src, null, null, mediaStatusCallback);
       	media.play();
    }
    var mediaStatusCallback = function(status) {
        if(status == 1) {
            $ionicLoading.show({template: 'Loading...'});
        } else {
            $ionicLoading.hide();
        }
    }
});