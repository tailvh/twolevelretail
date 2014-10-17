// configure RequireJS
// prefer named modules to long paths, especially for version
// or 3rd party libraries

require.config({
    baseUrl: 'js', 
    paths: {
		angular: 'bower_components/angular/angular',
        angular_module_link: 'bower_components/angular/angular',
		angular_route: 'bower_components/angular/angular-route',
		angular_resource: 'bower_components/angular/angular-resource',
		angular_animate: 'bower_components/angular/angular-animate',
		angular_sanitize: 'bower_components/angular/angular-sanitize',
        angular_uirouter: 'bower_components/angular-ui-router/angular-ui-router',
        angular_uibootstrap: 'bower_components/angular-ui-bootstrap/ui-bootstrap-tpls-0.10.0.min',
        angular_touch: 'bower_components/angular-touch/angular-touch.min',
        angular_carousel: 'bower_components/angular-carousel/angular-carousel',  
        angular_treeview: 'bower_components/angular-treeview/angular.treeview',      
        angular_upload: 'bower_components/angular-upload/angular-file-upload.min', 
        angular_googlechart: 'bower_components/angular-google-chart/ng-google-chart',      
        angular_easyfb: 'bower_components/angular-easyfb/angular-easyfb.min',         
        angular_text: 'bower_components/angular-text/textAngular.min',
		domReady: 'bower_components/requirejs-domready/domReady',
		underscore: 'bower_components/underscore/underscore',
		ngtable: 'bower_components/ng-table/ng-table',        
        ngtableexport: 'bower_components/ng-table/ng-table-export',
		ngloadingbar: 'bower_components/ng-loading-bar/loading-bar.min'
	},
	
	// for libs that either do not support AMD out of the box, or 
	// require some fine tuning to dependency mgt'	
	shim: {
		angular: {
			exports: 'angular'
		},
		angular_route: {
			deps: ['angular']
		},
		angular_resource: {
			deps: ['angular']
		},
		angular_animate: {
			deps: ['angular']
		},
		angular_sanitize: {
			deps: ['angular']
		},
        angular_uirouter: {
            deps: ['angular']
        },
        angular_uibootstrap: {
            deps: ['angular']
        },
        angular_touch: {
        	deps: ['angular']
        },
        angular_carousel: {
        	deps: ['angular']
        },
        angular_treeview: {
        	deps: ['angular']
        },
        angular_upload: {
        	deps: ['angular']
        },
        angular_easyfb: {
            deps: ['angular']
        },
        angular_googlechart: {
            deps: ['angular']
        },
        angular_text: {
            deps: ['angular']
        },
        ngtable: {
            deps: ['angular']
        },
        ngtableexport: {
            deps: ['angular']
        },
        ngloadingbar: {
        	deps: ['angular']
        }    
	},
})

require([
    'require',
    'angular',
    'routes',
    'app',
], function(require, ng, routes, app){
    'use strict';

    //require(['domReady!'], function (document) {
    ng.bootstrap(document, [app.name]);
    //});
});