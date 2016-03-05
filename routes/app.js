// routes/app.js

module.exports = function (app) {

  // ==========================================================================
  // CONTROLLER SETUP =========================================================
  // ==========================================================================
  var AppController = require('../controller/appController');

  // =============================================================================
  // LANGUAGE ====================================================================
  // =============================================================================
  app.get('/locales', function (req, res) {

    var languages = AppController.getAvailableLanguages();
    res.status(200).json(languages);
  });

  app.get('/user/:id', function (req, res) {

    var userID = req.params.id;
    var user = AppController.getUser(userID);
    res.status(200).json(user);


    /*console.log('userID req = ' + userID);
    console.log(JSON.stringify(user))*/

  });

  app.get('/locales/:code', function (req, res) {

    var languageCode = req.param('code');
    console.log('Language code retrieved: ' + languageCode);

    AppController.getTranslations(languageCode)
      .then(function(translations) {
        res.status(200).json(translations);
      })
      .catch(function(err) {
        res.status(500).json(err.message);
      });
  });

  // =============================================================================
  // CURRENCY ====================================================================
  // =============================================================================
  app.get('/currencies', function (req, res) {

    var currencies = AppController.getAvailableCurrencies();
    res.status(200).json(currencies);
  });

  app.get('/countries', function (req, res) {

    AppController.getCountries()
      .then(function(countryList) {
        res.status(200).json(countryList);
      })
      .catch(function(err) {
        res.status(500).json(err.message);
      });
  });

  // =============================================================================
  // FALLBACK ====================================================================
  // =============================================================================

  // all other requests should be answered with 404
  app.use('*', function (req, res) {
    res.status(404).send('Whattaheck are you doing here eh? You deserve a 404');
  });
};
