const app = angular.module('travelSite', ['ngRoute']);

app.run(['$rootScope', function($rootScope) {
  $rootScope.$on('$routeChangeSuccess', function () {
    document.body.scrollTop = document.documentElement.scrollTop = 0;
  })
}])

app.controller('MenuController', ['$http', function($http) {
  this.mobileMenu = false;
}]);

app.controller('HomeController', ['$http', function($http) {

}]);

app.controller('PostsController', ['$http', function($http) {

}]);

app.controller('PostController', ['$http', function($http) {

}]);


app.config(['$routeProvider','$locationProvider', function($routeProvider, $locationProvider) {
  $locationProvider.html5Mode({ enabled: true });

  $routeProvider.when('/', {
    templateUrl: 'home.html',
    controller: 'HomeController',
    controllerAs: 'ctrl'
  });

  $routeProvider.when('/posts', {
    templateUrl: 'posts.html',
    controller: 'PostsController',
    controllerAs: 'ctrl'
  });

  $routeProvider.when('/post', {
    templateUrl: 'post.html',
    controller: 'PostController',
    controllerAs: 'ctrl'
  });

  $routeProvider.otherwise({
    redirectTo: '/'
  })

}])
