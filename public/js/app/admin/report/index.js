///////////////////
// REPORT MODULE //
///////////////////
define(['angular'], function (ng) {
    'use strict';

    return ng.module('app.report', ['ui.router.state', 'ngAnimate'])
        
        ///////////////////////
        // ADMIN MAIN MODULE //
        ///////////////////////
        .config(['$stateProvider', function($stateProvider ) {
            $stateProvider
            .state( 'admin.report', {
                url:'/report',
                views: {
                    'admin': {
                        templateUrl: 'js/app/admin/dashboard/admin.dashboard.html',
                        //controller: 'HomeController'
                    }
                }                
            })
            .state('admin.report.view', {
                url:'/view',
                views: {
                    'dashboard': {
                        templateUrl: 'js/app/admin/dashboard/admin.dashboard.view.html',
                    }
                }
            })
        }])
});