reviewApp.service('watsonService', function($http ,$base64) {
    
    this.getSentiments = function(review) {
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
    
    $http(reqForWatson).success(function(data) {
            return data;
            console.log(data);
        }).error(function(data) {
            return data;
        });
    };
  
});