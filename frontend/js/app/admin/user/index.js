/////////////////
// USER MODULE //
/////////////////
define(['angular'], function (ng) {
    'use strict';

    return ng.module('app.user', ['ui.router.state', 'ngAnimate', 'ngTable', 'ui.router'])

    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('admin.user', {
                url: '/user',
                views: {
                    'admin': {
                        templateUrl: 'js/app/admin/user/admin.user.html',
                    }
                }
            })
            .state('admin.user.view', {
                url: '/view',
                views: {
                    'user': {
                        templateUrl: 'js/app/admin/user/admin.user.view.html',
                        controller: 'AdminUserShowController',
                        resolve: {
                            users: ['$stateParams', 'UserService', function ($stateParams, UserService) {
                                return UserService.getUsers();
                            }]
                        }
                    }
                }
            })
            .state('admin.user.tree', {
                url: '/tree',
                views: {
                    'user': {
                        templateUrl: 'js/app/admin/user/admin.user.tree.html',
                        controller: 'AdminUserTreeController',
                        resolve: {
                            users: ['$stateParams', 'UserService', function ($stateParams, UserService) {
                                return UserService.getUsersTree();
                            }]
                        }
                    }
                }
            })
            .state('admin.user.detail', {
                url: '/detail/{id:[0-9]{0,4}}',
                views: {
                    'user': {
                        templateUrl: 'js/app/admin/user/admin.user.detail.html',
                        controller: 'AdminUserDetailController',
                        resolve: {
                            user: ['$stateParams', 'UserService', function ($stateParams, UserService) {
                                return UserService.getUser($stateParams.id);                                
                            }],
                            orderDetailsReport: ['$stateParams', 'OrderService', function ($stateParams, OrderService) {
                                return OrderService.getOrderDetailsReport($stateParams.id);
                            }],
                            orderDetailsReportDay: ['$stateParams', 'OrderService', function ($stateParams, OrderService) {
                                return OrderService.getOrderDetailsReportDay($stateParams.id);
                            }],
                            orderDetailsNeedInMonth: ['$stateParams', 'OrderService', function ($stateParams, OrderService) {
                                return OrderService.getOrderDetailsNeedInMonth($stateParams.id);
                            }]
                        }
                    }
                }
            })
            .state('admin.user.add', {
                url: '/add',
                views: {
                    'user': {
                        templateUrl: 'js/app/admin/user/admin.user.add.html',
                        controller: 'AdminUserAddController',                        
                    }
                }
            })
            .state('admin.user.update', {
                url: '/update',
                views: {
                    'user': {
                        templateUrl: 'js/app/admin/user/admin.user.update.html',
                        controller: 'AdminUserUpdateController',
                        resolve: {
                            user: ['UserService', function(UserService) {
                                return UserService.getUser(0);
                            }]
                        }
                    }
                }
            })
        }])
        //////////////
        // USER ADD //
        //////////////
        .controller('AdminUserAddController', ['$scope', '$rootScope','$location', '$http', '$timeout', '$upload', 'SessionService',
            function ($scope, $rootScope, $location, $http, $timeout, $upload, SessionService) {                
                $scope.fileReaderSupported = window.FileReader != null;
                $scope.uploadRightAway = false;
                $scope.user = {};
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
                $scope.start = function (index) {
                    $scope.progress[index] = 0;
                    $scope.upload[index] = $upload.upload({
                        url: 'user',
                        method: 'POST',                       
                        data: {
                            name        : $scope.user.name,
                            username    : $scope.user.username,
                            email       : $scope.user.email,
                            password    : $scope.user.password,
                            phone       : $scope.user.phone,
                            address     : $scope.user.address,
                            iscustomer  : 0
                        },                        
                        file: $scope.selectedFiles[0], //$scope.selectedFiles[index],
                        fileFormDataName: 'myFile'
                    }).then(function (response) {
                        if(response.data.success) {                                                     
                            $rootScope.alerts.push({type: 'success', msg: 'Đã thêm thành viên thành công'});
                            if($rootScope.alerts.length > 1) $rootScope.alerts.splice(0, 1);
                            $scope.clearAll();                            
                        }                     
                        else {                            
                            $rootScope.alerts.push({type: 'danger', msg: 'Lỗi! tên tài khoản đã tồn tại'});
                            if($rootScope.alerts.length > 1) $rootScope.alerts.splice(0, 1);
                        }                           
                        $scope.uploadResult.push(response.data);
                    }, null, function (evt) {
                        $scope.progress[index] = parseInt(100.0 * evt.loaded / evt.total);
                    });
                };
                $scope.ok = function () {
                    // can upload multifile
                    $scope.start(0);                    
                }
                // clear all form when cancel we return pristine state 
                $scope.clearAll = function () {
                    $scope.user.name        = null;
                    $scope.user.username    = null;
                    $scope.user.email       = null;
                    $scope.user.image       = null;
                    $scope.user.password    = null;
                    $scope.user.phone       = null;
                    $scope.user.address     = null;                    
                    $scope.selectedFiles    = null;
                    $scope.user.confirm_password = null;                                        
                    $scope.userForm.$setPristine();
                }
                $scope.backToDetail = function () {
                    $location.path('/admin/user/detail/' + SessionService.get('userId'));
                }

                var minAddress = '';
                
                var service2 = new google.maps.DistanceMatrixService();
                service2.getDistanceMatrix(
                {
                    origins: ['Trà Vinh, Việt Nam'],
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

                    directionsService.route(request, function (response, status) {
                        if (status === google.maps.DirectionsStatus.OK) {
                            directionsDisplay.setDirections(response);
                        } else {
                            toastr.error(status);
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
        /////////////////
        // USER UPDATE //
        /////////////////
        .controller('AdminUserUpdateController', ['$scope', '$rootScope', '$location', '$http', '$timeout', '$upload', 'SessionService', 'user',
            function ($scope, $rootScope, $location, $http, $timeout, $upload, SessionService, user) {
                // check user.data
                if(!(typeof user.data != undefined && user.data != null)){
                    $location.path('/admin/user/detail/' + SessionService.get('userId'));
                }                
                $scope.fileReaderSupported = window.FileReader != null;
                $scope.uploadRightAway = false;                                        
                $scope.initPicture = user.data.user_picture;

                // making data 
                $scope.user = {};                                     
                ($scope.reset = function() {
                    $scope.user.newpassword = '';                    
                    $scope.user.name        = user.data.user_fullname;
                    $scope.user.username    = user.data.email;
                    $scope.user.email       = user.data.user_email;                    
                    $scope.user.facebook    = user.data.user_facebook;
                    $scope.user.phone       = user.data.user_phone;
                    $scope.user.address     = user.data.user_address;
                })();

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
                $scope.start = function (index) {
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

                    $scope.upload[index] = $upload.upload({
                        url: 'user/update',
                        method: 'POST',                       
                        data: {
                            id          : SessionService.get('userId'),
                            name        : $scope.user.name,
                            username    : $scope.user.username,
                            email       : $scope.user.email,
                            facebook    : $scope.user.facebook,
                            password    : $scope.user.password,
                            newpassword : $scope.user.newpassword,
                            phone       : $scope.user.phone,
                            address     : $scope.user.address
                        },                        
                        file: $scope.selectedFiles[0], //$scope.selectedFiles[index],
                        fileFormDataName: 'myFile'
                    }).then(function (response) {
                        if(response.data.success) {                                                     
                            $rootScope.alerts.push({type: 'success', msg: 'Cập nhật thành viên thành công'});
                            if($rootScope.alerts.length > 1) $rootScope.alerts.splice(0, 1);  
                            $location.path('/admin/user/detail/' + SessionService.get('userId'));                             
                        }                     
                        else {                                                        
                            $rootScope.alerts.push({type: 'danger', msg: 'Cập nhật thành viên chưa thành công'});
                            if($rootScope.alerts.length > 1) $rootScope.alerts.splice(0, 1);
                        }                                                   
                    }, null, function (evt) {
                        $scope.progress[index] = parseInt(100.0 * evt.loaded / evt.total);
                    });
                };
                $scope.ok = function () {
                    // can upload multifile
                    $scope.start(0);                     
                }
                // clear all form when cancel we return pristine state 
                $scope.clearAll = function () {
                    $scope.reset();
                    $scope.user.image       = null;                    
                    $scope.selectedFiles    = null;
                    $scope.user.password    = null;                    
                    $scope.user.confirm_password = null;                                        
                    $scope.userForm.$setPristine();
                }
                $scope.backToDetail = function () {
                    $location.path('/admin/user/detail/' + SessionService.get('userId'));
                }

                var minAddress = '';
                var streetAddress = new google.maps.LatLng(10.8370566, 106.74445639999999),
                    // start location
                    defaultFromAddress = 'đường 36, Linh Đông, Thủ Đức, Hồ Chí Minh',
                    businessTitle = "Thời trang Mulle",
                    directionsService = new google.maps.DirectionsService(),
                    directionsDisplay = new google.maps.DirectionsRenderer({
                        draggable: true
                    }),

                    mapOptions = {
                        center: streetAddress,
                        zoom: 11,
                        mapTypeId: google.maps.MapTypeId.ROADMAP
                    },
                    map = new google.maps.Map(document.getElementById("map_canvas"),
                    mapOptions);
                    
                    directionsDisplay.setMap(map);
                    directionsDisplay.setPanel(document.getElementById('directions'));

                    //$scope.user.address = defaultFromAddress;
                    $scope.totalKm = 0;

                    $scope.setDirections = function () {
                        var selectedMode = 'DRIVING',
                            from = $scope.user.address || defaultFromAddress,
                            request = {
                                origin: from,
                                destination: streetAddress,
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

                        directionsService.route(request, function (response, status) {
                            if (status === google.maps.DirectionsStatus.OK) {
                                directionsDisplay.setDirections(response);
                            } else {
                                toastr.error(status);
                            }
                        });
                    }
                    /*
                    // Try HTML5 geolocation
                    if ("geolocation" in navigator) {
                        navigator.geolocation.getCurrentPosition(function (position) {
                            var pos = new google.maps.LatLng(position.coords.latitude,
                                                             position.coords.longitude);
                            $scope.$apply(function () {
                                $scope.user.address = pos;
                            });
                            $scope.setDirections();
                        });
                    }
                    */
                    google.maps.event.addListener(directionsDisplay, 'directions_changed', function () {

                        computeTotalDistance(directionsDisplay.directions);
                        try {
                            if (directionsDisplay.directions.routes[0].legs[0]) {

                                $scope.$apply(function () {
                                    $scope.user.address = directionsDisplay.directions.routes[0].legs[0].start_address;
                                });
                            }
                        } catch (e) { }
                    });

                    // fire it up initially
                    $scope.setDirections();
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
        ///////////////
        // USER SHOW //
        ///////////////
        .controller('AdminUserShowController', ['$scope', '$filter', '$state', 'ngTableParams', 'users', 'OrderService', 
            function ($scope, $filter, $state, ngTableParams, users, OrderService) {
                $scope.currentstate = $state.current.name;
                var data = users.data;            

                $scope.tableParams = new ngTableParams({
                    page: 1,
                    count: 10,
                    filter: {                        
                    },
                    sorting: {                        
                    }
                }, {
                    total: data.length,
                    getData: function ($defer, params) {                        
                        var filteredData = params.filter() ?
                            $filter('filter')(data, params.filter()) : data;

                        if (params.orderBy().length)
                            var orderedData = params.sorting() ? $filter('orderBy')(filteredData, params.orderBy()) : filteredData;
                        else
                            var orderedData = filteredData;

                        params.total(orderedData.length); // set total for recalc pagination
                        $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                    }
                });

                $scope.editId = -1;

                $scope.setEditId = function (pid) {
                    $scope.editId = pid;
                    $scope.saleBills = [];
                    if(pid) {
                        OrderService.getUserOrderDetails(pid).success(function(data) {
                            $scope.saleBills = data;
                        })                    
                    }
                }                                            
            }
        ])        
        ///////////////
        // USER TREE //
        ///////////////
        .controller('AdminUserTreeController', ['$scope', 'users', 
            function ($scope, users) {
                var arrUser = new Array();
                arrUser[0] = users.data;
                $scope.treedata = arrUser;
            }
        ])       
        /////////////////
        // USER DETAIL //
        /////////////////
        .controller('AdminUserDetailController', ['$scope', 'OrderService', 'SessionService', 'user', 'orderDetailsReport', 'orderDetailsReportDay', 'orderDetailsNeedInMonth', '$stateParams',
            function ($scope, OrderService, SessionService, user, orderDetailsReport, orderDetailsReportDay, orderDetailsNeedInMonth, $stateParams) {
                $scope.user = user.data;                                   
                var reportData = orderDetailsReport.data;                
                var reportDayData = orderDetailsReportDay.data;                

                // alert data
                $scope.alert0 = reportData.alertData; 
                $scope.alert1 = reportDayData.alertData;
                $scope.currentUserId = SessionService.get('userId');            
                $scope.orderDetailsInMonth = orderDetailsNeedInMonth.data;
                      
                // scope function
                $scope.showOrderDetails = function (pid) {                                    
                    $scope.orderDetails = [];
                    if(pid >= 0)
                        OrderService.getUserOrderDetails($stateParams.id).success(function(data) {
                            $scope.orderDetails = data;                            
                        }) 
                }                  
                
                $scope.updateUser = function(pid) {

                }      
                // long data          
                $scope.chart = {
                  "type": "LineChart",
                  "displayed": true,
                  "data": reportData.chartData,
                  "options": {
                    "title": "Doanh số hệ thống theo tháng",
                    "isStacked": "true",
                    "fill": 20,
                    "displayExactValues": true,
                    "vAxis": {
                      "title": "Xu = 200.000đ",
                      "gridlines": {
                        "count": 10
                      }
                    },
                    "hAxis": {
                      "title": "Ngày - tháng - năm"
                    }
                  },
                  "formatters": {}
                };                  
                               
                $scope.chart1 = {
                  "type": "LineChart",
                  "displayed": true,
                  "data": reportDayData.chartData,
                  "options": {
                    "title": "Danh số hệ thống theo ngày",
                    "isStacked": "true",
                    "fill": 20,
                    "displayExactValues": true,
                    "vAxis": {
                      "title": "Xu = 200.000đ",
                      "gridlines": {
                        "count": 10
                      }
                    },
                    "hAxis": {
                      "title": "Ngày - tháng - năm"                      
                    }
                  },
                  "formatters": {}
                };
            }                      
        ])
        .controller('CtrlGMap', ['$scope', 
            ]
        )
});