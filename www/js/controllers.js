var myapp = angular.module('starter.controllers', []);
myapp.controller('HomeController', function($scope,$rootScope,
	$ionicPopover,$ionicModal,$stateParams,$http,$ionicLoading,$ionicPlatform,
	$ionicScrollDelegate,$ionicSideMenuDelegate,$ionicListDelegate,$ionicHistory,$ionicHistory,$ionicBackdrop,$window,GPMService) {
	
	$scope.swiper = {};
 
    $scope.onReadySwiper = function (swiper) {
 
        swiper.on('slideChangeStart', function () {
            console.log('slide start');
        });
         
        swiper.on('onSlideChangeEnd', function () {
            console.log('slide end');
        });     
    };

	$scope.goBack = function() {
		$ionicHistory.goBack();
	}
	var domain = 'http://gurbaniparcharmission.com';
	
	var listOfItemsInCache = {};
	$scope.getPageListingItems = function() {
		if (window.localStorage.getItem('footer-song')) {
			$rootScope.footerSongDetail = JSON.parse(window.localStorage.getItem('footer-song'));
			$rootScope.footerSongDetail['status'] = 'pause';
		}
		$scope.internetOn = true;
		/*if(navigator.connection.type == "none") {
	        console.log(navigator.connection.type);
	            $scope.internetOn = false;
	            $scope.page = 'cache';
	            listOfItemsInCache =  JSON.parse(window.localStorage.getItem("cache-list"));
				$scope.retrieveItemsInCache = listOfItemsInCache['main'];
				if (!$scope.$$phase) $scope.$apply();
				return;
	    } else {*/
	    	debugger;
	    	$scope.page = 'directory';
	    	var url = 'http://www.gurbaniparcharmission.com/media/listing_api.php';
			var item = {sub_dir_url : url};
			//$scope.backTrackArray.push(item);
			$http.get(url).then(function(response) {
				$scope.listOfItemsInSideMenu = [];
				var firstPartResponse = response.data;

				for (var idx in firstPartResponse) {
					var item = firstPartResponse[idx];
					item['parent_dir'] = 'main';
					item['parent_dir_url'] = url;
					item['parent_dir_item'] = JSON.stringify(item);
					firstPartResponse[idx] = item;
					$scope.listOfItemsInSideMenu.push(firstPartResponse[idx]);
				}

				listOfItemsInCache['main'] = firstPartResponse;

				var additionItemsUrl = domain+'/media/menu_api.php';
				$http.get(additionItemsUrl).then(function(response2) {					
					var additionalItemList = response2.data;
					var mainPageData = listOfItemsInCache['main'];
					for (var idx in additionalItemList) {
						var additionalItem = additionalItemList[idx];
						additionalItem['sub_dir_url'] = additionalItem.link;
						additionalItem['sub_dir_name'] = additionalItem.text;
						additionalItem['parent_dir'] = 'main';
						additionalItem['parent_dir_url'] = url;
						additionalItem['parent_dir_item'] = JSON.stringify(item);
						mainPageData[Object.keys(mainPageData).length] = additionalItem;
					}
					listOfItemsInCache['main'] = mainPageData;
					$scope.listOfItemsInPage = listOfItemsInCache['main'];
					window.localStorage.setItem("cache-list",JSON.stringify(listOfItemsInCache));
					$scope.retrieveItemsInCache = listOfItemsInCache['main'];
				});
				
				//$scope.sideMenuItemsInCache = JSON.parse(getRemote(url));
			});
	    //}
	}

	$scope.getHomeScreenSliderData = function() {

		$scope.page = 'directory';
	    var url = 'http://www.gurbaniparcharmission.com/media/listing_api.php';
		var item = {sub_dir_url : url};

		var sliderUrl = domain+'/media/slider_api.php';
		$http.get(sliderUrl).then(function(response) {
			for (var idx in response.data) {
				var sliderData = response.data[idx];
				sliderData['parent_dir'] = 'main';
				sliderData['parent_dir_url'] = url;
				sliderData['parent_dir_item'] = JSON.stringify(item);
				sliderData['sub_dir_url'] = sliderData.link;
				response.data[idx] = sliderData;
			}

			$scope.homeSliderData = response.data;
		});
	}
	
	$scope.getMenuItems = function() {
		var url = domain+'/media/menu_api.php';
		$http.get(url).then(function(response) {
			$scope.sideMenuSecondPart = response.data;
		});
	}


	$scope.isMenuOpened = false;
	$scope.openSideMenuModal = function() {
		$ionicModal.fromTemplateUrl('side-menu-modal.html', {
	      scope: $scope,
	      animation: 'fade-in-left'
	    }).then(function(modal) {

	      if (!$scope.isMenuOpened) {
	      		$showSideMenuHeaderTitle = false;
	      		$scope.directory = "";
		      	$scope.menuItemsToShow = 'categories';

		      //Variable to hold the album list as cache
		      $scope.sideMenuAlbumList = {}
		      $scope.sideMenuModal = modal;
		      $scope.sideMenuModal.show();
		      $scope.isMenuOpened = true;	

	      } else {
	      	$scope.closeSideMenuModal();
	      }
	      
	    });
	    $scope.closeSideMenuModal = function() {
	    	setTimeout(function(){
	    		$scope.isMenuOpened = false;	
	    	},500);
    		$scope.sideMenuModal.hide();	
 		};

 	};
  
	  
	$scope.headerBar = true;
	$scope.footerBar = false;
	$scope.callOnScroll = function() {
		var distanceFromTop =  $ionicScrollDelegate.getScrollPosition().top;
		if (distanceFromTop > 70) {
			$scope.headerBar = false;
			$scope.footerBar = true;
		} else {
			$scope.headerBar = true;
			$scope.xfooterBar = false;
		}
		$scope.$apply();
		console.log("$scope.headerBar : "+$scope.headerBar);
	}
	
	$scope.getMarqueText = function() {
			var marqueApi = "http://www.gurbaniparcharmission.com/media/highlighter.txt";
			$http.get(marqueApi).then(function(response) {
				$scope.marqueText = response.data;
			});	
	}
	
	$scope.backTrackArray = [];
	$scope.page = 'directory';
    $scope.getItemsFromAPI = function(item) {

    	if(navigator.connection.type == "none") {
		    window.plugins.toast.showShortCenter("Please connect to internet to access this.");
		    return;
		}
    	
    	$scope.directory = '';
    	$ionicLoading.show({
				template: '<ion-spinner></ion-spinner>'
		});

		var listItem = item;
		var parent_dir_url = JSON.parse(item.parent_dir_item).sub_dir_url;
		//delete listItem['parent_dir_item'];
		
		var url = listItem.sub_dir_url;
		var subDirName = listItem.sub_dir_name;
		url = url.replace("http://www.gurbaniparcharmission.com/media/","");
		var parent_dir_string = url.substring(0,url.indexOf(listItem.sub_dir_name)-1);
		var parent_dir_array = parent_dir_string.split("/");
		var parent_dir = decodeURIComponent(parent_dir_array[parent_dir_array.length - 1]);
		if (parent_dir != "") {
			//parent_dir_url = listItem.sub_dir_url;
			//parent_dir_url = parent_dir_url.replace(subDirName+"/","");
		}
		$http.get(listItem.sub_dir_url).then(function(response) {
			$ionicLoading.hide();
			$scope.listOfItemsInPage = response.data;
			if (!$scope.listOfItemsInPage[0].sub_dir_url) {
				$scope.page = 'list';
				$scope.getDownloadedSongList(listItem.sub_dir_url);
				if (!$scope.$$phase) $scope.$apply();
			} else {
				$scope.page = 'directory';
			}
				listItem.parent_dir = parent_dir;
				listItem.parent_dir_url = parent_dir_url;
				$scope.backTrackArray.push(listItem);
				
			for(var ind in response.data) {
				var item = response.data[ind];
				item['parent_dir'] = parent_dir;
				item['parent_dir_url'] = parent_dir_url;
				item['parent_dir_item'] = JSON.stringify(listItem);
				response.data[ind] = item;
			}
			$scope.listOfItemsInPage = response.data;
			listOfItemsInCache = JSON.parse(window.localStorage.getItem("cache-list"));
			listOfItemsInCache[subDirName] = response.data;
			window.localStorage.setItem("cache-list",JSON.stringify(listOfItemsInCache));
			if (!$scope.$$phase) $scope.$apply();

		}).catch(function (data) {
        	$ionicLoading.hide();	
        	window.plugins.toast.showShortCenter("No data available for selected item.");
    	});
    }

	$scope.getItemsFromAPIForQuickLinks = function(item) {
		if(navigator.connection.type == "none") {
		    window.plugins.toast.showShortCenter("Please connect to internet to access this.");
		    return;
		}
    	$scope.directory = '';
    	$ionicLoading.show({
				template: '<ion-spinner></ion-spinner>'
		});
    	var listItem = item;
    	var subDirName = listItem.text;
    	var url = listItem.link.replace("http://www.gurbaniparcharmission.com/media/","");
		var parent_dir_string = url.substring(0,url.indexOf(listItem.text)-1);
		var parent_dir_array = parent_dir_string.split("/");
		var parent_dir = decodeURIComponent(parent_dir_array[parent_dir_array.length - 1]);
		if (parent_dir != "") {
			parent_dir_url = listItem.link;
			parent_dir_url = parent_dir_url.replace(subDirName+"/","");
		}
		$http.get(listItem.link).then(function(response) {

			var homeurl = 'http://www.gurbaniparcharmission.com/media/listing_api.php';
			var homePageItem = {sub_dir_url : homeurl};
			$scope.backTrackArray.push(homePageItem);


			$ionicLoading.hide();
			console.log(response.data);
			$scope.listOfItemsInPage = response.data;
			if (!$scope.listOfItemsInPage[0].sub_dir_url) {
				$scope.page = 'list';
				$scope.getDownloadedSongList(listItem.link);
				if (!$scope.$$phase) $scope.$apply();
			} else {
				$scope.page = 'directory';
			}
				
			for(var ind in response.data) {
				var item = response.data[ind];
				item['parent_dir'] = parent_dir;
				response.data[ind] = item;
			}

			listOfItemsInCache = JSON.parse(window.localStorage.getItem("cache-list"));
			listOfItemsInCache[listItem.text] = response.data;
			window.localStorage.setItem("cache-list",JSON.stringify(listOfItemsInCache));
			if (!$scope.$$phase) $scope.$apply();

		}).catch(function (data) {
        	$ionicLoading.hide();	
        	window.plugins.toast.showShortCenter("No data available for selected item.");
    	});
    }



    $ionicPlatform.registerBackButtonAction(function () {
	    navigator.app.exitApp();
    	/*var condition = false;
  		if (condition) {
   		 navigator.app.exitApp();
  		} else {

  			if ($scope.internetOn) {
  				$scope.backTarckAppScreen();	
  			} else {
  				$scope.backTrackListOfItemsInCache();	
  			}
    		
  		}*/
	}, 100);

	$scope.exitFromApp =function() {
  		navigator.app.exitApp();
	};


	 $scope.backTarckAppScreen = function() {
	 	if(navigator.connection.type == "none") {
		    window.plugins.toast.showShortCenter("Please connect to internet to access this.");
		    return;
		}
	 	console.log("Back Track",$scope.backTrackArray,JSON.stringify($scope.backTrackArray));
	     var backtrackItem = $scope.backTrackArray[$scope.backTrackArray.length-1];
	     $scope.backTrackArray.splice([$scope.backTrackArray.length-1],1);
	     if ($scope.backTrackArray.length == 0) {	
	     	$scope.backTrackArray = [];
	     	$scope.getPageListingItems();
	     } else {
		     $http.get(backtrackItem.parent_dir_url).then(function(response) {
				$ionicLoading.hide();
				var parent_dir_url = JSON.parse(backtrackItem.parent_dir_item).sub_dir_url;
				for(var ind in response.data) {
					var item = response.data[ind];
					//item['parent_dir'] = parent_dir;
					item['parent_dir_url'] = parent_dir_url;
					item['parent_dir_item'] = JSON.stringify(backtrackItem);
					response.data[ind] = item;
				}

				$scope.listOfItemsInPage = response.data;
				if (!$scope.listOfItemsInPage[0].sub_dir_url) {
					$scope.page = 'list';
					$scope.getDownloadedSongList(item.sub_dir_url);
				} else {
					$scope.page = 'directory';
				}
				if (!$scope.$$phase) $scope.$apply();
			}).catch(function (data) {
	        	$ionicLoading.hide();	
	        	window.plugins.toast.showShortCenter("No data available for selected item.")
	    	});
	     }
	     

	  };

	$scope.getItemsFromCache = function(item) {
			if(navigator.connection.type == "none") {
		        console.log(navigator.connection.type);
		            if (listOfItemsInCache[item.sub_dir_name]) {
						$scope.retrieveItemsInCache = listOfItemsInCache[item.sub_dir_name];
						if (!$scope.retrieveItemsInCache[0].sub_dir_url) {
							$scope.page = 'list';
							$scope.getDownloadedSongList(item.sub_dir_url);
						} 
					} else {
						window.plugins.toast.showShortCenter("Please connect to internet to access this.");
					}
		    } else {
		    		$scope.internetOn = true;
		    		$scope.page = "directory";
		    }
	}

	$scope.backTrackListOfItemsInCache = function() {
		console.log("item at 0",JSON.stringify($scope.retrieveItemsInCache[0]));
		var item = $scope.retrieveItemsInCache[0];
		if (item.parent_dir == "") {
			item.parent_dir = "main";
		}
		$scope.retrieveItemsInCache = listOfItemsInCache[item.parent_dir];
		$scope.page = "cache";
		if (!$scope.$$phase) $scope.$apply();
	}


	$scope.listingMenuItems = function(mItem,listToShow) {
		$scope.urlInMemoryToShowItemsFor = mItem.sub_dir_url;
		$ionicLoading.show({
      				template: '<ion-spinner></ion-spinner>'
    			});
		if (listToShow == 'artists') {
			var directoryFromUrl = mItem.sub_dir_url.replace('http://www.gurbaniparcharmission.com/media/','');
			$scope.directory = directoryFromUrl.substring(0,mItem.sub_dir_url.indexOf('/'));
		}
		$http.get(mItem.sub_dir_url).then(function(response) {
			$scope.showSideMenuHeaderTitle = true;
			$ionicLoading.hide();
			$scope.items = [];
			for (var idx in response.data) {
					var item = response.data[idx];
					item['parent_dir'] = 'main';
					item['parent_dir_url'] = mItem.sub_dir_url;
					item['parent_dir_item'] = JSON.stringify(mItem);
					response.data[idx] = item;
					$scope.items.push(response.data[idx]);
			}
			$scope.menuItemsToShow = listToShow;
		}).catch(function (data) {
        	$ionicLoading.hide();	
        	window.plugins.toast.showShortCenter("No data available for selected item.")
    	});
	}

	$scope.backTrackSideMenu = function(itemsToShowFor) {
		$scope.showSideMenuHeaderTitle = false;
		var url = '';
		if (itemsToShowFor == 'categories') {
			url = 'http://www.gurbaniparcharmission.com/media/listing_api.php';
			$http.get(url).then(function(response) {
				console.log(response.data);
				$scope.menuItems = response.data;
				$scope.menuItemsToShow = 'categories';
			});	
			
		} else {
			url = $scope.urlInMemoryToShowItemsFor;
			$ionicLoading.show({
      				template: '<ion-spinner></ion-spinner>'
    			});
			$http.get(url).then(function(response) {
				$ionicLoading.hide();
				console.log(response.data);
				$scope.items = response.data;
				$scope.menuItemsToShow = itemsToShowFor;
			});	
		}
	}

	
	$scope.toggleAccordian = function(artist) {
		debugger;
	    if ($scope.isArtistShown(artist)) {
	      $scope.shownArtist = null;
	    } else {
	      $scope.shownArtist = artist;
	      if (!$scope.sideMenuAlbumList[artist.sub_dir_name]) {
	      		$ionicLoading.show({
      				template: '<ion-spinner></ion-spinner>'
    			});
				$http.get(artist.sub_dir_url).then(function(response) {
					$ionicLoading.hide();
					for (var idx in response.data) {
							var item = response.data[idx];
							item['parent_dir'] = 'main';
							item['parent_dir_url'] = artist.sub_dir_url;
							item['parent_dir_item'] = JSON.stringify(artist);
							response.data[idx] = item;
					}
					
					if (!response.data[0].sub_dir_url) {
						$scope.listOfItemsInPage = response.data;
						$scope.closeSideMenuModal();
						$scope.page = 'list';
						$scope.getDownloadedSongList(artist.sub_dir_url);
						$scope.backTrackArray.push(artist);
						if (!$scope.$$phase) $scope.$apply();
					} else {
						$scope.sideMenuAlbumList[artist.sub_dir_name]  = response.data;
					}
				}).catch(function (data) {
        			$ionicLoading.hide();	
        			window.plugins.toast.showShortCenter("No data available for selected item.")
    			});
	      }
	      	
	    }
  	};
	$scope.isArtistShown = function(artist) {
	    return $scope.shownArtist === artist;
	};
  	
  	$scope.getListingOnMainCategoryClick = function(page) {
  		$ionicLoading.show({
		  template: '<ion-spinner></ion-spinner>'
		});
		var url = "";
		if (page == 'artists') {
			url = GPMService.getLinkForSubdirectoryOnManCatrgoryClick();
		} else if (page == 'albums') {
			url = GPMService.getAlbumListLink();
		} else if (page == 'songs') {
			url = GPMService.getSongListLink();
			$scope.getDownloadedSongList(url);
		}

		if (window.localStorage.getItem('footer-song')) {
			$rootScope.footerSongDetail = JSON.parse(window.localStorage.getItem('footer-song'));
		}
		
		$http.get(url).then(function(response){
			$ionicLoading.hide();
        	console.log(response.data);
  			$scope.listingOnCategoryClick = response.data;
  			
  		}).catch(function (data) {
        	$ionicLoading.hide();	
        	window.plugins.toast.showShortCenter("No data available for selected item.")
    	});
	}

	$scope.takeActionOnSongClickInCache = function(songObject) {
		
		if ($scope.downloadedSongList[songObject.file_name] && $scope.downloadedSongList[songObject.file_name].status == 'downloading') {
			abortSongDownload(songObject);
		} else if (!$scope.downloadedSongList[songObject.file_name] || !$scope.downloadedSongList[songObject.file_name].status == 'downloaded') {
			//If song does not exist in downloaded list and is redy for downloading
			$scope.downloadSong(songObject);
		} else if ($scope.downloadedSongList[songObject.file_name] && 
			$scope.downloadedSongList[songObject.file_name].status == 'downloaded' && 
			(!$scope.songListReadyToPlay[songObject.file_name] || 
				$scope.songListReadyToPlay[songObject.file_name] == 'stop')) {
			//If song is downloaded is ready for playing
				
				$scope.playSong($scope.downloadedSongList[songObject.file_name].path);
				$scope.activeClickedSong(songObject.file_name);
		} else if ($scope.downloadedSongList[songObject.file_name] && 
			$scope.downloadedSongList[songObject.file_name].status == 'downloaded' && 
			($scope.songListReadyToPlay[songObject.file_name] && 
				$scope.songListReadyToPlay[songObject.file_name] == 'playing')) {
				//If song is downloaded is playing then stop it

				$scope.stopSong();
				$scope.deactivateClickedSong(songObject.file_name);
		}
	}

	$scope.takeActionOnSongClick = function(songObject) {
		if (isDeleteSongClicked) {
			isDeleteSongClicked = false;
			return;
		}
		if ($scope.downloadedSongList[songObject.file_name] && $scope.downloadedSongList[songObject.file_name].status == 'downloading') {
			abortSongDownload(songObject);
		} else if (!$scope.downloadedSongList[songObject.file_name] || !$scope.downloadedSongList[songObject.file_name].status == 'downloaded') {
			//If song does not exist in downloaded list and is redy for downloading
			$scope.downloadSong(songObject);
		} else if ($scope.downloadedSongList[songObject.file_name] && 
			$scope.downloadedSongList[songObject.file_name].status == 'downloaded' && 
			(!$scope.songListReadyToPlay[songObject.file_name] || 
				$scope.songListReadyToPlay[songObject.file_name] == 'stop')) {
			//If song is downloaded is ready for playing
				
				$scope.playSong($scope.downloadedSongList[songObject.file_name].path);
				$scope.activeClickedSong(songObject.file_name);
		} else if ($scope.downloadedSongList[songObject.file_name] && 
			$scope.downloadedSongList[songObject.file_name].status == 'downloaded' && 
			($scope.songListReadyToPlay[songObject.file_name] && 
				$scope.songListReadyToPlay[songObject.file_name] == 'playing')) {
				//If song is downloaded is playing then stop it

				$scope.stopSong();
				$scope.deactivateClickedSong(songObject.file_name);

				$scope.pauseSongFromFooter();

		}
	}

	$scope.downloadedSongList = {};	
	$scope.getDownloadedSongList = function(folderPath) {
    	var folderPathWhereSongsArePlaced = folderPath.substring(folderPath.indexOf("media")+5,folderPath.lastIndexOf("/"));
    	window.resolveLocalFileSystemURL($window.cordova.file.externalRootDirectory +'gpm'+decodeURIComponent(folderPathWhereSongsArePlaced),
    		function (fileSystem) {
		      var reader = fileSystem.createReader();
		      reader.readEntries(
		        function (entries) {
		          	for (var i = 0; i < entries.length; i++ ){
		          		console.log(entries[i]);
		          		$scope.downloadedSongList[entries[i].name] = {status : 'downloaded',path : entries[i].nativeURL};
		          	}
		          	if (!$scope.$$phase) $scope.$apply();
		        },
		        function (err) {
		          console.log(err);
		        }
		      );
		    }, function (err) {
		      console.log(err);
		    }
	  	);
    	$scope.selectedSong = folderPath;
    	$scope.artistName = GPMService.getArtistName();
   	}

   	$scope.fileTransferArray = {};
	$scope.downloadSong = function(songDetail) {
		if (!$scope.internetOn) {
			window.plugins.toast.showShortCenter("Please connect to internet to download.");
			return;
		}
		var songUrl = songDetail.file_url;
			$scope.downloadedSongList[songDetail.file_name] = {status : 'downloading'};
			//$ionicLoading.show();
			var uri = songUrl.replace('http://www.gurbaniparcharmission.com/media','');
			var pathToSaveAt = decodeURIComponent(uri.substring(0,uri.lastIndexOf("/")));
			window.resolveLocalFileSystemURL($window.cordova.file.externalRootDirectory , function(){
			  var fileTransfer = new FileTransfer();
	  			$scope.fileTransferArray[songDetail.file_name] = fileTransfer;
		    	console.log("About to start transfer");
		    	var fileName = getFileName(songUrl);
		    	fileTransfer.download(songUrl, $window.cordova.file.externalRootDirectory.replace('file://','') +'gpm/'+pathToSaveAt+'/'+ fileName, 
				function(entry) {
   					console.log(songDetail.file_url,"downloaded");
   					$scope.downloadedSongList[songDetail.file_name] = {status : 'downloaded',path : $window.cordova.file.externalRootDirectory.replace('file://','') +'gpm/'+pathToSaveAt+'/'+ fileName};
   					if (!$scope.$$phase) 
   						$scope.$apply();
			    });
		    	$scope.downloadProgress = {};
			    fileTransfer.onprogress = function(progressEvent) {
				    var percent =  progressEvent.loaded / progressEvent.total * 100;
				    $scope.downloadProgress[songDetail.file_name] = Math.round(percent);
				    console.log($scope.downloadProgress[songDetail.file_name]);
				    if (!$scope.$$phase) 
   						$scope.$apply();
				};
	        }, 
	        function(err) {
	        	$ionicLoading.hide();
	            alert("Error");
	            alert(err);
	        });
	}

	function abortSongDownload (songDetail) { // called on Abort button click
		var fileTransfer = $scope.fileTransferArray[songDetail.file_name];
    	fileTransfer.abort(); // Aborting Song 
    	fileTransfer = null; // Freeing 
    	delete $scope.fileTransferArray[songDetail.file_name];
    	delete $scope.downloadedSongList[songDetail.file_name];
    	delete $scope.downloadProgress[songDetail.file_name];
	}

	var isDeleteSongClicked = false;
	$scope.deleteSong = function(songDetail) {
		isDeleteSongClicked = true;
		var url = songDetail.file_url;
		var folderPathWhereSongsArePlaced = url.substring(url.indexOf("media")+5,url.lastIndexOf("/"));

		window.resolveLocalFileSystemURL($window.cordova.file.externalRootDirectory +'gpm'+decodeURIComponent(folderPathWhereSongsArePlaced), function(dir) {
	dir.getFile(songDetail.file_name, {create:false},function(fileEntry) {
              fileEntry.remove(function(){
                  // The file has been removed succesfully
                  delete $scope.downloadedSongList[songDetail.file_name];
                  delete $scope.songListReadyToPlay[songDetail.file_name];
                  if ($rootScope.footerSongDetail['song'] == songDetail.file_name) {
						$rootScope.footerSongDetail = {};
						window.localStorage.removeItem('footer-song');
                  }
                  $ionicListDelegate.closeOptionButtons();
                  if (!$scope.$$phase) 
   						$scope.$apply();
              },function(error){
                  // Error deleting the file
              },function(){
                 // The file doesn't exist
              });

			});
		});
	 }	

	$scope.songListReadyToPlay = {};
	$scope.activeClickedSong = function(songName) {
		for (var key in $scope.songListReadyToPlay) {
			$scope.songListReadyToPlay[key] = 'stop';
		}
		$scope.songListReadyToPlay[songName] = 'playing';
	}
	$scope.deactivateClickedSong = function(songName) {
		$scope.songListReadyToPlay[songName] = 'stop';
	}


	$scope.playSong = function(src) {
		if($rootScope.media) $rootScope.media.stop();
        $rootScope.media = new Media(src, null, null, mediaStatusCallback);
       	$rootScope.media.play();
       	$rootScope.footerSongDetail = {};
       	$rootScope.footerSongDetail['song-url'] = src;
       	$rootScope.footerSongDetail['artist'] = GPMService.getArtistName();
       	$rootScope.footerSongDetail['song'] = decodeURIComponent(src.substring(src.lastIndexOf("/")+1,src.length));
       	$rootScope.footerSongDetail['status'] = 'playing';
       	window.localStorage.setItem('footer-song',JSON.stringify($rootScope.footerSongDetail));
       	$scope.songPlaying = true;

       	mediaTimer = setInterval(function () {
		    // get media position
		    $rootScope.media.getCurrentPosition(
		        // success callback
		        function (position) {
		            if (position > -1) {
		                console.log((position) + " sec");
		                var duration = $rootScope.media.getDuration();
		                $(".duration").text(Math.floor(position/60)+":"+Math.floor(position%60));
		                var percent = Math.floor((position/duration)*100);
		                $("#progress-amount").css("width",percent+"%");
		            }
		        },
		        // error callback
		        function (e) {
		            console.log("Error getting pos=" + e);
		            $scope.stopSong();
		        }
		    );
		}, 1000);
    }

 	$scope.rewindForward = function(type) {
 			$rootScope.media.getCurrentPosition(
                        // success callback
                        function(position) {
                            if (position > -1) {
                                //console.log(position , " sec");
                                var number = position * 1000;
									switch(type){
						                case 'back':
						                    console.log(position);
						                    $rootScope.media.seekTo(number - 15000);
						                    break;
						                case 'forward':
						                    console.log(position);
						                    $rootScope.media.seekTo(number + 15000);
						                    break;
						            }

                            }
                        },
                        // error callback
                        function(e) {
                            console.log("Error getting pos=" + e);
                             console.log("Error: " + e);
                        }
                    );     
    }

   	$scope.stopSong = function() {
    	if($rootScope.media) $rootScope.media.pause();
    	$scope.songPlaying = false;
    	clearInterval(mediaTimer);
   	}

	var mediaTimer = null;
    $scope.playSongFromFooter = function(footerSongDetail) {
		if(!$rootScope.media)
        $rootScope.media = new Media(footerSongDetail['song-url'], null, null, mediaStatusCallback);
    
       	$rootScope.media.play();       	
	    // Update media position every second
		mediaTimer = setInterval(function () {
		    // get media position
		    $rootScope.media.getCurrentPosition(
		        // success callback
		        function (position) {
		            if (position > -1) {
		                console.log((position) + " sec");
		                var duration = $rootScope.media.getDuration();
		                $(".duration").text(Math.floor(position/60)+":"+Math.floor(position%60));
		                var percent = Math.floor((position/duration)*100);
		                $("#progress-amount").css("width",percent+"%");
		            }
		        },
		        // error callback
		        function (e) {
		            console.log("Error getting pos=" + e);
		            $scope.stopSong();
		        }
		    );
		}, 1000);

       	$rootScope.footerSongDetail['status'] = 'playing';
       	$scope.songListReadyToPlay[$rootScope.footerSongDetail['song']] = 'playing';
       	window.localStorage.setItem('footer-song',JSON.stringify($rootScope.footerSongDetail));
    }
 	$scope.pauseSongFromFooter = function() {
    	if($rootScope.media) $rootScope.media.pause();
    	$rootScope.footerSongDetail['status'] = 'pause';
    	$scope.songListReadyToPlay[$rootScope.footerSongDetail['song']] = 'stop';
    	window.localStorage.setItem('footer-song',JSON.stringify($rootScope.footerSongDetail));
    	clearInterval(mediaTimer);
    }

    $scope.hideFooterSong = function() {
    	$rootScope.footerSongDetail = {};
    }

	$scope.doRefresh = function() {
		if(navigator.connection.type == "none") {
		    window.plugins.toast.showShortCenter("Please connect to internet to access this.");
		    return;
		}
		$scope.getHomeScreenSliderData();
		$scope.getPageListingItems();
		$scope.getMarqueText();
		$scope.getMenuItems();
		$scope.$broadcast('scroll.refreshComplete');
	}

/*****************************************    CACHE FLOWWW  STARTS   **************************************/
	/*var sideMenuFromCacheStorage = {};
    setTimeout(function(){
    	 sideMenuFromCacheStorage = JSON.parse(getRemote('json/side-menu.json'));
    	 $scope.sideMenuFromCacheStorage  = sideMenuFromCacheStorage['main'];
    	 $scope.directoryLength = 1;
    	 $scope.loadInitialDataFromCacheForPage();
    },2000);
	
    $scope.loadInitialDataFromCacheForPage = function() {
    	$scope.pageDataFromCacheStorage = sideMenuFromCacheStorage['main'];
    	$scope.page = 'directory';
    	if (!$scope.$$phase) 
   		$scope.$apply();
    }
    $scope.loadDataFromCacheForPage = function(item) {
		$scope.backTrackCacheItemForPage = item;
		$scope.pageDataFromCacheStorage = sideMenuFromCacheStorage[item.parent_dir+'--'+item.sub_dir_name];
    }

     $scope.backtrackDataFromCacheForPage = function() {
		var item = $scope.backTrackCacheItemForPage;
		$scope.pageDataFromCacheStorage = sideMenuFromCacheStorage[item.parent_dir];
		if (item.parent_dir != 'main') {
			var backItem = sideMenuFromCacheStorage[item.parent_dir][0];
			$scope.backTrackCacheItemForPage = sideMenuFromCacheStorage[backItem.parent_dir.substring(0,backItem.parent_dir.lastIndexOf("--"))][0];
		}
		if (!$scope.$$phase) 
   		$scope.$apply();
    }

	$scope.filterSideMenu = function(item) {
		$scope.backTrackCacheItem = item;
		$scope.directory = item.sub_dir_name;
		$scope.directoryLength = 2;
		$scope.sideMenuFromCacheStorage = sideMenuFromCacheStorage[item.parent_dir+'--'+item.sub_dir_name];
		// $scope.directoryLength = item.parent_dir.split("--").length;
	}

	$scope.backTrackCacheSideMenu = function(item) {
		$scope.directoryLength = 1;
		$scope.sideMenuFromCacheStorage = sideMenuFromCacheStorage[item.parent_dir];
	}

	$scope.toggleAccordianForCache = function(artist) {
	    if ($scope.isArtistShown(artist)) {
		    $scope.shownArtist = null;
	    } else {
	    	$scope.shownArtist = artist;
	     	$scope.sideMenuAlbumList[artist.sub_dir_name] = sideMenuFromCacheStorage[artist.parent_dir+'--'+artist.sub_dir_name];
	    }
  	};


    var sideMenuCacheList = {};
    var loadSideMenuForCache = function(item) {
    	console.log("Load side menu cache");
		var list = [];
		if (item.sub_dir_url) {
			var remoteUrl = item.sub_dir_url;
			try {
				list = JSON.parse(getRemote(remoteUrl));
				var dir = item.sub_dir_name;
				if (item.parent_dir) {
					dir = item.parent_dir +'--'+ dir;
				}

				sideMenuCacheList[dir] = list;
				console.log(sideMenuCacheList.length,sideMenuCacheList);
			} catch (error) {
				list = [];
			}
		}
		
		for (var idx in list) {
			var subItem = list[idx];
			subItem['parent_dir'] = dir;
			if (!item.sub_dir_url) {
				console.log(sideMenuCacheList);
				return;
			}
			loadSideMenuForCache(subItem);
			window.localStorage.setItem("cacheData",sideMenuCacheList);
		}
    }

	function getRemote(url) {
	    return $.ajax({
	        type: "GET",
	        url: url,
	        async: true
	    }).responseText;
	}

	setTimeout(function(){
		var url = 'http://www.gurbaniparcharmission.com/media/listing_api.php';
		var item = {sub_dir_url : url,
					sub_dir_name : 'main'};
		loadSideMenuForCache(item);
	},3000);
    */
/*****************************************    CACHE FLOWWW     **************************************/


    var mediaStatusCallback = function(status) {
        if(status == 1) {
            $ionicLoading.show({template: 'Loading...'});
        } else {
            $ionicLoading.hide();
        }
    }

	var getFileName = function(url) {
		var filename = url.substring(url.lastIndexOf('/')+1);
		return filename;
	}
}).factory('Factory', function($http,$q) {
	var linkForSubdirectoryOnManCatrgoryClick = "";
	var albumListLink = "";
	var songListLink = "";
	var artistName = "";
	var footerSongDetail = {};

	 function getLinkForSubdirectoryOnManCatrgoryClick() {
    	 return linkForSubdirectoryOnManCatrgoryClick;
     }
     function setLinkForSubdirectoryOnManCatrgoryClick(url) {
    	 linkForSubdirectoryOnManCatrgoryClick = url;
     }

     function setAlbumListLink(url) {
     	albumListLink = url;
     } 
     function getAlbumListLink() {
     	return albumListLink;
     }

     function setSongListLink(url) {
     	songListLink = url;
     }
     function getSongListLink() {
     	return songListLink;
     }

     function setArtistName(name) {
     	artistName = name;
     }
     function getArtistName() {
     	return artistName;
     }

     function setFooterSongDetail(footerSongDetail) {
     		footerSongDetail = footerSongDetail;
     }
     function getFooterSongDetail() {
     	return footerSongDetail;
     }
     return {
		setLinkForSubdirectoryOnManCatrgoryClick : setLinkForSubdirectoryOnManCatrgoryClick,
		getLinkForSubdirectoryOnManCatrgoryClick : getLinkForSubdirectoryOnManCatrgoryClick,
		setAlbumListLink : setAlbumListLink,
		getAlbumListLink : getAlbumListLink,
		setSongListLink : setSongListLink,
		getSongListLink : getSongListLink,
		setArtistName : setArtistName,
		getArtistName : getArtistName,
		setFooterSongDetail : setFooterSongDetail,
		getFooterSongDetail : getFooterSongDetail
     }
}).service('GPMService',function(Factory) {
	this.setLinkForSubdirectoryOnManCatrgoryClick = function (url) {
		Factory.setLinkForSubdirectoryOnManCatrgoryClick(url);
	}
	
	this.getLinkForSubdirectoryOnManCatrgoryClick = function() {
		return Factory.getLinkForSubdirectoryOnManCatrgoryClick();
	}

	this.setAlbumListLink = function(url) {
		Factory.setAlbumListLink(url)
	}
	this.getAlbumListLink = function() {
		return Factory.getAlbumListLink();
	}

	this.setSongListLink = function(url) {
		Factory.setSongListLink(url);
	}
	this.getSongListLink = function() {
		return Factory.getSongListLink();
	}

	this.setArtistName = function(name) {
		Factory.setArtistName(name);
	}
	this.getArtistName = function() {
		return Factory.getArtistName();
	}

	this.setFooterSongDetail = function(footerSongDetail) {
		Factory.setFooterSongDetail(footerSongDetail);
	}
	this.getFooterSongDetail = function() {
		return Factory.getFooterSongDetail();
	}	
});
