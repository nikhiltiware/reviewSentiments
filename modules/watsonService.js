reviewApp.factory('watsonService', function($http, $base64) {

    var getSentiments = {
        async: function(review) {
            var auth = $base64.encode("8063a4e3-6e7f-460e-8234-bd8920dbf6ff:KdkZkPwKDnbN");
            var headers = {
                "Authorization": "Basic " + auth
            };
            var reqForWatson = {
                method: 'POST',
                headers: headers,
                url: 'https://gateway.watsonplatform.net/tone-analyzer/api/v3/tone?version=2016-05-19',
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