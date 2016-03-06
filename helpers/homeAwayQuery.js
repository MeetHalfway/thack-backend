var Promise = require('es6-promise').Promise;
var _ = require('underscore');
var http = require('http');

var SkyScannerMockBerlin = require("../mocking/SkyScanner.BestPrice.Berlin.json");
var SkyScannerMockBudapest = require("../mocking/SkyScanner.BestPrice.Budapest.json");

module.exports = {

    //https://ws.homeaway.com/public/search?centerPointLatitude=50.083&centerPointLongitude=14.416&distanceInKm=10

    Token_HomeAway: "ah239167722783844563187741844386",
    distanceInKm: 10,



    getAllAccomodationsCity: function(city) {
        var self = this;

        console.log('yuuuhuu! here', city);
        return new Promise(function(resolve, reject) {

            self.getLatLong(city).then(function(location){

                console.log("yuuhuu! Inside the promise with", location);
                var options = {
                    host: 'ws.homeaway.com',
                    path: 'public/search'+ "?centerPointLatitude=" + location.lat + "&centerPointLongitude=" + location.lng + "distanceInKm=" + self.distanceInKm,
                    headers: {'Authorization': 'Bearer ZGJmYjQ1ZmMtOTE5Mi00ODY5LTg2OTUtZDZlODBmYWNmYTkx'},
                    port: 8080,
                    method: 'GET'
                };

                console.log('inside the getlangpromise',options);

                http.request(options, function (res) {
                    console.log("inside get")
                    var response = "";

                    res.on('data', function (chunk) {
                        response += chunk.toString('utf8');
                        console.log("response", response);
                    });

                    res.on('end', function () {
                        console.log("ended!");
                        resolve(console(JSON.parse(response)));
                    });
            });
        });


        });

    },


    getLatLong: function(city) {
        return new Promise(function(resolve, reject){

            var result = {};
            var url = "http://maps.googleapis.com/maps/api/geocode/json?address="+city+"&sensor=false";

            http.get(url, function (res) {
                var response = "";

                res.on('data', function (chunk) {
                    response += chunk.toString('utf8');
                });

                res.on('error', reject);

                res.on('end', function () {
                    response = JSON.parse(response);
                    console.log(response.results[0].geometry.location.lng);
                    result.lat = response.results[0].geometry.location.lat;
                    result.lng = response.results[0].geometry.location.lng;
                    resolve(result);
                });
            });

        })


    }

};
