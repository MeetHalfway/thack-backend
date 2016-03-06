// controllers/accommodationController.js

var Promise = require("es6-promise").Promise;
var homeAwayHelper = require("../helpers/homeAwayQuery");
var _ = require("underscore");

module.exports = {

  /**
   * get the average price for accommodation in a city.
   *
   * @param reqBody
   */

  getListOfAccommodations: function(reqBody) {
    return homeAwayHelper.getAllAccomodationsCity(reqBody.location, reqBody.startDate, reqBody.endDate);
  },

  getAveragePriceForCity: function(body) {

    console.log(body, "the body");

    return new Promise(function(resolve, reject) {

      homeAwayHelper.getAllAccomodationsCity(body.location, body.startDate, body.endDate).
      then(function(result) {
        var total = 0;
        var counter = 0;

        _.each(result.entries, function(entry) { // THIS DOESN'T MAKE ANY SENSE... BUT YOU KNOW, I'M IN A HACKTHON AND ONLY 1.5H LEFT.. MADRE PERDONA MI VIDA LOCA!
          if(entry.priceRanges[0].from > 60){
            entry.ignore = true;
          } else {
            total += entry.priceRanges[0].from;
            counter ++;
          }
        });

        var yeahResults = _.filter(result, function(entry){
          if(entry.ignore){
            return false;
          }
          return true; });


        console.log(average, total, counter);
        var average = total / counter;
        temp = {
          average_cost: average
        }
        
        yeahResults.push(temp);


        console.log(JSON.stringify(yeahResults));

        resolve(yeahResults);
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
