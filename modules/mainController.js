reviewApp.controller('mainController', function($scope, $rootScope, $http, $stateParams, $state) {
  $scope.welcome = "Nikhil";
  var key = 'yy8gu4mqc8pnt67hxhy52jzq';
   $http.defaults.headers.common["Ocp-Apim-Subscription-Key"] = key;

    var getRatingDist = function() {
        var  req = {
         url: 'http://api.macys.com/v3/catalog/reviews?productId=199462&numberOfReviewsRequested=5',
            headers: 'x-macys-webservice-client-id: yy8gu4mqc8pnt67hxhy52jzq',
            
        }

        $http.get(url).success(function(data) {
            $scope.userRatingDist = data;
            console.log($scope.userRatingDist);
        }).error(function(data) {
            $scope.userRatingDist = data;
        });
    };

    getRatingDist();

});
