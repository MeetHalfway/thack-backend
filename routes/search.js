// routes/search.js

module.exports = function (app) {

    // TODO mock user id (should be replaced by authentication in final version)
    var userId = '356a192b7913b04c54574d18c28d46e6395428ab';

    // ==========================================================================
    // CONTROLLER SETUP =========================================================
    // ==========================================================================
    var SearchController = require('../controller/searchController');
    var AppController = require('../controller/userController')(userId);

    // =============================================================================
    // FLIGHTS =====================================================================
    // =============================================================================
    app.post('/search', function (req, res) {

        if(searchRequestIsValid(req)) {
            var user = AppController.getUserData(userId);

            SearchController.getBestDestinations(req.body, user)
                .then(function(result) {
                    res.set('Access-Control-Allow-Origin', '*');
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

    app.get('/result/:id', function (req, res) {
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
     * {
     *   startDate: "2016-06-12",
     *   endDate: "2016-06-15",
     *   friend: { ... }
     *
     * @param req
     * @returns {boolean}
     */
    function searchRequestIsValid(req) {

        if(req.body['startDate'] && req.body['endDate'] && req.body['friend']) {

            if(!timingIsValid(req.body['startDate']) || !timingIsValid(req.body['endDate']))
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
