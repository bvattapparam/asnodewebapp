'use strict';


    var flash = require('connect-flash'),
    config = require('nconf'),
    rootURI = config.get('requestURI'),
    async = require('async'),
    passport = require('passport'),
    LoginModel = require('../models/login');


module.exports = function (app) {

    var model = new LoginModel();


    /**
     * Display the login page. We also want to display any error messages that result from a failed login attempt.
     */
    app.get('/login', function (req, res) {

        //Include any error messages that come from the login process.
      //  { message: req.flash('loginMessage') }
        model.messages = req.flash('error');
        model.messages1 = req.flash('message');

        console.log("redirected");
        
        res.render('index', model);
    });

    /**
     * Receive the login credentials and authenticate.
     * Successful authentications will go to /profile or if the user was trying to access a secured resource, the URL
     * that was originally requested.
     *
     * Failed authentications will go back to the login page with a helpful error message to be displayed.
     */
    app.post('/login', function (req, res) {
        console.log("ok : " + req.session.goingTo);
        passport.authenticate('local', {
            successRedirect: rootURI + req.session.goingTo || rootURI + "/dashboard",
            failureRedirect:  rootURI+ "/login",
            failureFlash: true
        })(req, res);
console.log("HI");
    });

    /**
     * Allow the users to log out
     */
    app.get('/logout', function (req, res) {
        req.logout();
        res.redirect(rootURI + '/login');
    });

};
