reviewApp.factory('macyService', function($http, $base64) {

    var getReviews = {
        async: function(productId, numberOfReviews) {
            var reqForMacy = {
                method: 'GET',
                headers: {
                    'x-macys-webservice-client-id': 'hackapalooza'
                },
                Accept: 'application/json',
                url: 'http://localhost:1337/api.macys.com/v3/catalog/reviews?productId='+productId+'&numberOfReviewsRequested='+numberOfReviews,
            };

            return $http(reqForMacy).success(function(data) {
                return data;
            }).error(function(data) {
                return data;
            });
        }
    };

    return getReviews;

});