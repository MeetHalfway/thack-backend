// controllers/appController.js

var Promise = require("es6-promise");



module.exports = {

  getAvailableCurrencies: function() {
    return [];
  },

  getAvailableLanguages: function() {
    return [];
  },

  getUser: function(userID) {
    console.log(userID);
    user = {}
    if(userID == 1){
      user.name = "Alessio"

    }else if (userID == 2){
      user.name = "Nele"

    } else {
      user.notFound = true
    }
    return user;
  },

  getCountries: function() {

    return new Promise(function(resolve, reject) {
      
        resolve([]);
    });
  }
};
