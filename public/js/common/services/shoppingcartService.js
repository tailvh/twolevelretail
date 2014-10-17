define(['./module'], function (services) {

  services.factory("ShoppingcartService", ['SessionService', function(SessionService) {

    return {
        cart: function() {
            return SessionService.getArray('cart');
        },
        total_quantity: function() {
            var cart = SessionService.getArray('cart');
            if(cart == null) cart = [];

            if(cart.length == 0) {
                return 0;
            }
            else {
                return cart.map(function(x) { return x.quantity }).reduce(function(x, y) { return x + y });
            }
        },
        total: function() {
            var cart = SessionService.getArray('cart');
            if(cart == null) cart = [];

            if(cart.length == 0) {
                return 0.0;
            }
            else {
                return cart.map(function(x) { return x.line_total }).reduce(function(x, y) { return x + y });
            }
        },
        hasItem: function(id) {
            var cart = SessionService.getArray('cart');
            if(cart == null) cart = [];

            console.log("Calling hasItem with id: " + id);
            item_idx = cart.map(function(x) { return x.id }).indexOf(id);
            item_found = item_idx >= 0;
            console.log("Item found: " + item_found);
            return item_found;
        },
        addItem: function(item, quantity) {
            console.log("Calling addItemToCart with item id: " + item.id + ", quantity: " + quantity);
            var cart = SessionService.getArray('cart');
            if(cart == null) cart = [];
            idx = cart.map(function(x) { return x.id }).indexOf(item.id);
            if(idx >= 0) {
                cart[idx].quantity += quantity;
                cart[idx].line_total = item.product_price * cart[idx].quantity
            }
            else {
                cart.push({ id: item.id,
                                  name: item.product_name,
                                  price: item.product_price,
                                  quantity: quantity,
                                  line_total: item.product_price * quantity,
                                  picture: item.product_picture });
            }
            SessionService.setArray('cart', cart);
        },
        removeItem: function(item) {
            var cart = SessionService.getArray('cart');
            if(cart == null) cart = [];
            if(this.hasItem(item.id)) {
                cart = cart.filter(function(x) { return x.id != item.id });
            }
            SessionService.setArray('cart', cart);
        },
        emptyCart: function() {

        }
    };
  }]);
});