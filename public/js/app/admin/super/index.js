//////////////////
// SUPER MODULE //
//////////////////
define(['angular'], function (ng) {
    'use strict';

    return ng.module('app.super', ['ui.router.state', 'ngAnimate'])
        
        ///////////////////////
        // ADMIN MAIN MODULE //
        ///////////////////////
        .config(['$stateProvider', function ($stateProvider ) {
            $stateProvider
            .state( 'admin.super', {
                url:'/super',
                views: {
                    'admin': {
                        templateUrl: 'js/app/admin/super/admin.super.html',                        
                    }
                }                
            })
            .state('admin.super.page', {
                url:'/page',
                views: {
                    'adminsuper': {
                        templateUrl: 'js/app/admin/super/admin.super.page.html',
                        controller: 'AdminSuperPageController',
                        resolve: {       
                            pages: ['PageService', function(PageService) {
                                return PageService.getPages();
                            }]                                         
                        }
                    }
                }
            }) 
            .state('admin.super.view', {
                url:'/view',
                views: {
                    'adminsuper': {
                        templateUrl: 'js/app/admin/super/admin.super.view.html',
                        controller: 'AdminSuperViewController',
                        resolve: {
                            orderDetails: ['$stateParams', 'OrderService', function($stateParams, OrderService) {
                                return OrderService.getAllOrderDetailsNeedAccept();
                            }],   
                            orderDetailsWaitting: ['$stateParams', 'OrderService', function($stateParams, OrderService) {
                                return OrderService.getOrderDetailsWaitting();
                            }],
                            /*orderDetailsCanceled: ['$stateParams', 'OrderService', function($stateParams, OrderService) {
                                return OrderService.getAllOrderDetailsCanceled();
                            }]*/
                        }
                    }
                }
            })            
            .state('admin.super.accept', {
                url:'/accept',
                views: {
                    'adminsuper': {
                        templateUrl: 'js/app/admin/super/admin.super.accept.html',
                        controller: 'AdminSuperAcceptController',
                        resolve: {
                            orderDetails: ['$stateParams', 'OrderService', function($stateParams, OrderService) {
                                return OrderService.getInmonthOrderDetailsAccepted();
                            }]
                            //allOrderDetails: ['$stateParams', 'OrderService', function($stateParams, OrderService) {
                            //    return OrderService.getOrderDetailsAccepted();
                            //}]
                        }
                    }
                }
            })
            .state('admin.super.produce', {
                url: '/produce',
                views: {
                    'adminsuper': {
                        templateUrl: 'js/app/admin/super/admin.super.produce.html',
                        controller: 'AdminSuperProduceController',
                        resolve: {
                            orderDetails: ['$stateParams', 'OrderService', function($stateParams, OrderService) {
                                return OrderService.getAllOrderDetailsNeedProduce();
                            }]
                        }
                    }
                }
            })
            .state('admin.super.export', {
                url: '/export/{day:[0-9]{1,4}}/{month:[0-9]{1,4}}/{year:[0-9]{1,4}}/{range:[0-9]{1,4}}',
                views: {
                    'adminsuper': {
                        templateUrl: 'js/app/admin/super/admin.super.export.html',
                        controller: 'AdminSuperExportController',
                        resolve: {
                            orderDetails: ['$stateParams', 'OrderService', function($stateParams, OrderService) {
                                return OrderService.getAllOrderDetailsExport($stateParams.day, $stateParams.month, $stateParams.year, $stateParams.range);
                            }]
                        }
                    }
                }
            })
        }])
        .controller('AdminSuperPageController', ['$scope', '$rootScope', '$filter', 'PageService', 'pages', 'ngTableParams',
            function($scope, $rootScope, $filter, PageService, pages, ngTableParams){
                $scope.pages = pages.data;
                $scope.page = {};

                $scope.data =  pages.data;   
                $scope.datalength = pages.data.length; 

                $scope.tableParams = new ngTableParams({
                    page: 1,
                    count: 10,
                    sorting: {
                        created_at: 'desc'     // initial sorting
                    } 
                },{
                    total: $scope.datalength,
                    getData: function($defer, params) {
                        if(params.orderBy().length) {
                            if(params.sorting()) {
                                var orderedData = $filter('orderBy')($scope.data, params.orderBy());
                                $scope.data = orderedData;
                            }
                            else
                                var orderedData = $scope.data;
                        }
                        var orderedData = $scope.data;

                        params.total(orderedData.length); 
                        $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                    }
                });

                $scope.ok = function(){                    
                    PageService.postPage($scope.page).success(function(data){
                            if(data.success) {                                     
                                $rootScope.alerts.push({type: 'success', msg: 'Thao tác thành công'});
                                if($rootScope.alerts.length > 1) $rootScope.alerts.splice(0, 1);                                                                                     
                                PageService.getPages().success(function(data){
                                        $scope.data =  data;   
                                        $scope.datalength = data.length;
                                        $scope.tableParams.reload();   
                                })
                            }
                            else {
                                $rootScope.alerts.push({type: 'danger', msg: 'Thao tác chưa thành công'});
                                if($rootScope.alerts.length > 1) $rootScope.alerts.splice(0, 1);
                            }
                    })                    
                }

                $scope.edit = function(page) {
                    var tempPage = page;  
                    $scope.page.id      = tempPage.id;
                    $scope.page.name    = tempPage.new_name;
                    $scope.page.htmlContent = tempPage.new_content;
                    $scope.page.user_id     = tempPage.user_id;         
                    $scope.page.new_codename = tempPage.new_codename;           
                }
                $scope.delete = function(page) {
                    var id = page.id;
                    PageService.unusePage(id).success(function(data) {
                        if(data.success) {
                            $rootScope.alerts.push({type: 'success', msg: 'Xóa thành công'});
                                if($rootScope.alerts.length > 1) $rootScope.alerts.splice(0, 1);   
                            $scope.data.splice($scope.data.indexOf(page), 1);                       
                            $scope.datalength--;
                            $scope.tableParams.reload();
                        }
                    });
                }
                $scope.clearAll = function(){
                    $scope.page.id = null;
                    $scope.page.user_id = null;
                    $scope.page.new_codename = null;
                    $scope.page.name = null;
                    $scope.page.htmlContent = null;
                    $scope.pageForm.$setPristine();
                }
            }]
        )
        .controller('AdminSuperViewController', ['$scope', '$rootScope', '$filter', 'ngTableParams', 'OrderService', 'orderDetails', /*'orderDetailsCanceled',*/ 'orderDetailsWaitting',
            function($scope, $rootScope, $filter, ngTableParams, OrderService, orderDetails, /*orderDetailsCanceled,*/ orderDetailsWaitting){
                $scope.data =  orderDetails.data;   
                $scope.datalength = orderDetails.data.length;  

                $scope.tableParams = new ngTableParams({
                    page: 1,
                    count: 10
                },{
                    total: $scope.datalength,
                    getData: function($defer, params) {
                        if(params.orderBy().length) {
                            if(params.sorting()) {
                                var orderedData = $filter('orderBy')($scope.data, params.orderBy());
                                $scope.data = orderedData;
                            }
                            else
                                var orderedData = $scope.data;
                        }
                        var orderedData = $scope.data;

                        params.total(orderedData.length); 
                        $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                    }
                });

                // stock of tree
                /*
                $scope.data2 =  orderDetailsCanceled.data;   
                $scope.datalength2 = orderDetailsCanceled.data.length; 

                $scope.tableParams2 = new ngTableParams({
                    page: 1,
                    count: 5,
                    sorting: {
                        created_at: 'desc'     // initial sorting
                    }
                },{
                    total: $scope.datalength2,
                    getData: function($defer, params) {                    
                        if(params.orderBy().length) {
                            if(params.sorting()) {
                                var orderedData = $filter('orderBy')($scope.data2, params.orderBy());
                                $scope.data2 = orderedData;
                            }
                            else
                                var orderedData = $scope.data2;
                        }
                        else
                            var orderedData = $scope.data2;

                        params.total(orderedData.length); 
                        $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                    }
                });
                */
                // stock of tree
                $scope.data3 =  orderDetailsWaitting.data;   
                $scope.datalength3 = orderDetailsWaitting.data.length; 

                $scope.tableParams3 = new ngTableParams({
                    page: 1,
                    count: 5,
                    sorting: {
                        created_at: 'desc'     // initial sorting
                    }
                },{
                    total: $scope.datalength3,
                    getData: function($defer, params) {                    
                        if(params.orderBy().length) {
                            if(params.sorting()) {
                                var orderedData = $filter('orderBy')($scope.data3, params.orderBy());
                                $scope.data3 = orderedData;
                            }
                            else
                                var orderedData = $scope.data2;
                        }
                        else
                            var orderedData = $scope.data2;

                        params.total(orderedData.length); 
                        $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                    }
                });

                // ACCEPT function to cancel or get the order
                $scope.orderDetailAccept =  function(orderdetail) { 
                    // decore first
                    // delete in table data array
                    if($scope.data.indexOf(orderdetail) !== -1) {
                        $scope.data.splice($scope.data.indexOf(orderdetail), 1);                       
                        $scope.datalength--;
                        $scope.tableParams.reload();
                    }

                    // asyn to server
                    var orderDetail = OrderService.actOrderDetailAccept(orderdetail.id);
                }
                // ALLOW function to cancel or get the order
                $scope.orderDetailAllow =  function(orderdetail) { 
                    // decore first
                    // delete in table data array
                    if($scope.data3.indexOf(orderdetail) !== -1) {
                        $scope.data3.splice($scope.data3.indexOf(orderdetail), 1);                       
                        $scope.datalength3--;
                        $scope.tableParams3.reload();
                    }

                    // waitting table action
                    $scope.data.push(orderdetail);
                    $scope.datalength++;
                    $scope.tableParams.reload();
                    // asyn to server
                    var orderDetail = OrderService.actOrderDetailAllow(orderdetail.id);
                }
                // WAIT function to cancel or get the order
                $scope.orderDetailNotAccept =  function(orderdetail) { 
                    // decore first
                    // delete in table data array
                    if($scope.data.indexOf(orderdetail) !== -1) {
                        $scope.data.splice($scope.data.indexOf(orderdetail), 1);                       
                        $scope.datalength--;
                        $scope.tableParams.reload();
                    }

                    // waitting table action
                    $scope.data3.push(orderdetail);
                    $scope.datalength3++;
                    $scope.tableParams3.reload();
                    // asyn to server
                    var orderDetail = OrderService.actOrderDetailNotAccept(orderdetail.id);
                }
                // CANCEL function to cancel or get the order
                $scope.orderDetailsCancel =  function(orderdetail) { 
                    // decore first
                    // delete in table data array
                    if($scope.data.indexOf(orderdetail) !== -1) {
                        $scope.data.splice($scope.data.indexOf(orderdetail), 1);                       
                        $scope.datalength--;
                        $scope.tableParams.reload();
                    }

                    // waitting table action
                    if($scope.data3.indexOf(orderdetail) !== -1) {
                        $scope.data3.splice($scope.data3.indexOf(orderdetail), 1);                       
                        $scope.datalength3--;
                        $scope.tableParams3.reload();
                    }
                    // asyn to server
                    var orderDetail = OrderService.actOrderDetailCancel(orderdetail.id);
                }
            }
        ])
        .controller('AdminSuperAcceptController', ['$scope', '$rootScope', '$filter', 'ngTableParams', 'OrderService', 'orderDetails',
            function($scope, $rootScope, $filter, ngTableParams, OrderService, orderDetails){
                $scope.data =  orderDetails.data;   
                $scope.datalength = orderDetails.data.length; 

                $scope.tableParams = new ngTableParams({
                    page: 1,
                    count: 10
                },{
                    total: $scope.datalength,
                    getData: function($defer, params) {
                        if(params.orderBy().length) {
                            if(params.sorting()) {
                                var orderedData = $filter('orderBy')($scope.data, params.orderBy());
                                $scope.data = orderedData;
                            }
                            else
                                var orderedData = $scope.data;
                        }
                        var orderedData = $scope.data;

                        params.total(orderedData.length); 
                        $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                    }
                });

                // function to cancel or get the order
                $scope.orderDetailAccept =  function(orderdetail) { 
                    // decore first
                    // delete in table data array
                    $scope.data.splice($scope.data.indexOf(orderdetail), 1);                       
                    $scope.datalength--;
                    $scope.tableParams.reload();
                    // asyn to server
                    var orderDetail = OrderService.actOrderDetailAccept(orderdetail.id);
                }
            }
        ])
        .controller('AdminSuperProduceController', ['$scope', '$rootScope', '$filter', 'ngTableParams', 'OrderService', 'orderDetails',
            function($scope, $rootScope, $filter, ngTableParams, OrderService, orderDetails){
                $scope.data =  orderDetails.data;   
                $scope.datalength = orderDetails.data.length; 

                $scope.tableParams = new ngTableParams({
                    page: 1,
                    count: 10
                },{
                    total: $scope.datalength,
                    getData: function($defer, params) {
                        if(params.orderBy().length) {
                            if(params.sorting()) {
                                var orderedData = $filter('orderBy')($scope.data, params.orderBy());
                                $scope.data = orderedData;
                            }
                            else
                                var orderedData = $scope.data;
                        }
                        var orderedData = $scope.data;

                        params.total(orderedData.length); 
                        $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                    }
                });

                // function to cancel or get the order
                $scope.orderDetailProduce =  function(orderdetail) { 
                    // decore first
                    // delete in table data array
                    $scope.data.splice($scope.data.indexOf(orderdetail), 1);                       
                    $scope.datalength--;
                    $scope.tableParams.reload();
                    // asyn to server
                    var orderDetail = OrderService.actOrderDetailProduce(orderdetail.id);
                }
            }
        ])
        .controller('AdminSuperExportController', ['$scope', '$rootScope', '$filter', 'ngTableParams', 'OrderService', 'orderDetails', '$sce',
            function($scope, $rootScope, $filter, ngTableParams, OrderService, orderDetails, $sce){
                $scope.data =  orderDetails.data;   
                $scope.sizeData = {};
                $scope.datalength = orderDetails.data.length; 

                $scope.tableParams = new ngTableParams({
                    page: 1,
                    count: 10000,
                    sorting: {
                        product_picture: 'desc'     // initial sorting
                    }
                },{
                    total: $scope.datalength,
                    getData: function($defer, params) {
                        if(params.orderBy().length) {
                            if(params.sorting()) {
                                var orderedData = $filter('orderBy')($scope.data, params.orderBy());
                                $scope.data = orderedData;
                            }
                            else
                                var orderedData = $scope.data;
                        }
                        var orderedData = $scope.data;

                        params.total(orderedData.length); 
                        $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                    }
                });

                // foreach and count the number products of SIZE
                for (var index = 0; index < $scope.datalength; ++index) {
                    if(!$scope.sizeData[$scope.data[index].product_id] || typeof $scope.sizeData[$scope.data[index].product_id] === 'undefined') {
                        $scope.sizeData[$scope.data[index].product_id] = {};
                        $scope.sizeData[$scope.data[index].product_id]['pic'] = $scope.data[index].product_picture;
                        $scope.sizeData[$scope.data[index].product_id]['nam'] = $scope.data[index].product_name;
                        $scope.sizeData[$scope.data[index].product_id]['des'] = $scope.data[index].product_description;
                        $scope.sizeData[$scope.data[index].product_id][$scope.data[index].product_size] = 0;
                    }

                    if(isNaN($scope.sizeData[$scope.data[index].product_id][$scope.data[index].product_size])) {
                        $scope.sizeData[$scope.data[index].product_id][$scope.data[index].product_size] = 0;
                    }

                    $scope.sizeData[$scope.data[index].product_id]['num'] = $scope.data[index].product_count;
                    $scope.sizeData[$scope.data[index].product_id][$scope.data[index].product_size] += $scope.sizeData[$scope.data[index].product_id]['num'];
                }

                console.log($scope.sizeData);
            }
        ])
});