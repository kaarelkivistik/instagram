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
        .state('profile', {
            url: '/profile/:id',
            templateUrl: 'views/profile.html',
            controller: 'ProfileController'
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
        .state('users', {
            url: '/users',
            templateUrl: 'views/users.html',
            controller: 'UsersController'
        })
        .state('upload', {
            url: '/upload',
            templateUrl: 'views/upload.html',
            controller: 'UploadController'
        })
        .state('photo', {
            url: '/photo/:id',
            templateUrl: 'views/photo.html',
            controller: 'PhotoController'
        })
});

angular.module('Instagram').controller('AuthController', function($scope, $http, Restangular) {
    $scope.$root.baseUrl = baseUrl;

    $scope.$root.like = function(photo) {
        Restangular.all('likes').post({
            photo_id: photo.id
        }).then(function(like){
            photo.likes.push({username: $scope.$root.user.username});
        });
    }

    $http({
        url: baseUrl + '/auth',
        method: 'GET'
    }).success(function(user) {
        $scope.$root.user = user;
    });
});

angular.module('Instagram').controller('HomeController', function($scope, Restangular) {
    $scope.reload = function() {
        Restangular.all('photos').getList().then(function(photos) {
            $scope.photos = photos;
        })
    };

    $scope.reload();
});

angular.module('Instagram').controller('ProfileController', function($scope, $state, Restangular) {
    Restangular.all('users').get($state.params.id).then(function(user) {
        $scope.user = user;
    });
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

angular.module('Instagram').controller('UsersController', function($scope, $state, Restangular) {
    Restangular.all('users').getList().then(function(users) {
        $scope.users = users;
    });
});

angular.module('Instagram').controller('UploadController', function($scope, $state, Restangular) {
    var allowedMimeTypes = ['image/png', 'image/jpeg', 'image/gif'];

    $scope.hasFile = false;
    $scope.photo = {};

    $scope.upload = function() {
        Restangular.all('photos').post($scope.photo).then(function(result) {
            $state.go('home');
        })
    };

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

                    $scope.photo.image = reader.result;
                    $scope.$apply();
                }

                reader.readAsDataURL(file);
            }
        } else {
            $scope.hasFile = false;
        }
    }

    document.getElementById('file').addEventListener('change', handleFileSelect, false);
});

angular.module('Instagram').controller('PhotoController', function($scope, $state, Restangular) {
    console.log($state.params);

    Restangular.all('photos').get($state.params.id).then(function(photo) {
        $scope.photo = photo;
    });

    $scope.deletePhoto = function(){
        Restangular.all('photos').one($state.params.id).remove().then(function(){
            $state.go('home');
        });
    };

    $scope.submitComment = function(){
        Restangular.all('comments').post({
            photo_id: $state.params.id,
            text: $scope.text
        }).then(function(comment){
            delete $scope.text;
            $scope.photo.comments.push(comment);
        });
    }
});
