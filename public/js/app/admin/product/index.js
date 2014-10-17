////////////////////
// PRODUCT MODULE //
////////////////////
define(['angular'], function (ng) {
    'use strict';

    return ng.module('app.adminproduct', ['ui.router.state', 'ngAnimate', 'ngTable', 'ui.router'])
        
        ///////////////////////
        // ADMIN MAIN MODULE //
        ///////////////////////
        .config(['$stateProvider', function ($stateProvider ) {
            $stateProvider
            .state( 'admin.product', {
                url:'/product',
                views: {
                    'admin': {
                        templateUrl: 'js/app/admin/product/admin.product.html',                        
                    }
                }                
            })
            .state('admin.product.view', {
                url:'/view',
                views: {
                    'adminproduct': {
                        templateUrl: 'js/app/admin/product/admin.product.view.html',                        
                        controller: 'AdminProductViewController',
                        resolve: {
                            products: ['$stateParams', 'ProductService', function($stateParams, ProductService) {    
                                return ProductService.getAllProducts();
                            }],
                            categories: ['ProductService', function(ProductService) {
                                return ProductService.getAllCategories();
                            }]                         
                        }
                    }
                }
            })
        }])    
        /////////////////
        // CONTROLLERS //
        /////////////////
        .controller('AdminProductViewController', ['$scope', '$rootScope', '$filter', '$state', 'ngTableParams', 'products', 'categories', '$http', '$timeout', '$upload', 'SessionService', 'ProductService', '$location', '$anchorScroll',
            function($scope, $rootScope, $filter, $state, ngTableParams, products, categories, $http, $timeout, $upload, SessionService, ProductService, $location, $anchorScroll){
                $scope.currentstate = $state.current.name;    
                //making up categories data
                $scope.categories = categories.data;    
                var producttabledata =  products.data;    
                // set default value
                $scope.productold = {};
                $scope.productold.active = 0;
                $scope.showserverpicture = false;
                $scope.dataUrls = [];
                $scope.product = {
                    id:0,
                    is_active:0, 
                    is_hot:0,
                    is_show:0,
                    is_home:0,
                    is_freeship:0,
                    category:$scope.categories[0],
                    product_content:'',
                    product_picture: '140230918910314459_698846313495700_4549223421496365890_n.jpg',
                };

                $scope.tableParams = new ngTableParams({
                    page: 1,
                    count: 10,
                    filter: {                        
                    },
                    sorting: {
                        id: 'desc'     // initial sorting
                    },
                },{
                    total: producttabledata.length,
                    getData: function($defer, params) {
                        var filteredData = params.filter() ?
                            $filter('filter')(producttabledata, params.filter()) : producttabledata;

                        if (params.orderBy().length)
                            var orderedData = params.sorting() ? $filter('orderBy')(filteredData, params.orderBy()) : filteredData;
                        else
                            var orderedData = filteredData;

                        params.total(orderedData.length); // set total for recalc pagination
                        $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                    }
                });

                $scope.editId = -1;
                $scope.deleteProduct = function(product) {
                    // we decore first after we asyn to server
                    // delete in table data array
                    producttabledata.splice(producttabledata.indexOf(product), 1);                       
                    $scope.tableParams.reload();
                    // asyn to server
                    ProductService.deleteProduct(product.id);
                }

                $scope.hideProduct = function(product) {
                    // we decore first after we asyn to server
                    // delete in table data array
                    producttabledata.splice(producttabledata.indexOf(product), 1);                       
                    $scope.tableParams.reload();
                    // asyn to server
                    ProductService.hideProduct(product.id);
                }

                $scope.editProduct =  function(product) {
                    // product data
                    $scope.product = product;
                    $scope.productold = product;
                    // price is int
                    $scope.product.product_price = parseInt($scope.product.product_price);
                    $scope.product.category_id = parseInt($scope.product.category_id);
                    // set product category
                    var index;
                    for (index = 0; index < $scope.categories.length; ++index) {
                        $scope.categories[index].id = parseInt($scope.categories[index].id);
                        if($scope.product.category_id === $scope.categories[index].id)
                            $scope.product.category = $scope.categories[index];
                    }     
                    // checkbox making data - checkbox only work with string :D
                    $scope.product.is_active    = $scope.product.is_active!=0?"1":"0";
                    $scope.product.is_hot       = $scope.product.is_hot!=0?"1":"0";
                    $scope.product.is_show      = $scope.product.is_show!=0?"1":"0";
                    $scope.product.is_home      = $scope.product.is_home!=0?"1":"0";
                    $scope.product.is_freeship  = $scope.product.is_freeship!=0?"1":"0";

                    // other data
                    $scope.selectedFiles = [];
                    $scope.dataUrls[0] = product.product_picture;
                    $scope.showserverpicture = true;
                    $location.hash('editor');
                    $anchorScroll();
                }

                $scope.htmlImageTooltip = function(image) {
                    var htmlTooltip = "<img width='180' height='200' src='assets/img/images/resized/product/resized-"+image+"'>";    
                    return htmlTooltip;
                }       
                // clear all
                $scope.clearAll = function (index) {
                    // set default value
                    $scope.dataUrls = [];
                    // product data
                    $scope.product = {};
                    $scope.product.id = 0;
                    $scope.product.is_active = 0; 
                    $scope.product.is_hot = 0;
                    $scope.product.is_show = 0;
                    $scope.product.is_home = 0;
                    $scope.product.is_freeship = 0;
                    $scope.product.product_content = '';
                    $scope.product.product_picture = '140230918910314459_698846313495700_4549223421496365890_n.jpg';
                    $scope.product.category = $scope.categories[0]; 
                    $scope.productold = {};
                    // reset form 
                    $scope.productForm.$setPristine();
                };
                // upload
                $scope.hasUploader = function (index) {
                    return $scope.upload[index] != null;
                };
                // abort upload 
                $scope.abort = function (index) {
                    $scope.upload[index].abort();
                    $scope.upload[index] = null;
                };               
                // when file selected current support multi file
                $scope.onFileSelect = function ($files) {
                    $scope.selectedFiles = [];
                    $scope.progress = [];
                    if ($scope.upload && $scope.upload.length > 0) {
                        for (var i = 0; i < $scope.upload.length; i++) {
                            if ($scope.upload[i] != null) {
                                $scope.upload[i].abort();
                            }
                        }
                    }
                    $scope.upload = [];
                    $scope.uploadResult = [];
                    $scope.selectedFiles = $files;
                    $scope.dataUrls = [];
                    for (var i = 0; i < $files.length; i++) {
                        var $file = $files[i];
                        if (window.FileReader && $file.type.indexOf('image') > -1) {
                            var fileReader = new FileReader();
                            fileReader.readAsDataURL($files[i]);
                            var setPreview = function (fileReader, index) {
                                fileReader.onload = function (e) {
                                    $timeout(function () {
                                        $scope.dataUrls[index] = e.target.result;
                                    });
                                }
                            }
                            setPreview(fileReader, i);
                        }
                        $scope.progress[i] = -1;
                        if ($scope.uploadRightAway) {
                            $scope.start(i);
                        }
                    }
                };
                // start upload file this will remove later
                $scope.start = function (index, update) {
                    // the seed data send to server
                    var tempdata = {
                        id              : SessionService.get('userId'),
                        productid       : $scope.product.id,
                        name            : $scope.product.product_name,
                        price           : $scope.product.product_price, 
                        description     : $scope.product.product_description,
                        content         : $scope.product.product_content,
                        category        : $scope.product.category.id,
                        producer        : $scope.product.product_producer,
                        isactive        : $scope.product.is_active,
                        ishot           : $scope.product.is_hot,
                        isshow          : $scope.product.is_show,
                        ishome          : $scope.product.is_home,
                        isfreeship      : $scope.product.is_freeship,
                        picture         : $scope.product.product_picture,
                        upload          : 1,
                    }
                    // if update
                    if(update) tempdata.update = 1;
                    else       tempdata.update = 0;
                    // if not upload file, the file already on server 
                    if($scope.selectedFiles[0] === undefined) {
                        tempdata.upload = 0;
                        //ProductService.postProduct(tempdata);
                        $http.post('product', tempdata).success(function(data){
                            if(data.success) {
                                $rootScope.alerts.push({type: 'success', msg: 'Cập nhật sản phẩm thành công'});
                                if($rootScope.alerts.length > 1) $rootScope.alerts.splice(0, 1);  
                                          
                                producttabledata.push(data.product);         
                                if(update) {
                                    producttabledata.splice(producttabledata.indexOf($scope.productold), 1);       
                                    $scope.productold = data.product;  
                                }

                                $scope.tableParams.reload(); 
                            }
                            else {                                                        
                                $rootScope.alerts.push({type: 'danger', msg: 'Cập nhật sản phẩm chưa thành công'});
                                if($rootScope.alerts.length > 1) $rootScope.alerts.splice(0, 1);
                            }   
                        });
                    }
                    else {
                        if(typeof $scope.progress == undefined || $scope.progress == null)
                        $scope.progress = {};
                        $scope.progress[index] = 0;         
                        if(typeof $scope.selectedFiles == undefined || $scope.selectedFiles == null)
                        {    
                            $scope.selectedFiles = {};
                            $scope.selectedFiles[0] = {};
                        }
                        if(typeof $scope.upload == undefined || $scope.upload == null)
                            $scope.upload = {};
                        // if upload new image
                        $scope.upload[index] = $upload.upload({
                            url: 'product',
                            method: 'POST',                       
                            data: tempdata,                                                                                   
                            file: $scope.selectedFiles[0], //$scope.selectedFiles[index],
                            fileFormDataName: 'myFile'
                        }).then(function (response) {
                            if(response.data.success) {                                                     
                                $rootScope.alerts.push({type: 'success', msg: 'Cập nhật sản phẩm thành công'});
                                if($rootScope.alerts.length > 1) $rootScope.alerts.splice(0, 1);  
                                          
                                producttabledata.push(response.data.product);               
                                if(update) {
                                    producttabledata.splice(producttabledata.indexOf($scope.productold), 1);    
                                    $scope.productold = response.data.product;      
                                } 

                                $scope.tableParams.reload();                          
                            }                     
                            else {                                                        
                                $rootScope.alerts.push({type: 'danger', msg: 'Cập nhật sản phẩm chưa thành công'});
                                if($rootScope.alerts.length > 1) $rootScope.alerts.splice(0, 1);
                            }                                                   
                        }, null, function (evt) {
                            $scope.progress[index] = parseInt(100.0 * evt.loaded / evt.total);
                        });
                    }
                };
                $scope.ok = function (update) {
                    // can upload multifile
                    $scope.start(0, update);                     
                }     
            }
        ])
});