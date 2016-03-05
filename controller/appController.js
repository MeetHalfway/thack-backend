// controllers/appController.js

var Promise = require("es6-promise");

module.exports = {

  getAvailableCurrencies: function() {
    return [];
  },

  getAvailableLanguages: function() {
    return [];
  },

  getCountries: function() {

    return new Promise(function(resolve, reject) {
      
        resolve([]);
    });
  }
};
