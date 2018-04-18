const app = angular.module('travelSite', ['ngRoute']);

app.run(['$rootScope', function($rootScope) {
  $rootScope.$on('$routeChangeSuccess', function () {
    document.body.scrollTop = document.documentElement.scrollTop = 0;
  })
}])

app.controller('MenuController', ['$http', function($http) {
  this.mobileMenu = false;
}]);

// app.controller('HomeController', ['$http', function($http) {
//
// }]);

app.config(['$routeProvider','$locationProvider', function($routeProvider, $locationProvider) {
  $locationProvider.html5Mode({ enabled: true });

  // $routeProvider.when('/', {
  //   templateUrl: 'home.html',
  //   controller: 'HomeController',
  //   controllerAs: 'ctrl'
  // });

  $routeProvider.otherwise({
    redirectTo: '/'
  })

}])
