// controllers/accommodationController.js

var Promise = require("es6-promise").Promise;
var homeAwayHelper = require("../helpers/homeAwayQuery");

module.exports = {

  /**
   * get the average price for accommodation in a city.
   *
   * @param reqBody
   */

  getListOfAccommodations: function(reqBody) {
    return homeAwayHelper.getAllAccomodationsCity(reqBody.location);
  },

  getAveragePriceForCity: function(city) {

    return new Promise(function(resolve, reject) {

      homeAwayHelper.getAllAccomodationsCity(city).
      then(function(result) {
        // TODO calc avg

        resolve(50);
      })
      .catch(reject);
    });
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
