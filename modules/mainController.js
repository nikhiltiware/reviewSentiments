reviewApp.controller('mainController', function($scope, $rootScope, $http, $stateParams, $state, $base64, watsonService, macyService) {


    var init = function() {
        getReviews(2334186, 5);
    }
    var getReviews = function(productId, numberOfReviews) {
        macyService.async(productId, numberOfReviews).then(function(response) {
            console.log(response.data);
            var reviewsObject = response.data;
            var combinedReviews = combineReview(reviewsObject.perReviewWrapper);
            console.log(combinedReviews);
            getSentiments(combinedReviews);
        });

    };

    var getSentiments = function(review) {
        watsonService.async(review).then(function(response) {
            console.log(response.data);
            $scope.data = JSON.stringify(response.data);
        });
    };

    var combineReview = function(reviewsArr) {
        var finalString = "";
        function joinReviewDesc(element, index, array) {
            finalString = finalString + element.reviewDesc;
        }

        reviewsArr.forEach(joinReviewDesc);
        return finalString;
    };

    init();
});