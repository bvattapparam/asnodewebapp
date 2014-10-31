/**
 *  PayPal Country resolver
 *  Resolves the country based on several HTTP parameters
 *
 *  country.x    - specify the country directly: case-insensitive. e.g 'us', 'Fr', 'DE'
 *  country co brand -
 *  original.url - specify the original url (in case of redirection).
 *  LANG cookie
 *
 * Country must be valid COW country
 * TODO
 *    - Read session
 */

var url = require('url'),
    cookie = require('../../cookie'),
    CountryResolver,
    CAL_COUNTRY_RULE_KEY = 'rule_cntry',
    CAL_COUNTRY_KEY = 'm_cntry';

var CONSTANTS = {
    defaultCountry : "US",
    country_x_request_param : "country.x",
    country_test_request_param : "country.test",
    original_url : "original.url",
    cookieName : "LANG"

};

module.exports = CountryResolver = function (cowFactory, request, userPref, calEvent) {
    this.cowFactory = cowFactory;
    this.request = request;
    this.userPref = userPref;
    this.calEvent = calEvent;
};


CountryResolver.prototype.resolve = function (req) {

    var country, resFactor;

    this.determiners.some(function (determiner) {

        country = determiner.method.call(this, req);
        resFactor = determiner.name;

        return country;

    }.bind(this));

    if (req.session) {
        req.session.localeCountry = country;
    }

    if (this.calEvent) {
        this.calEvent.addData(CAL_COUNTRY_KEY, country);
        this.calEvent.addData(CAL_COUNTRY_RULE_KEY, resFactor);
    }

    return country;
};


CountryResolver.prototype.determiners = [

    {
        name: 'viaCountryTextUrlParam',
        desc: 'For non-LIVE test, read from country.test url param, e.g. http://localhost.com:3000/?country.test=fr',

        method: function (req) {
            var countryParam,
                result = null;

            if (process.env.DEPLOY_ENV === 'LIVE') {
                return result;
            }

            countryParam = req.query[CONSTANTS.country_test_request_param] || (req.body && req.body[CONSTANTS.country_test_request_param]);

            if (countryParam) {
                countryParam = countryParam.toUpperCase();
                if (this.cowFactory.isValidCountry(countryParam)) {
                    result = countryParam;
                }
            }
            return result;
        }
    },

    {
        name: 'viaUserProfile',
        desc: 'Read from User Preference Object',

        method: function (req) {
            var country = null;
            if (this.userPref) {
                country = this.userPref.country;
            }
            return country;
        }
    },

    {
        name: 'viaCountryXUrlParam',
        desc: 'Read from country.x url param, e.g. http://localhost.com:3000/?country.x=fr',

        method: function (req) {
            var countryParam = req.query[CONSTANTS.country_x_request_param] || (req.body && req.body[CONSTANTS.country_x_request_param]),
                result = null;

            if (countryParam) {
                countryParam = countryParam.toUpperCase();
                if (this.cowFactory.isValidCountry(countryParam)) {
                    result = countryParam;
                }
            }
            return result;
        }
    },

    {
        name: 'viaCountryCoBrand',
        desc: 'Read from URL country brand, e.g. https://www.paypal.com/ca/foo',

        method: function (req) {
            var url = this.request.url,
                urlParts,
                cobrand,
                result = null;
            if (url) {
                urlParts = url.split('/');
                if (urlParts.length > 1) {
                    //if url starts with '/' like '/in', 0th index will be empty
                    cobrand = urlParts[0] || urlParts[1];
                }
            }
            if (cobrand) {
                cobrand = cobrand.toUpperCase();
                if (this.cowFactory.isValidCountry(cobrand)) {
                    result = cobrand;
                }
            }
            return result;
        }
    },

    {
        name: 'viaOriginalURLURLParam',
        desc: 'Read from original.url url param, e.g. http://localhost.paypal.com:3000/?original.url=http%3A%2F%2Flocalhost.com%3A3000%2F%3Fcountry.x%3Dde',

        method: function (req) {
            var originalURLParam = this.request.query[CONSTANTS.original_url],
                countryParam,
                originalUrl,
                result = null;

            if (originalURLParam) {
                originalUrl  = url.parse(originalURLParam, true);
                countryParam = originalUrl.query[CONSTANTS.country_x_request_param];
                if (countryParam) {
                    countryParam = countryParam.toUpperCase();
                    if (this.cowFactory.isValidCountry(countryParam)) {
                        result = countryParam;
                    }
                }
            }
            return result;
        }
    },

    {
        name: 'viaSession',
        desc: 'Read from session',

        method: function (req) {
            return (req.session && req.session.localeCountry) ? req.session.localeCountry : null;
        }
    },

    {
        name: 'viaLangCookie',
        desc: 'Read from LANG cookie',

        method: function (req) {
            var headers,
                cookies,
                langCookie,
                countryParam = null,
                result = null;

            headers = this.request.headers;
            if (headers && headers.cookie) {
                cookies = cookie.parse(headers.cookie);
            }
            if (cookies) {
                langCookie = cookies[CONSTANTS.cookieName];
            }
            if (langCookie) {
                langCookie = langCookie.toLowerCase();
                langCookie = langCookie.split(";");
                if (langCookie.length === 2) {
                    countryParam = langCookie[1];
                }
            }
            if (countryParam) {
                countryParam = countryParam.toUpperCase();
                if (this.cowFactory.isValidCountry(countryParam)) {
                    result = countryParam;
                }
            }
            return result;
        }
    },

    {
        name: 'viaDefault',
        desc: 'Use default country',

        method: function (req) {
            return CONSTANTS.defaultCountry;
        }
    }
];

module.exports.CONSTANTS = CONSTANTS;
