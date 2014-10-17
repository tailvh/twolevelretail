define(['./module'], function (services) {

  services.factory("SessionService", function() {
    return {
      getArray: function(key) {
        return JSON.parse(sessionStorage.getItem(key));
      },
      setArray: function(key, val) {
        return sessionStorage.setItem(key, JSON.stringify(val));
      },
      get: function(key) {
        return sessionStorage.getItem(key);
      },
      set: function(key, val) {
        return sessionStorage.setItem(key, val);
      },
      unset: function(key) {
        return sessionStorage.removeItem(key);
      }
    }
  });
});