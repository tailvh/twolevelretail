    //////////////////
// ORDER MODULE //
//////////////////
define(['angular'], function (ng) {
    'use strict';

    return ng.module('app.order', ['ui.router.state', 'ngAnimate', 'ngTable', 'ui.router'])
                
        .config(['$stateProvider', function ($stateProvider ) {            
            $stateProvider            
            .state( 'admin.order', {
                url:'/order',
                views:
                {
                    'admin': 
                    {
                        templateUrl: 'js/app/admin/order/admin.order.html',                        
                    }
                }
            })     
            .state( 'admin.order.view', {
                url:'/view/{page:[0-9]{1,4}}',
                views:
                {
                    'adminorder':
                    {
                        templateUrl: 'js/app/admin/order/admin.order.view.html',                        
                        controller: 'AdminOrderViewController',
                        resolve: {
                            products: ['ProductService', '$stateParams', 'hotConst', function(ProductService, $stateParams, hotConst) {    
                                return ProductService.getProducts(0, $stateParams.page, 0, 1);  //cid, page, hot, active
                            }],
                            orderdetails: ['$stateParams', 'OrderService', function($stateParams, OrderService) {
                                return OrderService.getOrderDetails();
                            }]                           
                        }
                    }
                }
            })  
            .state( 'admin.order.sell', {
                url:'/sell',
                views:
                {
                    'adminorder':
                    {
                        templateUrl: 'js/app/admin/order/admin.order.sell.html',
                        controller: 'AdminOrderSellController',
                        resolve: {
                            stock: ['OrderService', function(OrderService) {
                                return OrderService.getStock();
                            }],
                            stocktree: ['OrderService', function(OrderService) {
                                return OrderService.getStocktree();
                            }]
                        }
                    }
                }
            })    
        }])
        .controller('AdminOrderViewController', ['$scope', '$rootScope', '$filter', '$state', 'OrderService', 'ngTableParams', 'products', 'orderdetails', 
            function($scope, $rootScope, $filter, $state, OrderService, ngTableParams, products, orderdetails) {
                $scope.products = products.data.products;
                
                // order waiting ...
                $scope.data =  orderdetails.data;   
                $scope.datalength = orderdetails.data.length; 

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
                        else
                            var orderedData = $scope.data;

                        params.total(orderedData.length); 
                        $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                    }
                });

                $scope.htmlImageTooltip = function(image) {
                    var htmlTooltip = "<img width='180' height='200' src='assets/img/images/resized/product/resized-"+image+"'>";    
                    return htmlTooltip;
                }
                // function to cancel or get the order
                $scope.orderDetailAction =  function(orderdetail) {
                    // we decore first after we asyn to server
                    // delete in table data array
                    $scope.data.splice($scope.data.indexOf(orderdetail), 1);                       
                    $scope.datalength--;
                    $scope.tableParams.reload();
                    // asyn to server
                    OrderService.actOrderDetail(orderdetail.id);
                }

                $rootScope.currentPage = products.data.currentPage;
                $rootScope.numberRow = products.data.numberRow;              
            }
        ])
        .controller('OrderAddModalInstanceCtrl', ['$scope', '$rootScope', '$modalInstance', '$state', 'SessionService', 'OrderService', 'items', 'product',
            function($scope, $rootScope, $modalInstance, $state, SessionService, OrderService, items, product){                                    
                // array check bonus
                var arrayBonus = [0, 0, 0, 0];            
                // size iter : 0 => sizeS, 1 => sizeM, 2 => sizeL
                var sizeIter = 0;    
                var arraySize = [[82, 64, 86, 85], [86, 68, 90, 85], [90, 72, 94, 85]];
                $scope.items = items;

                // default values            
                $scope.product = product; 
                $scope.product.quantity = 1;    
                $scope.product.address  = '';    
                $scope.product.note     = '';
                $scope.product.arrSize  = arraySize[sizeIter].slice();
                $scope.product.userId   = SessionService.get('userId');            
                $scope.product.size     = $scope.items[0];
                $scope.addmoney         = 0;
                
                // handle buttons on dialog modal
                $scope.ok = function () {                                            
                    // orderService work low job                                
                    $modalInstance.close($scope.product);
                };
                $scope.cancel = function () {               
                    $modalInstance.close(false);
                };
                $scope.sizeChange = function(size) {                
                    switch(size) {                    
                        case 'S': sizeIter = 0; $scope.product.arrSize = arraySize[sizeIter].slice(); break;                    
                        case 'M': sizeIter = 1; $scope.product.arrSize = arraySize[sizeIter].slice(); break;
                        case 'L': sizeIter = 2; $scope.product.arrSize = arraySize[sizeIter].slice(); break;                    
                    }                

                    $scope.addmoney = 0;
                    setAll(arrayBonus, 0);
                };           
                $scope.sizeDetailChange = function(iter) {                
                    // if change size difference to orginal size              
                    if($scope.product.arrSize[iter] != arraySize[sizeIter][iter]) {
                        if(!arrayBonus[iter]) {                     
                            if(iter < 3) $scope.addmoney += 15000;
                            else         $scope.addmoney += 50000;    
                            arrayBonus[iter] = 1;                                
                        }
                    }
                    else{
                        if(arrayBonus[iter]) {
                            if(iter < 3) $scope.addmoney -= 15000;
                            else         $scope.addmoney -= 50000;
                            arrayBonus[iter] = 0;
                        }
                    }
                };
            }
        ])
        .controller('ModalOrderAddCtrl', ['$scope', '$rootScope', '$modal', '$log', 'OrderService',
            function($scope, $rootScope, $modal, $log, OrderService) {
                $scope.items = ['S', 'M', 'L'];

                $scope.open = function ($index) {
                    var product = $scope.$parent.products[$index];

                    var modalInstance = $modal.open({
                      templateUrl: 'orderAddModal.html',
                      controller: 'OrderAddModalInstanceCtrl',
                      resolve: {
                        product: function() {
                          return product;
                        }, // resolve product; 
                        items: function () {
                          return $scope.items;
                        }
                      }
                    });
                    
                    modalInstance.result.then(function(data) {
                        if(data) {                
                            OrderService.postOrder(data).success(function(data){      
                                if(data.success) {                                     
                                    $rootScope.alerts.push({type: 'success', msg: 'Đã thêm đơn hàng thành công'});
                                    if($rootScope.alerts.length > 1) $rootScope.alerts.splice(0, 1);                                
                                    // add to table data array and reload                                 
                                    $scope.$parent.data.unshift(data);                                                        
                                    $scope.$parent.datalength++; 
                                    $scope.$parent.tableParams.reload();                     
                                }
                                else {
                                    $rootScope.alerts.push({type: 'danger', msg: 'Thêm đơn hàng chưa thành công'});
                                    if($rootScope.alerts.length > 1) $rootScope.alerts.splice(0, 1);
                                }
                            });                        
                        }
                    });
                };
            }
        ])
        .controller('AdminOrderSellController', ['$scope','$rootScope', '$modal', '$log', '$filter', 'ngTableParams', 'OrderService', 'stock', 'stocktree',
            function($scope, $rootScope, $modal, $log, $filter, ngTableParams, OrderService, stock, stocktree){
                // order waiting ...
                $scope.data =  stock.data;   
                $scope.datalength = stock.data.length; 

                $scope.tableParams = new ngTableParams({
                    page: 1,
                    count: 5,
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
                        else
                            var orderedData = $scope.data;

                        params.total(orderedData.length); 
                        $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                    }
                });

                // stock of tree
                $scope.data2 =  stocktree.data;   
                $scope.datalength2 = stocktree.data.length; 

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

                $scope.htmlImageTooltip = function(image) {
                    var htmlTooltip = "<img width='180' height='200' src='assets/img/images/resized/product/resized-"+image+"'>";    
                    return htmlTooltip;
                }
                // function to show remain stock need to help , you only can remain your stock
                $scope.remain =  function(stock) {
                    // recreate table, make table show right value              
                    $scope.data[$scope.data.indexOf(stock)].is_old = 1;                
                    // asyn to server
                    OrderService.remainStock(stock.id);
                }

                $scope.open = function (stock, key) {

                    var modalInstance = $modal.open({
                      templateUrl: 'orderSellModal.html',
                      controller: 'OrderSellModalInstanceCtrl',
                      resolve: {
                            stock: function() { 
                                return stock;
                            }
                      }
                    });
                    
                    modalInstance.result.then(function(data) {
                        if(data) {                
                            if(data.success) {                                     
                                $rootScope.alerts.push({type: 'success', msg: 'Đã bán hàng thành công'});
                                if($rootScope.alerts.length > 1) $rootScope.alerts.splice(0, 1);
                                // decor first and
                                if(data.sellQuantity >= $scope.data[$scope.data.indexOf(stock)].stock_remain) {    
                                        $scope.data.splice($scope.data.indexOf(stock), 1);                       
                                        $scope.datalength--;
                                    }  
                                    else {
                                        $scope.data[$scope.data.indexOf(stock)].stock_remain -= data.sellQuantity;
                                }
                                $scope.tableParams.reload(); 
                                // async to server later
                                OrderService.sellStock(data).success(function(response){  
                                })                    
                                // add to table data array and reload                                                    
                            }
                            else {
                                $rootScope.alerts.push({type: 'danger', msg: 'Bán hàng chưa thành công'});
                                if($rootScope.alerts.length > 1) $rootScope.alerts.splice(0, 1);
                            }                
                        }
                    });
                };
            }
        ])
        .controller('OrderSellModalInstanceCtrl', ['$scope', '$rootScope', '$modalInstance', '$state', 'SessionService', 'OrderService', 'stock',
            function($scope, $rootScope, $modalInstance, $state, SessionService, OrderService, stock){                                    
                $scope.stock = stock;
                $scope.formdata = {}; 
                $scope.formdata.sellQuantity = stock.stock_remain;
                $scope.formdata.shipMoney = 0;
                $scope.formdata.customerName = 'khách hàng';
                // handle buttons on dialog modal
                $scope.ok = function () {                                
                    // orderService work low job           
                    $scope.formdata.product_id = $scope.stock.product_id; 
                    $scope.formdata.id = $scope.stock.id; 
                    $scope.formdata.order_bonus = $scope.stock.order_bonus;  
                    $scope.formdata.success = true;        
                    $modalInstance.close($scope.formdata);
                };
                $scope.cancel = function () {               
                    $modalInstance.close(false);
                };
            }
        ])
});

function setAll(array, value) {
  var i = array.length;
  while (i--) {
    array[i] = value;
  }
}