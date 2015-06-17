/// <reference path="typings/node/node.d.ts"/>
if (process.env.NEW_RELIC_LICENSE_KEY && (process.env.NEW_RELIC_LICENSE_KEY != 'NONE')) {
	var newrelic = require('newrelic');
  console.log('new relic should be initialized now.')
} else {
  console.log('new relic is switched off');
};
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('./util/logger');


var app = express();

// TODO: Authentication stuff - refactor later
// must be called before router is set up.
var passport = require('passport');
var OAuth2Strategy = require('passport-oauth2').Strategy;

function findById(id, done) {
  // TODO : session store of additional fields
  var user = { id: id, first: 'John', last: 'Smith'  };
  done(null, user); 
}

passport.use(new OAuth2Strategy({
    authorizationURL: 'https://registration.frontiersin.org/oauth2/auth',
    tokenURL: 'https://registration.frontiersin.org/oauth2/token',
    clientID: process.env.LOOP_CLIENT_ID,
    clientSecret: process.env.LOOP_CLIENT_SECRET,
    callbackURL: "https://localhost:3000/auth/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    findById({ id: profile.id }, function (err, user) {
      return done(err, user);
    });
  }
));
var session = require('express-session');
// logger.info('session required: ' + session);

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  findById(id, function (err, user) {
      done(err, user);
  });
});




// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// session setup must be after cookieParser and before router
app.use(session({
    secret: process.env.SESSION_KEY || 'D9AA8C93-8515-492E-B131-D3FA2DD55C44',
    resave: false,
    saveUninitialized: true 
}));
app.use(passport.initialize());
app.use(passport.session());
// TODO: this should not be necessary....
app.use(function(req, res, next) {
  res.locals.session = req.session;
	logger.info('session: ' + JSON.stringify(req.session));
  next();
});
// set up routes - AFTER passport setup
var routes = require('./routes/index');
var users = require('./routes/users');
var auth = require('./routes/auth');

app.use('/', routes);
app.use('/users', users);
app.use('/auth', auth);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        logger.error('dev error route called with err: ' + JSON.stringify(err));
        logger.error('--- and with req: ' + req);
        res.status(err.status || 500);
        res.render('pages/error', {
            title: 'loopnav error',
            message: err.message,
            error: err
        });
    });
} else {
    // production error handler
    // no stacktraces leaked to user.
    app.use(function (err, req, res, next) {
        logger.error('production error route called');
        res.status(err.status || 500);
        res.render('pages/error', {
            title: 'loopnav error',
            message: err.message,
            error: {}
        });
    });
};

module.exports = app;
