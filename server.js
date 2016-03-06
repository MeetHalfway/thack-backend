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

    // Add headers
    app.use(function (req, res, next) {
        // Website you wish to allow to connect
        res.setHeader('Access-Control-Allow-Origin', '*');

        // Request methods you wish to allow
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

        // Request headers you wish to allow
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

        // Set to true if you need the website to include cookies in the requests sent
        // to the API (e.g. in case you use sessions)
        res.setHeader('Access-Control-Allow-Credentials', true);

        // Pass to next layer of middleware
        next();
    });

    app.set('jwtTokenSecret', 'secretsecret');
}

/**
 * Start Express
 */
function start () {
    setupServer();

	// load routes with fully configured express
    require('./routes/search.js')(app);
    require('./routes/accommodation.js')(app);
    require('./routes/user.js')(app);

    // put this at end of the list. It will deny all requests that are
    // not defined in the previous routes files.
    require('./routes/app.js')(app);

    app.listen(port);
    console.log('\tServer started on port ' + port + '.');
}

// start the server ============================================================
start();


