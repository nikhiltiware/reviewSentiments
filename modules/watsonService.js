reviewApp.factory('watsonService', function($http, $base64) {
    var getSentiments = {
        async: function(review) {

            var reqForWatson = {
                method: 'POST',
                url: 'http://38.110.19.50:3000/reviews',
                data: {
                    text: review
                }
            };

            return $http(reqForWatson).success(function(data) {
                return data;
            }).error(function(data) {
                return data;
            });
        }
    };

    return getSentiments;

});