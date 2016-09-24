var reviewApp = angular.module('reviewApp', ['ui.router', 'ui.bootstrap', 'nvd3','checklist-model','ngAnimate']);

reviewApp.run(function($rootScope) {
    $rootScope.isHome = true;
});

