'use strict';


var kraken = require('kraken-js'),
        flash = require('connect-flash'),
        baseURI = require('./config/app.json').requestURI,
        auth = require('./lib/auth'),
        passport = require('passport'),
        mysqlDB = require('mysql'),
        app = {};
        require('./lib/helper-dateFormat');
     //   console.log("BASE" + baseURI);


app.configure = function configure(nconf, next) {
    var connection = mysqlDB.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'testuser',
  database:"as_nodeapp"
});
    passport.use(auth.localStrategy());
    //Give passport a way to serialize and deserialize a user. In this case, by the user's id.
    passport.serializeUser(function (user, done) {
        done(null, user.userid);
    });

    passport.deserializeUser(function (userid, done) {
       /* User.findOne({_id: userid}, function (err, user) {
            done(null, user);
        });*/
     connection.query("select * from tbl_user where userid = "+ userid, function(err, rows){
            done(err, rows[0]);
        });
    });
    // Async method run on startup.
    next(null);
};


app.requestStart = function requestStart(server) {
    // Run before most express middleware has been registered.
};


app.requestBeforeRoute = function requestBeforeRoute(server) {
     server.use(passport.initialize());
    server.use(passport.session());
    server.use(flash());
    server.use(auth.injectUser);
    // Run before any routes have been added.
};


app.requestAfterRoute = function requestAfterRoute(server) {
    // Run after all routes have been added.
};


if (require.main === module) {
    kraken.create(baseURI,app).listen(function (err, server) {
        if (err) {
            console.error(err.stack);
        }
    });
}


module.exports = app;
