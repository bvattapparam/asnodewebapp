'use strict';
var kraken = require('kraken-js'),
        flash = require('connect-flash'),
        baseURI = require('./config/app.json').requestURI,
        auth = require('./lib/auth'),
        passport = require('passport'),
        dbConModel = require("./models/dbcon"),
        mysqlDB = require('mysql'),
        Helper=require('./lib/helper'),
        helper=new Helper(),
                app = {};
        require('./lib/helper-supplement');
        
app.configure = function configure(nconf, next) {
    
    passport.use(auth.localStrategy());
    //Give passport a way to serialize and deserialize a user. In this case, by the user's id.
    passport.serializeUser(function (user, done) {
        done(null, user.userid);
    });

    passport.deserializeUser(function (userid, done) {
        
        var dbConnection=helper.dbConfigSet();
        dbConnection.getConnection(function(err,connection){
                                                if(err){
                                                                helper.sConsole("get Connection ERROR on Passport : ", err);
                                                }
                                                else
                                                {
                                                               var oRowFetch= connection.query('SELECT * FROM tbl_user where userid='+userid, function(err,result){
                                                                                connection.release();
                                                                                 done(err, result[0]);
                                                                });
                                                }
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
    server.use(function (req, res) {
            /* TODO: need to block this page for unauthed users. */
            res.status("404");
           // console.log("hrere is the status"+ res.status());

            if(!req.model) {
                req.model = {};
            }
            req.model.viewName =  "errors/error404";

            res.render(req.model.viewName, req.model);
        });

     /* Handle 500 errors */
        // server.use(function (err, req, res, next) {
        //     res.status(err.status || "500");
        // if (!req.model) {
        //     req.model = {};
        // }
        // req.model.viewName = "errors/error500";
        // res.render(req.model.viewName, req.model);
        // });

};


if (require.main === module) {
    kraken.create(baseURI,app).listen(function (err, server) {
        if (err) {
            console.error(err.stack);
        }
    });
}


module.exports = app;
