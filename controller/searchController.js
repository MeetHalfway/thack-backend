// controllers/searchController.js

var Promise = require("es6-promise");

module.exports = {

  /**
   * Do the search for flight options.
   *
   * @param searchObject
   */
  getFlights: function(searchObject) {
    return new Promise(function(resolve, reject) {
      resolve([]);
    });
  },

  /**
   * Retrieve results that already have been created.
   *
   * @param searchId
   */
  getResults: function(searchId) {
    return new Promise(function(resolve, reject) {
      resolve([]);
    });
  }
};
