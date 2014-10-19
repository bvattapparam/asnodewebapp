/**
 * Module that will handle our authentication tasks
 */
'use strict';

var config = require('nconf'),
        rootURI =require('../config/app.json').requestURI,
        async = require('async'),
        mysqlDB=require('mysql'),
        dbconfig = require('./database1'),
        LocalStrategy = require('passport-local').Strategy,
        bcrypt = require('bcrypt'),
        Helper = require('../lib/helper');
        
    console.log("111111111" + rootURI);


exports.config = function (settings) {

};

/**
 * A helper method to retrieve a user from a local DB and ensure that the provided password matches.
 * @param req
 * @param res
 * @param next
 */
exports.localStrategy = function () {

    return new LocalStrategy({usernameField:'email', passwordField:'password'}, function (username,password, done) {

var connection = mysqlDB.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'testuser',
  database:"as_nodeapp"
});

// LIVE
// var connection = mysqlDB.createConnection({
//   host     : '127.3.39.129',
//   user     : 'adminXFreqs7',
//   password : 'XxAjSNGL5BAR',
//   database:"asna"
// });

            connection.query("select * from tbl_user where username = '" + username + "'", function(err, user){
             
                if (err){
                    console.log("REACHED ERROR in DB || TABLE");
                    return done(err);
                }else
                {
                            console.log("REACHED INSIDE THE USERNAME CHECK");
                            if (!user.length) {
                            console.log("length");
                           // return done(null, false, req.flash('message', 'No user found.')); // req.flash is the way to set flashdata using connect-flash
                            return done(null, false, {'message':'No user found.'}); // req.flash is the way to set flashdata using connect-flash

                        }
                          if (!bcrypt.compareSync(password, user[0].password)){
                            console.log("pwd");
                            //return done(null, false, req.flash('message', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata
                        return done(null, false, {'message': 'Oops! Wrong password.'}); // create the loginMessage and save it to session as flashdata

                        // all is well, return successful user
                        }
                        return done(null, user[0]);
                }
                console.log("HERE");

                
            });
    
    });
};

/**
 * A helper method to determine if a user has been authenticated, and if they have the right role.
 * If the user is not known, redirect to the login page. If the role doesn't match, show a 403 page.
 * @param role The role that a user should have to pass authentication.
 */
exports.isAuthenticated = function (role) {

    return function (req, res, next) {

        if (!req.isAuthenticated()) {
//var rootURI = config.get('requestURI');
            //If the user is not authorized, save the location that was being accessed so we can redirect afterwards.
            req.session.goingTo = rootURI+req.url;
           console.log("SESSION URL :" + req.session.goingTo);
            res.redirect(rootURI+'/login');
            console.log("lastone");
            return;
        }

        //If a role was specified, make sure that the user has it.
        if (role && req.user.role !== role) {
            res.status(401);
            res.render('errors/401');
            return;
        }

        next();
    };
};

/**
 * A helper method to add the user to the response context so we don't have to manually do it.
 * @param req
 * @param res
 * @param next
 */
exports.injectUser = function (req, res, next) {
    if (req.isAuthenticated()) {
        res.locals.user = req.user;
    }
    next();
};
