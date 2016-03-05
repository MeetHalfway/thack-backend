// routes/search.js

module.exports = function (app) {

    // ==========================================================================
    // CONTROLLER SETUP =========================================================
    // ==========================================================================
    var SearchController = require('../controller/searchController');

    // =============================================================================
    // FLIGHTS =====================================================================
    // =============================================================================
    app.post('/search', function (req, res) {

        if(searchRequestIsValid(req)) {
            SearchController.getFlights(req.body)
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

    app.get('/search/details/:id', function(req, res) {
        SearchController.getResultDetails(req.params.id)
            .then(function(result) {
                res.status(200).json(result);
            })
            .catch(function() {
                res.sendStatus(500);
            });
    });

    app.get('/search/:id', function (req, res) {
        SearchController.getResults(req.params.id)
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
    function searchRequestIsValid(req) {

        if(req.body['startDate'] && req.body['endDate'] &&
            req.body['people'] && req.body['people'].length > 1) {

            if(!timingIsValid(req.body['startDate']) || !timingIsValid(req.body['endDate'])) {
                return false;
            }
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
            /^[0-9]{4}\-[0-9]{2}\-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}$/;

        return timePattern.test(timing);
    }
};
