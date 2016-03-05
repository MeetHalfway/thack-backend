// controllers/accommodationController.js

var Promise = require("es6-promise").Promise;

module.exports = {

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
