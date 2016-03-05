var Promise = require('es6-promise').Promise;
var _ = require('underscore');

var SkyScannerMockBerlin = require("../mocking/SkyScanner.BestPrice.Berlin.json");
var SkyScannerMockBudapest = require("../mocking/SkyScanner.BestPrice.Budapest.json");

module.exports = {

    getAllDestinationsFromCity: function(startDate, endDate, city, country) {

        return new Promise(function(resolve, reject) {

            // TODO implement

            if(city == "Budapest") resolve(SkyScannerMockBudapest);
            else resolve(SkyScannerMockBerlin);
        });
    }
};