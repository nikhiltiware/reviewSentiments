reviewApp.controller('mainController', function($scope, $rootScope, $http, $stateParams, $state, $base64, watsonService) {
    $scope.welcome = "Nikhil";

    var getRatingDist = function() {
        var reqForMacy = {
            method: 'GET',
            headers: {
                'x-macys-webservice-client-id': 'hackapalooza'
            },
            Accept: 'application/json',
            url: 'http://api.macys.com/v3/catalog/reviews?productId=199462&numberOfReviewsRequested=5',
        };
        
        var auth = $base64.encode("8063a4e3-6e7f-460e-8234-bd8920dbf6ff:KdkZkPwKDnbN");
        var headers = {"Authorization": "Basic " + auth};
        var reqForWatson = {
            method: 'POST',
            headers: headers,
            url: 'https://gateway.watsonplatform.net/tone-analyzer/api/v3/tone?version=2016-05-19',
            data: {
                text: "I was hesitant to purchase this because I didn't think we'd use it enough.  I was wrong!  We love this mixer.  We also bought the food processor attachment - so glad we did.   My husband uses this more than I do!"
            }
        };
        //$scope.data = watsonService.getSentiments("nikhil");
        $http(reqForMacy).success(function(data) {
            $scope.data = data;
            console.log($scope.data);
        }).error(function(data) {
            $scope.data = data;
        });
    };

    getRatingDist();

});