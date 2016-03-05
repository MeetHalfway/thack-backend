// routes/users.js

module.exports = function (app) {


  // =============================================================================
  // FALLBACK ====================================================================
  // =============================================================================

  // all other requests should be answered with 404
  app.use('*', function (req, res) {
    res.status(404).send('Whattaheck are you doing here eh? You deserve a 404');
  });
};
