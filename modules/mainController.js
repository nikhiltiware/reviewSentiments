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
            var reviewSentimentsArray = response.data;
            $scope.data = JSON.stringify(response.data);
            analyseReviews(reviewSentimentsArray.sentences_tone);
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

    var analyseReviews = function(reviewSentimentsArray) {
        var seperatedTones = {
            anger: [],
            disgust: [],
            fear: [],
            joy: [],
            sadness: [],
        };

        function segregateReviews(element, index, array) {
            if ( !! element.tone_categories[0]) {
                var tones = element.tone_categories[0].tones;
                var maxEmotion = tones.reduce(function(prev, curr) {
                    return prev.score > curr.score ? prev : curr;
                });
                seperatedTones[maxEmotion.tone_id].push(element);
            }

        }
        reviewSentimentsArray.forEach(segregateReviews);
        console.log(seperatedTones);
    }

    init();
});
