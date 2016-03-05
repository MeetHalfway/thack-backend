// controllers/searchController.js

var Promise = require("es6-promise").Promise;
var shortid = require("shortid");

var SkyScannerHelper = require("../helpers/skyScannerExtractor");
var SkyScannerQuery = require("../helpers/skyScannerQuery");

module.exports = {

  /**
   * Do the search for flight options.
   *
   * @param searchObject
   */
  getBestDestinations: function(searchObject) {
    return new Promise(function(resolve, reject) {

      // create a new search id
      var searchId = shortid.generate();

      // query SkyScanner: city to anywhere
      var requestOne = SkyScannerQuery.getAllDestinationsFromCity(
          searchObject.startDate,
          searchObject.endDate,
          searchObject.people[0].city,
          searchObject.people[0].country);

      var requestTwo = SkyScannerQuery.getAllDestinationsFromCity(
          searchObject.startDate,
          searchObject.endDate,
          searchObject.people[1].city,
          searchObject.people[1].country);

      Promise.all([requestOne, requestTwo])
          .then(function(resultArray) {

            // extract best connections
            var bestConnections =
                SkyScannerHelper.extractBestConnections(
                  resultArray[0], resultArray[1]
                );

            // store intermediate results and return results to client
            // TODO

            resolve(bestConnections);

          })
          .catch(reject);
    });
  },

  /**
   * Get the full search results.
   *
   * @param searchId
     */
  getResultDetails: function(searchId) {
    return new Promise(function(resolve, reject) {

      // retrieve data from database

      // trigger detail searches in SkyScanner

      //

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
