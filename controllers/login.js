'use strict';


    var flash = require('connect-flash'),
    config = require('nconf'),
    rootURI = config.get('requestURI'),
    async = require('async'),
    passport = require('passport'),
    LoginModel = require('../models/login'),
    Helper=require('../lib/helper'),
    helper=new Helper();


module.exports = function (app) {

    var model = new LoginModel();

    /**
     * Display the login page. We also want to display any error messages that result from a failed login attempt.
     */

     app.get('/', function (req, res){
        res.render('index',model);
     });

    app.get('/login', function (req, res) {

        model.messages = req.flash('error');
      
        helper.sConsole("REACHED TO LOGIN VIEW");
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
        passport.authenticate('local', {
            successRedirect:   req.session.goingTo || rootURI + "/dashboard",
            failureRedirect:  rootURI+ "/login",
            failureFlash: true
        })(req, res);
    });

    /**
     * Allow the users to log out
     */
    app.get('/logout', function (req, res) {
        req.logout();
        res.redirect(rootURI + '/login');
    });

};
