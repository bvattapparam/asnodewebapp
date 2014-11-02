/**
  * Module dependencies.
  */

var express = require('express'),
    locale = require('./index'),
    util = require('util'),
    utils = require('./lib/utils'),
    cal = utils.tryRequire('cal'),
    app = express(),
    fs = require('fs'),
    async = require('async');

if (cal) {
    cal.defaults.writeStream = process.stdout;
}

app.use(express.favicon());

// required to parse the session cookie
app.use(express.cookieParser());

app.use(locale({lazyLoad: true, locales: ['US']}));

// request logging
app.use(express.logger());

app.get('/', function (req, res) {
    var locality = req.locality,
        date = new Date(),
        country = locality.country,
        culture = locality.culture,
        countrySpecifics = locality.getCountrySpecifics(),
        //userPref = req.paypal ? req.paypal.userPref : null;
        userPref =  null;

    var formatter = locale.formatter(country, culture);

    res.send('locality :' + JSON.stringify(locality) +
        "<br/><br/>  userPref : " + JSON.stringify(userPref) +
        "<br/><br/> currency : " + countrySpecifics.getCurrencyCode() +
        "<br/><br/> number : " + formatter.format(1234555, "n") +
        "<br/><br/> currency : " + formatter.formatCurrency(10000) +
        "<br/><br/> short date : " + formatter.format(date, "d") +
        "<br/><br/> long date : " + formatter.format(date, "D") +
        "<br/><br/> parseInt : " + formatter.parseInt("12312") +
        "<br/><br/> parseFloat : " + formatter.parseFloat("1231231.1231") +
        "<br/><br/> <a href=\"/\"> with test user</a>  | <a href=\"/?nouser=true\"> without user</a>"
        );
});

app.listen(3000);
console.log('Express app started on port 3000');