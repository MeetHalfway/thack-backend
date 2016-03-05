// controllers/searchController.js

var Promise = require("es6-promise").Promise;
var shortid = require("shortid");
var nedb = require('nedb');

var SkyScannerHelper = require("../helpers/skyScannerExtractor");
var SkyScannerQuery = require("../helpers/skyScannerQuery");

var Storage = new nedb();

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
            var resultDoc = {
              _id: searchId,
              timestamp: Math.floor(Date.now() / 1000),
              bestConnections: bestConnections
            };

            Storage.update({ _id: searchId }, resultDoc, { upsert: true }, function (err, numReplaced, upsert) {
              // if no document with the given id is found, it will add a new document to the collection
              if(err) reject(err);
              if(!upsert && numReplaced == 0) reject(Error('Could not store the result object.'));

              resolve(bestConnections);
            });
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
      var searchObject = { _id: searchId };

      Storage.find(searchObject, function (err, docs) {
        if(err) reject(err);

        // docs is an array containing documents
        if(!docs || docs.length == 0) reject(new Error('No document could be found.'));
        else {
          if(docs.length > 1) console.warn('warn', 'More than one document with the given ID found.');

          // TODO trigger detail searches in SkyScanner

          resolve(docs[0]['bestConnections']);
        }
      });
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
