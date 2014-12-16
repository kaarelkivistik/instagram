angular.module('Instagram', ['ui.router', 'restangular']);

angular.module('Instagram').config(function($stateProvider, $urlRouterProvider, RestangularProvider) {
    RestangularProvider.setBaseUrl('backend/public');

    $urlRouterProvider.otherwise("/");

    $stateProvider
        .state('home', {
            url: '/',
            templateUrl: 'views/home.html',
            controller: 'HomeController'
        })
        .state('signup', {
            url: '/signup',
            templateUrl: 'views/signup.html',
            controller: 'SignupController'
        })
        .state('login', {
            url: '/login',
            templateUrl: 'views/login.html',
            controller: 'LoginController'
        })
        .state('upload', {
            url: '/upload',
            templateUrl: 'views/upload.html',
            controller: 'UploadController'
        })
        .state('photo', {
            url: '/photo',
            templateUrl: 'views/photo.html',
            controller: 'PhotoController'
        })
});

angular.module('Instagram').controller('HomeController', function($scope, Restangular) {
    $scope.reload = function() {
        Restangular.all('photos').getList().then(function(photos) {
            $scope.photos = photos;
        })
    };
});

angular.module('Instagram').controller('SignupController', function($scope, Restangular) {
	
});
