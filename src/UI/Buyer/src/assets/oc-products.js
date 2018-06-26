angular.module('orderCloud')
    .factory('ocProducts', OrderCloudProductsService)
;

function OrderCloudProductsService(OrderCloudSDK, $uibModal) {
    return {
        Search: _search,
        Related: _listRelatedProducts,
        Featured: _listFeaturedProducts
    };

    function _search(catalogID) {
        return $uibModal.open({
            backdrop:'static',
            templateUrl:'common/services/oc-products/productSearch.modal.html',
            controller: 'ProductSearchModalCtrl',
            controllerAs: '$ctrl',
            size: '-full-screen c-productsearch-modal',
            resolve: {
                CatalogID: function() {
                    return catalogID;
                }
            }
        }).result;
    }

    function _listRelatedProducts(relatedProductIDs, parameters){
        if(!relatedProductIDs) return null;
        parameters = angular.extend(parameters || {}, {filters: {ID: relatedProductIDs.join('|')}});
        return OrderCloudSDK.Me.ListProducts(parameters);
    }

    function _listFeaturedProducts(parameters) {
        parameters = angular.extend(parameters || {}, {filters: {'xp.Featured': true}});
        return OrderCloudSDK.Me.ListProducts(parameters);
    }
}