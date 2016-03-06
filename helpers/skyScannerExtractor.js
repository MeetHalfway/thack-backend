var _ = require('underscore');

module.exports = {

    extractBestConnections: function(resultSetOne, resultSetTwo) {

        // first reduce all quotes to a price and destination Id only
        var quoteSetOne = resultSetOne['Quotes'].map(function(quote) {
            return {
                minPrice: quote['MinPrice'],
                originId: quote['OutboundLeg']['OriginId'],
                destinationId: quote['OutboundLeg']['DestinationId']
            };
        });

        var quoteSetTwo = resultSetTwo['Quotes'].map(function(quote) {
            return {
                minPrice: quote['MinPrice'],
                originId: quote['OutboundLeg']['OriginId'],
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

           var originObjectOne = _.find(resultSetOne['Places'], function(place) {
               return place['PlaceId'] === quote.originId;
           });

           var tempQuoteObject = _.find(resultSetTwo['Quotes'], function(innerQuote) {
               return innerQuote['OutboundLeg']['DestinationId'] === quote.destinationId;
           });

           var originObjectTwo = _.find(resultSetTwo['Places'], function(place) {
               return place['PlaceId'] === tempQuoteObject['OutboundLeg']['OriginId'];
           });

           if(destinationObject) {

              return {
                minPrice: quote.minPrice,
                city: destinationObject['CityName'],
                country: destinationObject['CountryName'],
                destinationLocation: destinationObject['IataCode'],
                originLocations: [originObjectOne['IataCode'], originObjectTwo['IataCode']]
              }
            }
            else
                return null;
        }).filter(function(result) {
            return !!result;
        });
    }
};