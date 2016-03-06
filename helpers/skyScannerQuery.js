var Promise = require('es6-promise').Promise;
var _ = require('underscore');
var http = require('http');
var querystring = require('querystring');

var SkyScannerMockBerlin = require("../mocking/SkyScanner.BestPrice.Berlin.json");
var SkyScannerMockBudapest = require("../mocking/SkyScanner.BestPrice.Budapest.json");

module.exports = {

    /**
     *
     *
     * @param startDate
     * @param endDate
     * @param city
     * @param country
     * @returns {*}
     */
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

    /**
     *
     *
     * @param startDate
     * @param endDate
     * @param origin
     * @param destination
     * @returns {*}
     */
    getConnection: function(startDate, endDate, origin, destination) {

        /*
        console.log(startDate);
        console.log(endDate);
        console.log(origin);
        console.log(destination);
        console.log();
        */

        return getFlightData(origin, destination, startDate, endDate, "DE")
    }
};

function getApiKey() {
    return "ah239167722783844563187741844386"
}

/**
 * Queries the SkyScanner API and returns a Promise that resolves to a
 * IItinerary array containing all trips based on the given parameters.
 *
 * @param origin
 * @param destination
 * @param startDate
 * @param endDate
 * @param country
 */
function getFlightData(origin, destination, startDate, endDate, country) {

    // build the post object with mandatory fields
    var postObject = {
        apikey: getApiKey(),
        country: country,
        currency: "EUR",
        locale: "en-US",
        originPlace: origin,
        destinationPlace: destination,
        outboundDate: startDate,
        inboundDate: endDate,
        locationSchema: 'Iata'
    };

    var postData = querystring.stringify(postObject);

    var options = {
        hostname: 'partners.api.skyscanner.net',
        port: 80,
        path: '/apiservices/pricing/v1.0',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json',
            'Content-Length': postData.length
        }
    };

    return new Promise(function (resolve, reject) {

        new Promise(function (innerResolve, innerReject) {

            var postRequest = http.request(options, function (postResponse) {
                console.log('getFlightData() - post request data: ' + postObject);
                console.log('getFlightData() - post response status: ' + postResponse.statusCode);

                var requestUrl = postResponse.headers.location;

                if (postResponse.statusCode == 201 && requestUrl.length != 0)
                    innerResolve(requestUrl);
                else {
                    if(postResponse.statusCode == 429)
                        console.warn("There have been too many requests in the last minute.");

                    innerReject(Error("There was a problem with the request."));
                }
            });

            postRequest.on("error", function() {
                innerReject(new Error("Initial post request failed."));
            });

            postRequest.write(postData);
            postRequest.end();
        })
            .then(function (sessionRequestUrl) {
                // all responses will be stored in here
                var responseArray = [];

                var requestUrl = sessionRequestUrl +
                    "?apiKey=" + getApiKey() +
                    "&locationschema=Iata";

                // after creating the session please allow at least one second before
                // polling the session
                setTimeout(function () {

                    http.get(requestUrl, function (initialResponse) {
                        var response = "";

                        initialResponse.on('data', function (chunk) {
                            response += chunk.toString('utf8');
                        });

                        initialResponse.on('end', function () {
                            try {
                                var responseJSON = JSON.parse(response);
                                responseArray.push(responseJSON);
                            }
                            catch(err) {
                                console.error("Could not parse response from SkyScanner.");
                            }

                            var updateUrl = initialResponse.headers.location +
                                "&apiKey=" + getApiKey();

                            // check in intervals for new data
                            var timer = setInterval(function () {
                                var answer = responseArray[responseArray.length - 1];

                                if (answer['Status'] &&
                                    answer['Status'] == "UpdatesComplete") {
                                    clearInterval(timer);

                                    var accumulatedResponseObject;

                                    if (responseArray.length == 1) {
                                        accumulatedResponseObject = responseArray[0];
                                    }
                                    else {
                                        var places = [];
                                        var carriers = [];

                                        responseArray.forEach(function (response) {
                                            if (response['Places'] && response['Places'].length)
                                                places = places.concat(places,
                                                    response['Places'].slice(0));

                                            if (response['Carriers'] && response['Carriers'].length)
                                                carriers = carriers.concat(carriers,
                                                    response['Carriers'].slice(0));
                                        });

                                        var lastElementIndex = responseArray.length - 1;

                                        accumulatedResponseObject = {
                                            SessionKey: responseArray[0]['SessionKey'],
                                            Query: responseArray[0]['Query'],
                                            Status: responseArray[lastElementIndex]['Status'],
                                            Itineraries: responseArray[lastElementIndex]['Itineraries'],
                                            Legs: responseArray[lastElementIndex]['Legs'],
                                            Segments: responseArray[lastElementIndex]['Segments'],
                                            Carriers: carriers,
                                            Agents: responseArray[lastElementIndex]['Agents'],
                                            Places: places,
                                            Currencies: responseArray[0]['Currencies']
                                        };
                                    }

                                    resolve(accumulatedResponseObject);
                                }
                                else {
                                    // request not yet complete, pull for changes
                                    http.get(updateUrl, function (updateResponse) {

                                        // set new update request url if there was a 200 response
                                        if (updateResponse.statusCode === 200)
                                            updateUrl = updateResponse.headers.location + "&apiKey=" +
                                                getApiKey();
                                        else
                                            return;

                                        var subsequentResponse = "";

                                        updateResponse.on('data', function (chunk) {
                                            subsequentResponse += chunk.toString('utf8');
                                        });

                                        updateResponse.on('end', function () {
                                            if (subsequentResponse.length == 0) return;

                                            try {
                                                responseArray.push(JSON.parse(subsequentResponse));
                                            }
                                            catch (err) {
                                                console.error("Could not parse subsequent response" +
                                                    " from SkyScanner: " + err.message);
                                            }
                                        });
                                    }).on('error', function(err) {
                                        console.error('Could not update request data: ' + err.message);
                                    });
                                }
                            }, 1500); // wait for 1.5 seconds before pulling again
                        });
                    }).on('error', function(err) {
                        console.error('Could not pull session data: ' + err.message);
                    });
                }, 1500); // wait for 1.5 seconds before pulling the result data
            })
            .catch(reject);
    });
}