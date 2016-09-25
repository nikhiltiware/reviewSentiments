reviewApp.controller('mainController', function($scope, $rootScope, $http, $stateParams, $state, $base64, watsonService, macyService) {

    var spinner;
    
    function loading(){
        var opts = {
  lines: 13 // The number of lines to draw
, length: 28 // The length of each line
, width: 14 // The line thickness
, radius: 42 // The radius of the inner circle
, scale: 1 // Scales overall size of the spinner
, corners: 1 // Corner roundness (0..1)
, color: '#000' // #rgb or #rrggbb or array of colors
, opacity: 0.25 // Opacity of the lines
, rotate: 0 // The rotation offset
, direction: 1 // 1: clockwise, -1: counterclockwise
, speed: 1 // Rounds per second
, trail: 60 // Afterglow percentage
, fps: 20 // Frames per second when using setTimeout() as a fallback for CSS
, zIndex: 2e9 // The z-index (defaults to 2000000000)
, className: 'spinner' // The CSS class to assign to the spinner
, top: '50%' // Top position relative to parent
, left: '50%' // Left position relative to parent
, shadow: false // Whether to render a shadow
, hwaccel: false // Whether to use hardware acceleration
, position: 'absolute' // Element positioning
}
var target = document.getElementById('containerID')
spinner = new Spinner(opts).spin(target);
    }
    
    
    
    var seperatedTones = {
        anger: [],
        disgust: [],
        fear: [],
        joy: [],
        sadness: [],
    };
    $scope.allTones = [];

    var aggregatedReviews = {
        anger: "",
        disgust: "",
        fear: "",
        joy: "",
        sadness: "",
    };

    var getURL = function() {
        chrome.tabs.query({
                active: true,
                windowId: chrome.windows.WINDOW_ID_CURRENT
            },
            function(array_of_Tabs) {
                console.log(array_of_Tabs[0].url);
                var url = array_of_Tabs[0].url;
                var name = 'ID';
                var paramValue;
                if (!url) url = window.location.href;
                name = name.replace(/[\[\]]/g, "\\$&");
                var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
                    results = regex.exec(url);
                if (!results) paramValue = null;
                if (!results[2]) paramValue = '';
                paramValue = decodeURIComponent(results[2].replace(/\+/g, " "));
                console.log(paramValue);
                init(paramValue);
            }
        );
    };

    var init = function(paramValue) {
        loading();
        getReviews(paramValue, 10);
    }

    var getReviews = function(productId, numberOfReviews) {
        macyService.async(productId, numberOfReviews).then(function(response) {
            console.log(response.data);
            var reviewsObject = response.data;
            $scope.productName = reviewsObject.productName;
            var combinedReviews = combineReview(reviewsObject.perReviewWrapper);
            //console.log(combinedReviews);
            getSentiments(combinedReviews);
        });

    };

    var getSentiments = function(review) {
        watsonService.async(review).then(function(response) {
            console.log(response.data);
            var reviewSentimentsArray = response.data;

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
        //$scope.data = JSON.stringify(seperatedTones);
        $scope.allTones = seperatedTones;
        processEmotionalResponse(seperatedTones);
        showVerdict();
        //drawGraph();
        getMax();
    }

    
    
    
    var globalSum = 0,
        totalAnger = 0,
        totalDisgust = 0,
        totalFear = 0,
        totalJoy = 0,
        totalSadness = 0;

    var processEmotionalResponse = function(jsonText) {
        var rootObj = jsonText;
        //loading();
        console.log(jsonText);
        //alert(rootObj);
        totalAnger = getEmotionObject(rootObj, "anger", 0)
        totalDisgust = getEmotionObject(rootObj, "disgust", 1);
        totalFear = getEmotionObject(rootObj, "fear", 2);
        totalJoy = getEmotionObject(rootObj, "joy", 3);
        totalSadness = getEmotionObject(rootObj, "sadness", 4);
        displayPercent((totalAnger / globalSum), "anger");
        displayPercent((totalDisgust / globalSum), "disgust");
        displayPercent((totalFear / globalSum), "fear");
        displayPercent((totalJoy / globalSum), "joy");
        displayPercent((totalSadness / globalSum), "sadness");

    }

    var getEmotionObject = function(rootObj, name, id) {
        var totalScore = 0;
        var emotionObject = rootObj[name];
        //alert(emotionObject.length);
        for (var i = 0; i < emotionObject.length; i++) {
            var e = emotionObject[i];
            var tone_categories = e["tone_categories"];
            //alert("tone_categories :"+tone_categories.length);
            var tone_array = tone_categories[0]["tones"];
            var k = id;
            if (tone_array[k]["tone_id"] == name) {
                totalScore += tone_array[k]["score"];

            } else
                k++;
        }

        globalSum += totalScore;
        //alert(totalScore+" "+globalSum);
        return totalScore;

    }

    
    
    var displayPercent = function(percent, tone_id) {
        spinner.stop();
        var result_tabs = $('.result-tabs');
        if (result_tabs.css('visibility') == 'hidden') {
            result_tabs.css('visibility', 'visible');
        }

        var percent_results = $('.percent-results');
        if (percent_results.css('visibility') == 'hidden') {
            percent_results.css('visibility', 'visible');
        }

        var progressDiv = $('.progressDiv');
        if (progressDiv.css('visibility') == 'hidden') {
            progressDiv.css('visibility', 'visible');
        }

        var color, id;
        if (tone_id == 'anger') {
            color = '#d80c0c';
            id = 1;
        } else if (tone_id == 'disgust') {
            color = '#19a303';
            id = 2;
        } else if (tone_id == 'fear') {
            color = '#a507b8';
            id = 3;
        } else if (tone_id == 'joy') {
            color = '#FFEA82';
            id = 4;
        } else {
            color = "#08b1c9";
            id = 5;
        }

        updateProgress(id, 0, percent, color);

    }

    var updateProgress = function(id, val, percent, color) {
        //alert(percent+" "+(percent/100));

        $('#percent-' + id).text(Math.round(percent * 100) + ' %'); //Math.round(percent * 100) + ' %')
        var bar = new ProgressBar.Line('#progressbar-' + id, {
            strokeWidth: 4,
            easing: 'easeInOut',
            duration: 3000,
            color: color,
            trailColor: '#eee',
            trailWidth: 1,
            svgStyle: {
                width: '100%',
                height: '100%'
            },
            text: {
                style: {
                    // Text color.
                    // Default: same as stroke color (options.color)
                    color: '#999',
                    position: 'absolute',
                    right: '0',
                    top: '30px',
                    padding: 0,
                    margin: 0,
                    transform: null
                },
                autoStyleContainer: false
            },
            from: {
                color: '#FFEA82'
            },
            to: {
                color: '#ED6A5A'
            },
            step: (state, bar) => {
                bar.setText(Math.round(bar.value() * 100) + ' %');

            }

        });

        bar.animate(percent);

    }
    
    
    function showVerdict(){
        
        var ctx = document.getElementById("myChart").getContext("2d");
        var pieData = {
                    labels: [
                        "Anger",
                        "Disgust",
                        "Fear",
                        "Joy",
                        "Sadness"
                    ],
                    datasets: [
                        {   
                            data: [totalAnger, totalDisgust, totalFear,totalJoy,totalSadness],
                            backgroundColor: [
                                "#d80c0c",
                                "#19a303",
                                "#a507b8",
                                "#FFEA82",
                                "#08b1c9"
                            ],
                            hoverBackgroundColor: [
                                "#FF6384",
                                "#36A2EB",
                                "#FFCE56",
                                "#FFCE56",
                                "#FFCE56",

                            ]
                        }]
                    };
        var myChart = new Chart(ctx, {
                type: 'pie',
                data: pieData
            
        });
        
    }
    
    function getMax(){
        var toneScores = [totalAnger, totalDisgust, totalFear,totalJoy,totalSadness];
        var toneIndex = toneScores.indexOf(Math.max(totalAnger, totalDisgust, totalFear,totalJoy,totalSadness));
        var emojies = ['http://emojidictionary.emojifoundation.com/img/emoji733.jpg','http://emojidictionary.emojifoundation.com/img/emoji718.jpg','http://emojidictionary.emojifoundation.com/img/emoji723.jpg','http://emojidictionary.emojifoundation.com/img/emoji50.jpg','http://emojidictionary.emojifoundation.com/img/emoji731.jpg'];
        $scope.emoji = emojies[toneIndex];
       
    }
    
    
    
    var drawGraph = function() {
          $scope.graphData = [{emotion: "anger",
                              value: totalAnger},
                             {emotion: "joy",
                              value: totalJoy}];

            $scope.graphOptions = {
                chart: {
                    type: 'pieChart',
                    height: 500,
                    width: 800,
                    x: function(d) {
                        return d.emotion;
                    },
                    y: function(d) {
                        return d.value;
                    },
                    showLabels: true,
                    duration: 2000,
                    labelThreshold: 0.01,
                    labelSunbeamLayout: true,
                    legend: {
                        margin: {
                            top: 5,
                            right: 35,
                            bottom: 5,
                            left: 0
                        }
                    },
                    legendPosition: "right"
                }
            };
    }
    
    getURL();
    
    
    
    
    
    

});