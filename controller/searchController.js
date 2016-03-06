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
   * @param userObject
   */
  getBestDestinations: function(searchObject, userObject) {
    return new Promise(function(resolve, reject) {

      // create a new search id
      var searchId = shortid.generate();

      // query SkyScanner: city to anywhere
      var requestOne = SkyScannerQuery.getAllDestinationsFromCity(
          searchObject.startDate,
          searchObject.endDate,
          searchObject.friend.city,
          searchObject.friend.country);

      var requestTwo = SkyScannerQuery.getAllDestinationsFromCity(
          searchObject.startDate,
          searchObject.endDate,
          userObject.city,
          userObject.country);

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
              people: [
                  searchObject.friend,
                  userObject
              ],
              bestConnections: bestConnections,
              trips: []
            };

            Storage.update({ _id: searchId }, resultDoc, { upsert: true }, function (err, numReplaced, upsert) {
              // if no document with the given id is found, it will add a new document to the collection
              if(err) reject(err);
              if(!upsert && numReplaced == 0) reject(Error('Could not store the result object.'));

              resolve({
                searchId: searchId,
                destinations: bestConnections,
                people: [
                  searchObject.friend,
                  userObject
                ]
              });
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

          var promiseArray = [];
          docs.bestConnections.forEach(function(connection) {

            promiseArray.push(
                SkyScannerQuery.getConnection("", "", connection.originLocations[0], connection.destinationLocation),
                SkyScannerQuery.getConnection("", "", connection.originLocations[1], connection.destinationLocation)
            );
          });

          Promise.all(promiseArray)
            .then(function(resultArray) {

              var tripArray = [];

              for(var i=0; i<resultArray.length - 1; i+=2) {
                tripArray.push([
                    resultArray[i],
                    resultArray[i+1]
                ])
              }

              // store the trips
              var resultDoc = {
                trips: tripArray
              };

              Storage.update({ _id: searchId }, resultDoc, { upsert: true }, function (err, numReplaced, upsert) {
                // if no document with the given id is found, it will add a new document to the collection
                if(err) reject(err);
                if(!upsert && numReplaced == 0) reject(Error('Could not store the result object.'));

                resolve(tripArray);
              });
            });
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

      var searchObject = { _id: searchId };

      Storage.find(searchObject, function (err, docs) {
        if (err) reject(err);

        // docs is an array containing documents
        if (!docs || docs.length == 0) reject(new Error('No document could be found.'));
        else {
          if (docs.length > 1) console.warn('warn', 'More than one document with the given ID found.');

          resolve(docs[0]);
        }
      });
    });
  }
};
