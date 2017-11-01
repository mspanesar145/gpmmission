// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic','ionic.ion.headerShrink', 'starter.controllers','ngCordova','ksSwiper'])

.run(function($ionicPlatform,$rootScope) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
    
    if (window.localStorage.getItem("cacheData")) {
      console.log(window.localStorage.getItem("cacheData"));
    }
    
  });
}).config(function($ionicConfigProvider) {
    $ionicConfigProvider.backButton.text('').icon('ion-arrow-left-c');
})

.config(function($stateProvider, $urlRouterProvider) {
    /*$stateProvider
    .state('base', {
      url:'/',
      views: {
        'baseView': {
          templateUrl: 'templates/home.html'
        },
        'sideView': {
          templateUrl: 'side.html'
        }
      }
    })
    .state('side-item', {
      url: '/side/side-item',
      views: {
        'sideView': {
          templateUrl: 'side-item.html'
        }
      }
    });*/
$stateProvider.state('app', {
     url: '/app',
     abstract: true,
     templateUrl: ""
  }).state('app.common', {
    cache:false,
    url: '/common',
    templateUrl: "templates/common.html"
  }).state('app.home', {
    cache:false,
    url: '/home',
    templateUrl: "templates/home.html"
  }).state('app.sub-dir-list', {
    cache:false,
    url: '/sub-dir-list',
    templateUrl: "templates/sub-directory-list.html"
  }).state('app.album-list', {
    cache:false,
    url: '/album-list',
    templateUrl: "templates/artist-album-listing.html"
  }).state('app.song-list', {
    cache:false,
    url: '/song-list',
    templateUrl: "templates/album-song-listing.html"
  });

  // if none of the above are matched, go to this one
  $urlRouterProvider.otherwise('/app/common');
});
