// routes/app.js

module.exports = function (app) {

    // TODO mock user id (should be replaced by authentication in final version)
    var userId = '356a192b7913b04c54574d18c28d46e6395428ab';

    // ==========================================================================
    // CONTROLLER SETUP =========================================================
    // ==========================================================================
    var AppController = require('../controller/userController')(userId);

    // ==========================================================================
    // USER ROUTES ==============================================================
    // ==========================================================================

    app.get('/profile', function (req, res) {
        var user = AppController.getUserData(userId);
        res.status(200).json(user);
    });

    app.get('/friends', function (req, res) {
        var result = AppController.getFriendsList();
        res.status(200).json(result);
    });

    app.get('/friends/:id', function (req, res) {

        var result = AppController.getFriend(req.params.id);
        res.status(200).json(result);
    });
};
