// controllers/accommodationController.js

var Promise = require("es6-promise").Promise;
var homeAwayHelper = require("../helpers/homeAwayQuery");

module.exports = {

  /**
   * get the average price for accomodation in a city.
   *
   * @param searchObject
   */

  getListAccomodations: function(city) {

    console.log("works", city);
    return homeAwayHelper.getAllAccomodationsCity(city);

  },

  getAverageForCity: function(city) {

    var list = homeAwayHelper.getAllAccomodationsCity(city);
    //calc avg
    return 0;

  },






  /**
   * Do the search for accommodations.
   *
   * @param searchObject
   */
  getAccommodation: function(searchObject) {
    return new Promise(function(resolve, reject) {
      resolve([]);
    });
  },

  /**
   * Retrieve accommodation results that already have been created.
   *
   * @param searchId
   */
  getResults: function(searchId) {
    return new Promise(function(resolve, reject) {
      resolve([]);
    });
  }
};
