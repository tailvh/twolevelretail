///////////////////////////////////////////
// load modules and wrap with app module //
///////////////////////////////////////////

define([
    ////////////////////
    // VENDOR DEFINES //
    ////////////////////
    'angular',
    'angular_route',
    'angular_resource',
    'angular_animate',
    'angular_sanitize',
    'angular_uirouter',
    'angular_uibootstrap',
    'angular_carousel',
    'angular_touch',
    'angular_treeview',
    'angular_upload',
    'angular_googlechart',
    'angular_easyfb',    
    'angular_text',
    'domReady',
    'underscore',
    'ngtable',    
    'ngtableexport',
    'ngloadingbar',

    ////////////////////
    // COMMON DEFINES //
    ////////////////////
    'common/directives/index',
    'common/filters/index',
    'common/services/index',
    'common/animations/index',
    
    /////////////////
    // APP MODULES //
    /////////////////
    'app/global/index',
    'app/auth/index',
    'app/default/index',
    'app/admin/index',

], function(angular) {
    'use strict';
    return angular.module('app', [
        ////////////////////
        // VENDOR MODULES //
        ////////////////////
        'ngRoute',
        'ngResource',
        'ngAnimate',
        'ngSanitize',
        'ngTouch',
        'ngTable',  
        'ngTableExport',      
        'ui.router',        
        'ui.bootstrap',        
        'chieffancypants.loadingBar',
        'angular-carousel',
        'angularTreeview',
        'angularFileUpload', 
        'textAngular',       
        'ezfb',
        'googlechart',

        ////////////////////
        // COMMON MODULES //
        ////////////////////        
        'app.filters',
        'app.services',
        'app.directives',

        /////////////////
        // APP MODULES //
        /////////////////
        'app.global',     // global controller, const, var
        'app.auth',       // auth this module use to auth , Oauth ...      
        'app.home',       // this home module display home, it with alot wiget will be added soon  DECLARE THE DEFAULT MODULE
        'app.product',    // product module , show for default 
        'app.dashboard',  // display dash board DECLARE THE ADMIN MODULE

        'app.adminproduct',
        'app.user',       // user module, show for admin  
        'app.order',
        'app.super',
        'app.report',
        'app.customer'
    ])
});