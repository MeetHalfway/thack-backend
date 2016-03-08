var Promise = require('es6-promise').Promise;
var _ = require('underscore');
var https = require('https');

var DISTANCE_IN_KM = 10;
var LIMIT_HOMEWAY_PRICE = 250;

module.exports = {
    
    getAllAccomodationsCity: function(city, startDate, endDate) {

        console.log(city,startDate,endDate, "the variables")

        return new Promise(function(resolve, reject) {

            getLatLong(city)
                .then(function(location) {


                    var options = {
                        hostname: 'ws.homeaway.com',
                        path: '/public/search' + "?centerPointLatitude=" + location.lat + "&centerPointLongitude=" + location.lng + "&distanceInKm=" + DISTANCE_IN_KM + "&sort=prices:asc",
                        headers: { 'Authorization': 'Bearer ZGJmYjQ1ZmMtOTE5Mi00ODY5LTg2OTUtZDZlODBmYWNmYTkx' }
                    };


                    var req = https.request(options, function(res) {
                        var response = "";

                        res.on('data', function(chunk) {
                            response += chunk.toString('utf8');

                         });

                        res.on('error', function(err) {
                            reject(err);
                        });

                        res.on('end', function() {

                            _.each(response.entries, function(entry) { // THIS DOESN'T MAKE ANY SENSE... BUT YOU KNOW, I'M IN A HACKTHON AND ONLY 1.5H LEFT.. MADRE PERDONA MI VIDA LOCA!
                                if(entry.priceRanges[0].from > LIMIT_HOMEWAY_PRICE){
                                    entry.ignore = true;
                                }
                            });

                            console.log(response);


                            resolve(JSON.parse(response));
                        });
                    });

                    req.end();
                })
                .catch(reject);
        });
    }
};

/**
 *
 *
 * @param city
 * @returns {*}
 */
function getLatLong(city) {

    return new Promise(function(resolve, reject){

        var url = "https://maps.googleapis.com/maps/api/geocode/json?address=" + city + "&sensor=false";

        https.get(url, function (res) {
            var response = "";

            res.on('data', function (chunk) {
                response += chunk.toString('utf8');
            });

            res.on('error', reject);

            res.on('end', function () {

                response = JSON.parse(response);

                if(response.results && response.results.length) {
                    var result = {};

                    result.lat = response.results[0].geometry.location.lat;
                    result.lng = response.results[0].geometry.location.lng;

                    resolve(result);
                }
                else
                    reject(Error("No results from Google."));
            });
        });
    })
}

/**
 *
 *
 * @returns {string}
 */
function getHomeAwayToken() {
    return "ah239167722783844563187741844386";
}


