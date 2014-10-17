/*
*   PRODUCT CONTROLLER
* */
define(['angular'], function(ng) {
    'use strict';

    return ng.module('app.product', ['ui.router.state', 'ui.bootstrap', 'ngAnimate'])
        .config(['$stateProvider', function ($stateProvider) {
        
            $stateProvider

                //////////////////
                // PRODUCT PART //
                //////////////////       
                .state('default.cart', {
                    url: '/cart',
                    views: {
                        'default': {
                            templateUrl: 'js/app/default/product/default.cart.html',
                            controller: 'DefaultCartController',
                            resolve: {
                                Userlist: ['UserService', function(UserService) {
                                    return UserService.getAddress();
                                }]
                            }
                        }
                    }
                })
                .state( 'default.products', {
                    abstract: true,
                    url:'/products',                    
                    views: {
                        'default': {                            
                            templateUrl: 'js/app/default/product/default.product.html',
                            controller: 'ProductsController',                                                      
                            resolve: {
                                hotProducts: ['ProductService', '$stateParams', function(ProductService, $stateParams) {
                                    return ProductService.getProducts(0, $stateParams.page, 1);     
                                }]
                            }
                        }
                    }
                })
                .state( 'default.products.page', {
                    url:'/page/{page:[0-9]{1,4}}',
                    views: { 
                        'productshow':
                        {
                            templateUrl: 'js/app/default/product/default.product.search.html',
                            controller: 'ProductsListController',
                            resolve: {
                                products: ['ProductService', '$stateParams', function(ProductService, $stateParams) {    
                                    return ProductService.getProducts(0, $stateParams.page);  //cid, page
                                }]
                            }
                        }
                    }
                })
                .state( 'default.products.search', {
                    url:'/search/{cid:[0-9]{1,4}}/{page:[0-9]{1,4}}',
                    views: {
                        'productshow':
                        {
                            templateUrl: 'js/app/default/product/default.product.search.html',
                            controller: 'ProductsListController',                                      
                            resolve: {
                                products: ['ProductService', '$stateParams', function(ProductService, $stateParams) {
                                    return ProductService.getProducts($stateParams.cid, $stateParams.page);
                                }]                          
                            }
                        }
                    }
                })
                .state( 'default.products.hot', {
                    url:'/hot/{page:[0-9]{1,4}}',
                    views: { 
                        'productshow':
                        {
                            templateUrl: 'js/app/default/product/default.product.search.html',
                            controller: 'ProductsListController',
                            resolve: {
                                products: ['ProductService', '$stateParams', function(ProductService, $stateParams) {  
                                    return ProductService.getProducts(0, $stateParams.page, 1);  //cid, page
                                }]                            
                            }
                        }
                    }
                })                
                .state( 'default.products.detail', {
                    url:'/detail/{id:[0-9]{1,4}}',
                    views: { 
                        'productshow':
                        {
                            templateUrl: 'js/app/default/product/default.product.detail.html',
                            controller: 'ProductDetailController',
                            resolve: {
                                product: ['ProductService', '$stateParams', function(ProductService, $stateParams) {    
                                    return ProductService.getProduct($stateParams.id, 1, 1);
                                }]
                            }
                        }
                    }
                })
        }])        
        .controller('DefaultController', function() {

        })
        .controller('CarouselCtrl', ['$scope', '$animate', 
            function($scope, $animate){
              $scope.myInterval = 3000;
              var slides = $scope.slides = [];
              $scope.addSlide = function() {
                var newWidth = 600 + slides.length;
                slides.push({
                  image: 'http://placekitten.com/' + newWidth + '/300',
                  text: ['More','Extra','Lots of','Surplus'][slides.length % 4] + ' ' +
                    ['Cats', 'Kittys', 'Felines', 'Cutes'][slides.length % 4]
                });
              };
              for (var i=0; i<4; i++) {
                $scope.addSlide();
              }
            }
        ])
        .controller('DefaultCartController', ['$scope', 'ShoppingcartService', 'Userlist', '$location', '$http', '$timeout',
            function($scope, ShoppingcartService, Userlist, $location, $http, $timeout) {
                $scope.user = {};
                $scope.cart = ShoppingcartService;
                $scope.Userlist = Userlist.data;
                $scope.carttable = ShoppingcartService.cart();
                $scope.deleteItem = function(item) {
                    ShoppingcartService.removeItem(item);
                    $scope.carttable = ShoppingcartService.cart();
                }
                $scope.htmlImageTooltip = function(image) {
                    var htmlTooltip = "<img width='180' height='200' src='assets/img/images/resized/product/resized-"+image+"'>";    
                    return htmlTooltip;
                }

                var streetAddress = new google.maps.LatLng(10.8370566, 106.74445639999999),//;"5111 47 St NE  Calgary, AB T3J 3R2",
                    
                    // marked special startup location
                    Location = new google.maps.LatLng(10.8370566, 106.74445639999999),
                    businessWriteup = "<b>MULLE FASHION</b><br/>clb Thuyết Trình Thủ Đức<br/>clb Bán Hàng Thủ Đức<br/>",

                    // start location
                    defaultFromAddress = 'đường 36, Linh Đông, Thủ Đức, Hồ Chí Minh (Mulle Fashion, clb Bán Hàng, clb Thuyết Trình)',
                    businessTitle = "Thời trang Mulle",
                    directionsService = new google.maps.DirectionsService(),
                    directionsDisplay = new google.maps.DirectionsRenderer({
                        draggable: true
                    }),

                    mapOptions = {
                        center: Location,
                        zoom: 11,
                        mapTypeId: google.maps.MapTypeId.ROADMAP
                    },
                    map = new google.maps.Map(document.getElementById("map_canvas"),
                    mapOptions);

                // add your fixed business marker
                var contentString = businessWriteup + streetAddress,
                  marker = new google.maps.Marker({
                      //position: Location,
                      map: map,
                      title: businessTitle,
                      animation: google.maps.Animation.DROP
                  });
                // show info Window
                var infowindow = new google.maps.InfoWindow({
                    content: contentString
                });
                google.maps.event.addListener(marker, 'click', function () {
                    infowindow.open(map, marker);
                });

                directionsDisplay.setMap(map);
                directionsDisplay.setPanel(document.getElementById('directions'));


                //$scope.fromAddress = defaultFromAddress;
                $scope.user.address = defaultFromAddress;//$scope.fromAddress;
                $scope.selectedOption = 'Driving';
                $scope.options = ['Driving', 'Walking', 'Bicycling', 'Transit'];
                $scope.totalKm = 0;

                $scope.setDirections = function () {
                    var selectedMode = $scope.selectedOption.toUpperCase() || 'DRIVING',
                        from = $scope.user.address || defaultFromAddress,
                        request = {
                            origin: from,
                            destination: streetAddress, //new google.maps.LatLng(10.8370566, 106.74445639999999),//
                            travelMode: selectedMode,
                            provideRouteAlternatives: true,
                            unitSystem: google.maps.UnitSystem.METRIC,
                            optimizeWaypoints: true
                        };
                    if (selectedMode === 'TRANSIT') {
                        request.transitOptions = {
                            departureTime: new Date()
                        };
                    }

                    // devide arraylist
                    var i = {};
                    var j = {};
                    for(var key in Userlist) {
                            if (Userlist.hasOwnProperty(key)  &&        // These are explained
                            /^0$|^[1-9]\d*$/.test(key) &&    // and then hidden
                            key <= 4294967294                // away below
                            ) {
                                i.push(Userlist[key].id);
                                j.push(UserList[key].address);
                            }
                    }
                    directionsService.route(request, function (response, status) {
                        if (status === google.maps.DirectionsStatus.OK) {
                            directionsDisplay.setDirections(response);
                        } else {
                            toastr.error(status);
                        }

                        var minAddress = '';
                        
                        var service2 = new google.maps.DistanceMatrixService();
                        service2.getDistanceMatrix(
                        {
                            origins: [$scope.user.address],
                            destinations: ['Hồ chí minh, Việt nam', 'Bình dương, Việt nam', 'Tân bình, Hồ chí minh', 'Hồ hoàn kiếm, hà nội', 
                            'Đà lạt', 'Mũi né', 'sóc trăng', 'bình phước', 'cà mau', 'ao bà om'],
                            travelMode: google.maps.TravelMode.DRIVING,
                            avoidHighways: false,
                            avoidTolls: false
                        }, callback);
                        function callback(response, status) { console.log(response);
                            var minIndex = 0;
                            for (var index = 0; index < response.rows[0].elements.length; ++index) {
                                if(response.rows[0].elements[index].distance.value < response.rows[0].elements[minIndex].distance.value)
                                    minIndex = index;
                                console.log(response.originAddresses[0] +' => '+ response.destinationAddresses[index] + ' = ' + response.rows[0].elements[index].distance.text);
                            }
                            console.log('GẦN NHẤT: ' + response.originAddresses[0] +' => '+ response.destinationAddresses[minIndex] + ' = ' + response.rows[0].elements[minIndex].distance.text);
                            minAddress = response.destinationAddresses[minIndex];
                        }
                    });
                }

                // Try HTML5 geolocation
                if ("geolocation" in navigator) {
                    navigator.geolocation.getCurrentPosition(function (position) {
                        var pos = new google.maps.LatLng(position.coords.latitude,
                                                         position.coords.longitude);
                        //map.setCenter(Location);
                        $scope.$apply(function () {
                            //$scope.fromAddress = pos;
                            $scope.user.address = pos;
                        });

                        $scope.setDirections();
                    });
                }


                google.maps.event.addListener(directionsDisplay, 'directions_changed', function () {

                    computeTotalDistance(directionsDisplay.directions);
                    try {
                        if (directionsDisplay.directions.routes[0].legs[0]) {

                            $scope.$apply(function () {
                                //$scope.fromAddress = directionsDisplay.directions.routes[0].legs[0].start_address;
                                $scope.user.address = directionsDisplay.directions.routes[0].legs[0].start_address;
                            });
                            console.log($scope.user.address);
                            console.log(directionsDisplay.directions.routes[0].legs[0]);
                        }
                    } catch (e) { }
                });

                // fire it up initially
                $scope.setDirections();
                // watch if the mode has changed
                $scope.$watch('selectedOption', function (newValue, oldValue) { $scope.setDirections(); });

                function computeTotalDistance(result) {
                    var total = 0, i,
                        myroute = result.routes[0];
                    for (i = 0; i < myroute.legs.length; i++) {
                        total += myroute.legs[i].distance.value;
                    }
                    total = total / 1000;
                    $scope.$apply(function () {
                        $scope.totalKm = total;
                    });
                }
            }
        ])
        .controller('ProductsController', [ '$scope', '$rootScope', '$window', 'categories', 'hotProducts',
            function($scope, $rootScope, $window, categories, hotProducts) {
                //$scope.myInterval = 3000;
                $scope.categories = categories.data;    
                $scope.hotProducts = hotProducts.data.products;  
                $scope.cart = $scope.$parent.cart;          
                $scope.gotoProduct = function(id) {
                    $window.open('#/products/detail/130');
                }            
            }
        ])
        .controller('ProductsListController', ['$scope', '$rootScope', 'products', 'ShoppingcartService', 
            function($scope, $rootScope, products, ShoppingcartService) {
                $scope.shoppingcart = ShoppingcartService;
                $scope.products = products.data.products;
                $rootScope.currentPage = products.data.currentPage;
                $rootScope.numberRow = products.data.numberRow;    

                $scope.$parent.isHidden = false;
                $scope.fadeIt = function() {
                    //$scope.$parent.isHidden = !$scope.$parent.isHidden;
                }        
            }
        ])
        .controller('ProductDetailController', ['$scope', 'product', '$state', '$stateParams', 
            function($scope, product, $state, $stateParams){
                $scope.products = product.data.product;
                $scope.presId = product.data.presId;
                $scope.nextId = product.data.nextId;

               $scope.nextClick = function(){
                    if($scope.presId) {                    
                        $state.transitionTo('default.products.detail' , {id: $scope.presId});                       
                    }
                    else $state.transitionTo('default.products.page', {page: 1});                
                }

                $scope.presClick = function(){
                    if($scope.nextId) {                    
                        $state.transitionTo('default.products.detail' , {id: $scope.nextId});
                    }
                    else $state.transitionTo('default.products.page', {page: 1});
                }            
            }
        ])
        .controller('PaginationDemoCtrl', ['$scope', '$rootScope', '$state', '$stateParams', '$location',
            function($scope, $rootScope, $state, $stateParams, $location) {                                                                  
                // pagination view var
                $scope.maxSize = 5;

                // watch $rootScope for awesome change 
                $rootScope.$watch('numberRow', function () {
                    $scope.bigTotalItems = $rootScope.numberRow;                    
                });
                $rootScope.$watch('currentPage', function () {
                    $scope.bigCurrentPage = $rootScope.currentPage;     
                });      

                // when click on button we transition to target page
                $scope.pageChanged = function(page){
                    $scope.bigCurrentPage = page; 
                    $stateParams.page = page;
                    $state.transitionTo($state.current.name , $stateParams);                      
                }

                // hide pagination when show detail
                $scope.isHiddenPagination = function(route) { 
                    if($location.path().indexOf(route) != -1)  return 'customhidden';                
                };
            }]
        )
        .controller('ModalInstanceCtrl', ['$scope', '$modalInstance', '$state', 'items', 'product', 'ShoppingcartService',
            function($scope, $modalInstance, $state, items, product, ShoppingcartService){                        
                $scope.shoppingcart = ShoppingcartService;
                $scope.product = product;
                $scope.items = items;
                $scope.selected = {
                    item: $scope.items[0]
                };
               
                // handle buttons on dialog modal
                $scope.ok = function () {
                    $modalInstance.close($scope.selected.item);
                };
                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };
            }
        ])
        .controller('ModalDemoCtrl', ['$scope', '$modal', '$log',
            function($scope, $modal, $log) {
                $scope.items = ['item1', 'item2', 'item3'];

                $scope.open = function ($index) {
                    var product = $scope.$parent.products[$index];

                    var modalInstance = $modal.open({
                      templateUrl: 'myModalContent.html',
                      controller: 'ModalInstanceCtrl',
                      resolve: {
                        product: function() {
                          return product;
                        }, // resolve product; 
                        items: function () {
                          return $scope.items;
                        }
                      }
                    });

                    modalInstance.result.then(function (selectedItem) {
                      $scope.selected = selectedItem;
                    }, function () {
                      $log.info('Modal dismissed at: ' + new Date());
                    });
                };
            }
        ])
        .controller('RatingDemoCtrl', ['$scope', 
            function ($scope) {
              $scope.rate = 3;
              $scope.max = 5;
              $scope.isReadonly = false;
              
              $scope.hoveringOver = function(value) {
                $scope.overStar = value;
                $scope.percent = 100 * (value / $scope.max);
              };

              $scope.ratingStates = [
                {stateOn: 'glyphicon-star', stateOff: 'glyphicon-star-empty'},
              ];
            }
        ])
        .directive('rnLazyBackground', ['$document', '$parse', 
            function($document, $parse) {
                return {
                    restrict: 'A',
                    link: function(scope, iElement, iAttrs) {
                        function setLoading(elm) {
                            if (loader) {
                                elm.html('');
                                elm.append(loader);
                                elm.css({
                                    'background-image': null
                                });
                            }
                        }
                        var loader = null;
                        if (angular.isDefined(iAttrs.rnLazyLoader)) {
                            loader = angular.element($document[0].querySelector(iAttrs.rnLazyLoader)).clone();
                        }
                        var bgModel = $parse(iAttrs.rnLazyBackground);
                        scope.$watch(bgModel, function(newValue) {
                            setLoading(iElement);
                            var src = bgModel(scope);
                            var img = $document[0].createElement('img');
                            img.onload = function() {
                                if (loader) {
                                    loader.remove();
                                }
                                if (angular.isDefined(iAttrs.rnLazyLoadingClass)) {
                                    iElement.removeClass(iAttrs.rnLazyLoadingClass);
                                }
                                if (angular.isDefined(iAttrs.rnLazyLoadedClass)) {
                                    iElement.addClass(iAttrs.rnLazyLoadedClass);
                                }
                                iElement.css({
                                    'background-image': 'url(' + this.src + ')'
                                });
                            };
                            img.onerror= function() {
                                //console.log('error');
                            };
                            img.src = src;
                        });
                    }
                };
            }
        ]);
});

function clone(obj) {
    // Handle the 3 simple types, and null or undefined
    if (null == obj || "object" != typeof obj) return obj;

    // Handle Date
    if (obj instanceof Date) {
        var copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
    }

    // Handle Array
    if (obj instanceof Array) {
        var copy = [];
        for (var i = 0, len = obj.length; i < len; i++) {
            copy[i] = clone(obj[i]);
        }
        return copy;
    }

    // Handle Object
    if (obj instanceof Object) {
        var copy = {};
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
        }
        return copy;
    }

    throw new Error("Unable to copy obj! Its type isn't supported.");
}
