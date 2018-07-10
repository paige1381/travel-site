const app = angular.module('travelSite', ['ngRoute']);

app.run(['$rootScope', function($rootScope) {
  $rootScope.$on('$routeChangeSuccess', function () {
    document.body.scrollTop = document.documentElement.scrollTop = 0;
  })
}])

app.value('blogURL', 'https://black-dog-travel-api.herokuapp.com/blogs/');
// app.value('blogURL', 'http://localhost:3000/blogs/');
app.value('contentURL', 'https://black-dog-travel-api.herokuapp.com/contents/');
// app.value('contentURL', 'http://localhost:3000/contents/');


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
  this.blog = {};

  blogService.getBlog(this.id).then(response => {
      this.blog = response.data;
      console.log(this.blog);
    }).catch(error => {
      console.log('error:', error);
    });

}]);

app.controller('CreateController', ['$http', 'blogURL', 'contentURL', function($http, blogURL, contentURL) {

  this.formData = {};
  this.imageMenu = false;
  this.imageType = null;
  this.imageNum = null;
  this.contents = [];
  this.feature_text = null;
  this.feature_image_1 = null;
  this.feature_image_2 = null;

  this.showImageMenu = () => {
    this.imageMenu = true;
  };

  this.addImages = () => {
    this.imageMenu = false;
    this.imageType = parseInt(this.imageType);

    switch(this.imageType) {
      case 0:
      case 1:
        this.imageNum = 1;
        break;
      case 2:
      case 3:
        this.imageNum = 2;
        break;
      case 4:
        this.imageNum = 3;
    }

    this.contents.push({
      image: 1,
      image_type: this.imageType,
      image_num: this.imageNum,
      images: []
    });

    for (let i = 0; i < this.imageNum; i++) {
      this.contents[this.contents.length - 1].images.push({
        url: null,
        form_order: i
      });
    }
    console.log(this.contents);
  }

  this.addParagraph = () => {
    this.contents.push({
      text: null,
      image: 0
    });
    console.log(this.contents);
  };

  this.findFeatureText = () => {
    for (let i = 0; i < this.contents.length; i++) {
      if (!this.contents[i].image) {
        this.feature_text = this.contents[i].text;
        return;
      }
    }
  }

  this.findFeatureImage1 = () => {
    console.log("findFeatureImage1");
    console.log(this.contents);
    for (let i = 0; i < this.contents.length; i++) {
      if (this.contents[i].image && this.contents[i].image_type === 0) {
        console.log(this.contents[i].images[0].url);
        this.feature_image_1 = this.contents[i].images[0].url;
        console.log(this.feature_image_1);
        return;
      }
    }
  }

  this.findFeatureImage2 = () => {
    console.log("findFeatureImage2");
    for (let i = 0; i < this.contents.length; i++) {
      if (this.contents[i].image && (this.contents[i].image_type === 1 || this.contents[i].image_type === 2)) {
        console.log(this.contents[i].images[0].url);
        this.feature_image_2 = this.contents[i].images[0].url;
        return;
      }
    }
  }


  this.removeContent = (index) => {
    this.contents.splice(index, 1);
  }

  this.clearForm = () => {
    this.formData = {};
    this.contents = [];
  }

  this.processForm = () => {
    console.log("start processForm");
    this.findFeatureText();
    this.findFeatureImage1();
    this.findFeatureImage2();
    $http({
      method: 'POST',
      url: blogURL,
      data: {
        title: this.formData.title,
        feature_text: this.feature_text,
        feature_image_1: this.feature_image_1,
        feature_image_2: this.feature_image_2
      }
    }).then(response => {
      console.log(response.data);
      for (let i = 0; i < this.contents.length; i++) {
        this.processContent(response.data.id, this.contents[i], i)
      };
      this.clearForm();
    })

  }

  this.processImages = (id, image) => {
    $http({
      method: 'POST',
      url: contentURL + id + '/images',
      data: {
        content_id: id,
        url: image.url,
        form_order: image.form_order
      }
    }).then(response => {
    });
  }

  this.processContent = (id, content, order) => {
    $http({
      method: 'POST',
      url: blogURL + id + '/contents',
      data: {
        blog_id: id,
        form_order: order,
        image: content.image,
        image_type: content.image_type,
        text: content.text,
        image_num: content.image_num
      }
    }).then(response => {
      if (response.data.image) {
        for (let i = 0; i < content.images.length; i++) {
          this.processImages(response.data.id, content.images[i]);
        };
      };
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
