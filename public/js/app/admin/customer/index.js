/////////////////////
// CUSTOMER MODULE //
/////////////////////
define(['angular'], function (ng) {
    'use strict';

    return ng.module('app.customer', ['ui.router.state', 'ngAnimate', 'ngTable', 'ui.router'])

    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('admin.customer', {
                url: '/customer',
                views: {
                    'admin': {
                        templateUrl: 'js/app/admin/customer/admin.customer.html',
                    }
                }
            })
            .state('admin.customer.view', {
                url: '/view',
                views: {
                    'customer': {
                        templateUrl: 'js/app/admin/customer/admin.customer.view.html',
                        controller: 'AdminCustomerViewController',
                        resolve: {
                            customers: ['UserService', function(UserService) {
                                return UserService.getCustomersOfUser();
                            }]
                        }
                    }
                }
            })
    }])
    // CUSTOMER VIEW SECTION
    .controller('AdminCustomerViewController', ['$scope', '$filter', '$state', 'ngTableParams', 'OrderService', 'customers',
        function ($scope, $filter, $state, ngTableParams, OrderService, customers) {
                $scope.currentstate = $state.current.name;
                var data = customers.data;            

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

                $scope.setEditId = function (customer) {
                    $scope.editId = customer.id;
                    $scope.saleBills = [];
                    if(customer.id) {
                        OrderService.getBillOfCustomer(customer.id).success(function(data) {
                            $scope.saleBills = data;
                        })                    
                    }
                }                                            
            }
    ])
})