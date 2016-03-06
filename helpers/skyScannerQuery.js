var Promise = require('es6-promise').Promise;
var _ = require('underscore');
var http = require('http');

var SkyScannerMockBerlin = require("../mocking/SkyScanner.BestPrice.Berlin.json");
var SkyScannerMockBudapest = require("../mocking/SkyScanner.BestPrice.Budapest.json");

module.exports = {

    getAllDestinationsFromCity: function(startDate, endDate, city, country) {

        return new Promise(function(resolve, reject) {

            var url = "http://partners.api.skyscanner.net/apiservices/browseroutes/v1.0/"
                + country // "GB"
                + "/EUR/en-US/"
                + city // LON
                + "/anywhere/"
                + startDate + "/"
                + endDate + "?apiKey=" + getApiKey();

            http.get(url, function (res) {
                var response = "";

                res.on('data', function (chunk) {
                    response += chunk.toString('utf8');
                });

                res.on('end', function () {
                    resolve(JSON.parse(response));
                });
            });
        });
    },

    getConnection: function(startDate, endDate, origin, destination) {

        return new Promise(function(resolve, reject) {

            // TODO implement

            resolve({});
        });
    }
};

function getApiKey() {
    return "ah239167722783844563187741844386"
}