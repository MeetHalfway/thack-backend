// routes/accommodation.js

module.exports = function (app) {

    // ==========================================================================
    // CONTROLLER SETUP =========================================================
    // ==========================================================================
    var AccommodationController = require('../controller/accommodationController');

    // =============================================================================
    // ACCOMODATIONS ===============================================================
    // =============================================================================

    app.get('/hotelsAvarage/:city', function (req, res) {

        AccommodationController.getAveragePriceForCity(req.params.city)
            .then(function(result) {
                res.status(200).json(result);
            })
            .catch(function() {
                res.sendStatus(500);
            });

    });

    app.post('/hotels', function (req, res) {

        if(hotelRequestIsValid(req)) {
            AccommodationController.getListOfAccommodations(req.body)
                .then(function(result) {
                    res.status(200).json(result);
                })
                .catch(function() {
                    res.sendStatus(500);
                });
        }
        else {
            res.sendStatus(400);
        }
    });

    app.get('/hotels/:id', function (req, res) {
        AccommodationController.getResults(req.params.id)
            .then(function(result) {
                res.status(200).json(result);
            })
            .catch(function() {
                res.sendStatus(500);
            });
    });

    /**
     * Checks the validity of a search request object.
     *
     * @param req
     * @returns {boolean}
     */
    function hotelRequestIsValid(req) {

        if(req.body['location'] && req.body['startDate'] && req.body['endDate']) {
            if (!timingIsValid(req.body['startDate']) || !timingIsValid(req.body['endDate']))
                return false;
        }
        else
            return false;

        return true;
    }

    /**
     * Check the date and timing format.
     */
    function timingIsValid(timing) {
        var timePattern =
            /^[0-9]{4}\-[0-9]{2}\-[0-9]{2}/;

        return timePattern.test(timing);
    }
};
