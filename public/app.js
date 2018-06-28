const app = angular.module('travelSite', ['ngRoute']);

app.run(['$rootScope', function($rootScope) {
  $rootScope.$on('$routeChangeSuccess', function () {
    document.body.scrollTop = document.documentElement.scrollTop = 0;
  })
}])

app.value('blogURL', 'https://black-dog-travel-api.herokuapp.com/blogs/');
// app.value('blogURL', 'http://localhost:3000/blogs/');


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

app.controller('HomeController', ['$http', 'blogURL', function($http, blogURL) {

  this.getHomeBlogs = () => {
    $http({
      method: 'GET',
      url: blogURL + 'home'
    }).then(response => {
      this.blogs = response.data;
      console.log(this.blogs);
    }).catch(error => {
      console.log('error:', error);
    });
  }

this.getHomeBlogs();

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
  // this.imageRepeatsArray = [];
  // this.sectionRepeatsArray = [];
  this.blog = {};

  blogService.getBlog(this.id).then(response => {
      this.blog = response.data;
      console.log(this.blog);
      // this.setRepeats();
    }).catch(error => {
      console.log('error:', error);
    });

  // this.setRepeats = () => {
  //
  //   this.paragraphRepeats = this.blog.paragraphs.length - 1;
  //   console.log('paragraphRepeats:', this.paragraphRepeats);
  //
  //   if ((this.blog.images.length - 1) % 2 === 0) {
  //     this.imageRepeats = (this.blog.images.length - 1) / 2
  //   }
  //   else {
  //     this.imageRepeats = this.blog.images.length / 2
  //   }
  //   console.log('imageRepeats:', this.imageRepeats);
  //
  //   if (this.imageRepeats > this.paragraphRepeats) {
  //     this.sectionRepeats = this.paragraphRepeats + (this.imageRepeats - this.paragraphRepeats)
  //   }
  //   else {
  //     this.sectionRepeats = this.imageRepeats + (this.paragraphRepeats - this.imageRepeats)
  //   }
  //
  //   console.log('sectionRepeats:', this.sectionRepeats);
  //   for (let i = 0; i < this.sectionRepeats; i++) {
  //     this.sectionRepeatsArray.push(i);
  //   }
  //   console.log(this.sectionRepeatsArray);
  // }


}]);

app.controller('CreateController', ['$http', 'blogURL', function($http, blogURL) {

  this.formData = {};
  this.images = [];
  this.paragraphs = [];

  this.addImage = () => {
    this.images.push({url: null});
  };

  this.addParagraph = () => {
    this.paragraphs.push({text: null});
  };

  this.removeImage = (index) => {
    this.images.splice(index, 1);
  }

  this.removeParagraph = (index) => {
    this.paragraphs.splice(index, 1);
  }

  this.clearForm = () => {
    this.formData = {};
    this.images = [];
    this.paragraphs = [];
  }

  this.processForm = () => {
    $http({
      method: 'POST',
      url: blogURL,
      data: this.formData
    }).then(response => {
      console.log(this.formData);
      for (let i = 0; i < this.images.length; i++) {
        this.processImages(response.data.id, this.images[i])
      };
      for (let i = 0; i < this.paragraphs.length; i++) {
        this.processParagraphs(response.data.id, this.paragraphs[i])
      };
      this.clearForm();
    })
  }

  this.processImages = (id, image) => {
    $http({
      method: 'POST',
      url: blogURL + id + '/images',
      data: {
        blog_id: id,
        url: image.url
      }
    }).then(response => {
      console.log(response.data);
    });
  }

  this.processParagraphs = (id, paragraph) => {
    $http({
      method: 'POST',
      url: blogURL + id + '/paragraphs',
      data: {
        blog_id: id,
        text: paragraph.text
      }
    }).then(response => {
      console.log(response.data);
    });
  }

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
