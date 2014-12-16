var baseUrl = 'backend/public';

angular.module('Instagram', ['ui.router', 'restangular']);

angular.module('Instagram').config(function($stateProvider, $urlRouterProvider, RestangularProvider) {
    RestangularProvider.setBaseUrl(baseUrl);

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
        .state('logout', {
            url: '/logout',
            templateUrl: 'views/logout.html',
            controller: 'LogoutController'
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

angular.module('Instagram').controller('AuthController', function($scope, $http) {
    $http({
        url: baseUrl + '/auth',
        method: 'GET'
    }).success(function(user) {
        $scope.$root.user = user;
    })
});

angular.module('Instagram').controller('HomeController', function($scope, Restangular) {
    $scope.reload = function() {
        Restangular.all('photos').getList().then(function(photos) {
            $scope.photos = photos;
        })
    };
});

angular.module('Instagram').controller('SignupController', function($scope, $state, Restangular) {
    var users = Restangular.all('users');

    $scope.signup = function() {
        users.post($scope.user).then(function(user) {
            $scope.$root.user = user;
            $state.go('home');
        });
    };
});

angular.module('Instagram').controller('LoginController', function($scope, $state, $http) {
    $scope.login = function() {
        $http({
            url: baseUrl + '/login',
            method: 'POST',
            data: $scope.user
        }).success(function(user) {
            $scope.$root.user = user;
            $state.go('home');
        }).error(function() {

        });
    };
});

angular.module('Instagram').controller('LogoutController', function($scope, $state, $http) {
    $http({
        url: baseUrl + '/logout',
        method: 'GET'
    }).success(function() {
        delete $scope.$root.user;
        $state.go('home');
    });
});

angular.module('Instagram').controller('UploadController', function($scope, $state, Restangular) {
	$scope.hasFile = false;
    var allowedMimeTypes = ['image/png', 'image/jpeg', 'image/gif'];

    function handleFileSelect(event) {
        var file;

        if (event.target.files.length > 0) {
            file = event.target.files[0];

            $scope.fileIsAllowed = allowedMimeTypes.indexOf(file.type) > -1;
            $scope.hasFile = true;
            $scope.$apply();

            if ($scope.fileIsAllowed) {
                var reader = new FileReader();

                reader.onload = function(fileEvent) {
                    $('img#preview').attr('src', reader.result);
                }

                reader.readAsDataURL(file);
            } 
        } else {
        	$scope.hasFile = false;
        }
    }

    document.getElementById('file').addEventListener('change', handleFileSelect, false);
});

angular.module('Instagram').controller('PhotoController', function($scope, Restangular) {

});
