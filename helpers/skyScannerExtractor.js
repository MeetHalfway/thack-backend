var _ = require('underscore');

module.exports = {

    extractBestConnections: function(resultSetOne, resultSetTwo) {

        // first reduce all quotes to a price and destination Id only
        var quoteSetOne = resultSetOne['Quotes'].map(function(quote) {
            return {
                minPrice: quote['MinPrice'],
                destinationId: quote['OutboundLeg']['DestinationId']
            };
        });

        var quoteSetTwo = resultSetTwo['Quotes'].map(function(quote) {
            return {
                minPrice: quote['MinPrice'],
                destinationId: quote['OutboundLeg']['DestinationId']
            };
        });

        // filter out all connection from one result set that do not have a match in the other result set
        var finalQuoteSet = quoteSetOne.filter(function(quote) {
            return !!_.find(quoteSetTwo, function(innerQuote) {
                return innerQuote.destinationId === quote.destinationId;
            })
        });

        // sort the reduced result set by price and limit it to 5 items
        finalQuoteSet.sort(function(a, b) {
           return a.minPrice - b.minPrice;
        });

        // create the final data structure that is returned to the client
       return finalQuoteSet.slice(0, 5).map(function(quote) {
            var destinationObject = _.find(resultSetOne['Places'], function(place) {
               return place['PlaceId'] === quote.destinationId;
            });

            if(destinationObject) {
                return {
                    minPrice: quote.minPrice,
                    city: destinationObject['CityName'],
                    country: destinationObject['CountryName'],
                    airportCode: destinationObject['IataCode']
                }
            }
            else
                return null;
        }).filter(function(result) {
            return !!result;
        });
    },

    extractStartLocations: function(resultArray) {

        resultArray[0].forEach(function(result) {
            // TODO
        });

        resultArray[1].forEach(function(result) {
            // TODO
        });

        // TODO think about the data structure of the start locations in the database
        // Should we separate them by the user? Or just add them randomly?
        
        return [];
    }
};