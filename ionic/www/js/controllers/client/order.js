angular.module('starter.controllers')
    .controller('ClientOrderCtrl', [
        '$scope','$state','$ionicLoading','Order',
        function($scope,$state,$ionicLoading,Order){
            $scope.orders = [];

            $ionicLoading.show({
                template: 'Carregando...'
            });

            $scope.doRefresh = function(){
                getOrders().then(function (data){
                    $scope.orders = data.data;
                    $scope.$broadcast('scroll.refreshComplete');
                }, function (dataError) {
                    $scope.$broadcast('scroll.refreshComplete');
                });
            };

            $scope.openOrderDetail = function(order){
                $state.go('client.view_order',{id: order.id});
            };

            function getOrders(){
                return Order.query({
                    id: null,
                    orderBy: 'created_at',
                    sortedBy: 'desc',
                }).$promise;
            };

            getOrders().then(function (data){
                $scope.orders = data.data;
                $ionicLoading.hide();
            }, function (dataError) {
                $ionicLoading.hide();
            });
    }]);