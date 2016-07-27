angular.module('starter.controllers')
    .controller('ClientCheckoutCtrl', [
        '$scope','$state','$cart','Order','$ionicLoading','$ionicPopup','Cupom','$cordovaBarcodeScanner',
        function($scope,$state,$cart,Order,$ionicLoading,$ionicPopup,Cupom,$cordovaBarcodeScanner){

            var cart = $cart.get();

            $scope.cupom = cart.cupom;
            $scope.items = cart.items;
            $scope.total = $cart.getTotalFinal();

            $scope.removeItem = function(i){
                $cart.removeItem(i);
                $scope.items.splice(i,1);
                $scope.total = $cart.getTotalFinal();
            };

            $scope.openProductDetail = function(i){
               $state.go('client.checkout_item_detail',{index: i});
            };

            $scope.openListProducts = function(){
               $state.go('client.view_products');
            };

            $scope.save = function(){
                var o = {items: angular.copy($scope.items)};
                if($scope.cupom.value){
                    o.cupom_code = $scope.cupom.code;
                }

                angular.forEach(o.items, function(item){
                    item.product_id = item.id;
                });
                $ionicLoading.show({
                    template: 'Carregando...'
                });
                Order.save({id: null},o,function(data){
                    $ionicLoading.hide();
                    $state.go('client.checkout_successful');
                },function(responseError){
                    $ionicLoading.hide();
                    $ionicPopup.alert({
                        title: "Erro",
                        template: 'Pedido não realizado!'
                    })
                });
            };

            $scope.readQrCode = function(){
                $cordovaBarcodeScanner
                    .scan()
                    .then(function(barcodeData) {
                        getValueCupom(barcodeData.text);
                    }, function(error) {
                        $ionicLoading.hide();
                        $ionicPopup.alert({
                            title: "Erro",
                            template: 'Não foi possível ler o código! Tente novamente'
                        })
                    });
            };

            $scope.removeCupom = function(){
                $cart.removeCupom();
                $scope.cupom = $cart.get().cupom;
                $scope.total = $cart.getTotalFinal();
            };

            function getValueCupom(code){
                $ionicLoading.show({
                    template: 'Carregando...'
                });
                Cupom.get({code: code},function(data){
                    $cart.setCupom(data.data.code,data.data.value);
                    $scope.cupom = $cart.get().cupom;
                    $scope.total = $cart.getTotalFinal();
                    $ionicLoading.hide();
                },function(responseError){
                    $ionicLoading.hide();
                    $ionicPopup.alert({
                        title: "Erro",
                        template: 'Cupom inválido!'
                    })
                });
            };
    }]);