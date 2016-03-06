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

        var resultSet = [];

        // filter out all connection from one result set that do not have a match in the other result set
        var finalQuoteSet = quoteSetOne.forEach(function(quote) {

            var matchingQuote = _.find(quoteSetTwo, function(innerQuote) {
                return innerQuote.destinationId === quote.destinationId; });

            if(matchingQuote) {
                resultSet.push(quote);
                resultSet[resultSet.length - 1]['minPrice'] += matchingQuote['minPrice'];
            }
        });

        // sort the reduced result set by price and limit it to 5 items
        resultSet.sort(function(a, b) {
           return a.minPrice - b.minPrice;
        });

        // create the final data structure that is returned to the client
       return resultSet.slice(0, 3).map(function(quote) {
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