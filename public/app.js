const app = angular.module('travelSite', ['ngRoute', 'angularTrix']);

app.run(['$rootScope', function($rootScope) {
  $rootScope.$on('$routeChangeSuccess', function () {
    document.body.scrollTop = document.documentElement.scrollTop = 0;
  })
}])

app.value('blogURL', 'http://localhost:3000/blogs/');

app.service('blogService', ['$http', 'blogURL', function ($http, blogURL) {

  this.getBlogs = () => {
    return $http({
      method: 'GET',
      url: blogURL
    })
  }

  this.getBlog = (blogId) => {
  return $http({
    method: 'GET',
    url: blogURL + blogId
  })
}


}])

app.controller('MenuController', ['$http', function($http) {
  this.mobileMenu = false;
}]);

app.controller('HomeController', ['$http', 'blogService', function($http, blogService) {

  blogService.getBlogs().then(response => {
    this.blogs = response.data;
    console.log(this.blogs);
  }).catch(error => {
    console.log('error:', error);
  });

}]);

app.controller('PostsController', ['$http', 'blogService', function($http, blogService) {

  blogService.getBlogs().then(response => {
    this.blogs = response.data;
    console.log(this.blogs);
  }).catch(error => {
    console.log('error:', error);
  });

}]);

app.controller('PostController', ['$http', 'blogService', '$routeParams', function($http, blogService, $routeParams) {

  this.id = $routeParams.id;
  this.imageRepeatsArray = [];
  this.sectionRepeatsArray = [];
  this.blog = {};

  blogService.getBlog(this.id).then(response => {
      this.blog = response.data;
      console.log(this.blog);
      this.setRepeats();
    }).catch(error => {
      console.log('error:', error);
    });

  this.setRepeats = () => {

    this.paragraphRepeats = this.blog.paragraphs.length - 1;
    console.log('paragraphRepeats:', this.paragraphRepeats);

    if ((this.blog.images.length - 1) % 2 === 0) {
      this.imageRepeats = (this.blog.images.length - 1) / 2
    }
    else {
      this.imageRepeats = this.blog.images.length / 2
    }
    console.log('imageRepeats:', this.imageRepeats);

    if (this.imageRepeats > this.paragraphRepeats) {
      this.sectionRepeats = this.paragraphRepeats + (this.imageRepeats - this.paragraphRepeats)
    }
    else {
      this.sectionRepeats = this.imageRepeats + (this.paragraphRepeats - this.imageRepeats)
    }

    console.log('sectionRepeats:', this.sectionRepeats);
    for (let i = 0; i < this.sectionRepeats; i++) {
      this.sectionRepeatsArray.push(i);
    }
    console.log(this.sectionRepeatsArray);
  }


}]);

app.controller('CreateController', ['$http', function($http) {

  // this.blogData = {};
  //
  // this.processBlogForm = () => {
  //
  // }

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

  $routeProvider.when('/post/:id', {
    templateUrl: 'post.html',
    controller: 'PostController',
    controllerAs: 'ctrl'
  });

  $routeProvider.when('/create', {
    templateUrl: 'create.html',
    controller: 'CreateController',
    controllerAs: 'ctrl'
  });

  $routeProvider.otherwise({
    redirectTo: '/'
  })

}])
