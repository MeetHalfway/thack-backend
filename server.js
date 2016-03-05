// server.js

// set up ======================================================================
var express           = require('express'),
    session           = require('express-session'),
    morgan            = require('morgan'),
    cookieParser      = require('cookie-parser'),
    bodyParser        = require('body-parser');

// initiate server instance
var app = express();

// configuration ===============================================================
var port = process.env.PORT || 8080;

/**
 * General server setup is happening here. We are setting up the middleware
 * that is used for each incoming request.
 */
function setupServer() {

    app.use(morgan('dev')); // log every request to the console
    app.use(bodyParser.urlencoded({ // parse application/x-www-form-urlencoded
      extended: false
    }));
    app.use(bodyParser.json()); // parse application/json
    app.use(cookieParser());
    app.use(session({
      secret: 'errare humanum est',
      cookie: {
        httpOnly: true,
        secure: false, // https required for setting it to true
        maxAge: null // session cookie: is deleted after closing the browser
      },
      resave: false,
      saveUninitialized: false // passport will take care
      /* store: e.g. Redis Store */ // redis store for session data
    }));

    app.set('jwtTokenSecret', 'secretsecret');
}

/**
 * Start Express
 */
function start () {
  setupServer();

	// load routes with fully configured express and passport
	// ....
 
  // put this at end of the list. It will deny all requests that are
  // not defined in the previous routes files.
  require('./routes/app.js')(app);

  app.listen(port);
  console.log('\tServer started on port ' + port + '.');
}

// start the server ============================================================
start();


