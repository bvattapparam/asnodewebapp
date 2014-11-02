/**
 *  PayPal Dialect resolver
 *  A Dialect is represented by a language and a country code as en_US
 *
 *  locale.x    - specify the locale directly: case-insensitive. e.g 'en_US', 'fr_FR'
 *  LANG cookie
 *  User profile language preference
 *  Browser Language preference
 *  Default for the country
 *
 * Dialect must be valid COW dialect
 *
 */

var cookie = require('../../cookie'),
    DialectResolver,
    CAL_DIALECT_KEY = 'm_locale',
    CAL_DIALECT_RULE_KEY = 'rule_locale';

var CONSTANTS = {
    locale_x_request_param : 'locale.x',
    locale_test_request_param : 'locale.test',
    cookieName : 'LANG',
    defaultLanguage : 'en_US'
};

function setCookie(response, dialect, country) {
    response.cookie(CONSTANTS.cookieName, dialect + ';' + country, {
            domain: '.paypal.com',
            path: '/',
            expires: new Date(Date.now() + 31556000),
            httpOnly: true
        });
}

/**
 * removing all the _XC and converting to country specific locales
 * like instead of fr_XC, using fr-US for US
 * like instead of es_XC, using es-MX for MX and es-BR for BR
 */
function dialectSanitizer(dialect) {
    var ndialect = null;
    if (dialect) {
        ndialect = dialect.replace('_XC', '');
    }
    return ndialect;
}

module.exports = DialectResolver = function (cow, request, response, userPref, country, calEvent) {
    this.cow = cow;
    this.request = request;
    this.response = response;
    this.userPref = userPref;
    this.country = country;
    this.calEvent = calEvent;
};

module.exports.getDefaultLanguage = function getDefaultLanguage(cow) {
    var defaultLanguage = CONSTANTS.defaultLanguage;

    if (cow.getLanguages()) {
        defaultLanguage = cow.getLanguages()[0];
    }
    defaultLanguage = dialectSanitizer(defaultLanguage);
    return defaultLanguage;
};

DialectResolver.prototype.resolve = function (req) {

    var dialect, resFactor;

    this.determiners.some(function (determiner) {

        dialect = determiner.method.call(this, req);
        resFactor = determiner.name;

        return dialect;

    }.bind(this));

    if (req.session) {
        req.session.localeDialect = dialect;
    }

    if (this.calEvent) {
        this.calEvent.addData(CAL_DIALECT_KEY, dialect);
        this.calEvent.addData(CAL_DIALECT_RULE_KEY, resFactor);
    }

    return dialect;
};


DialectResolver.prototype.determiners = [

    {
        name: 'viaLocaleTestUrlParam',
        desc: 'For non-LIVE test, read from locale.test url param, e.g. http://localhost.com:3000/?locale.test=fr',

        method: function (req) {
            var dialectParam,
                dialect = null;

            if (process.env.DEPLOY_ENV === 'LIVE') {
                return dialect;
            }

            dialectParam = req.query[CONSTANTS.locale_test_request_param] || (req.body && req.body[CONSTANTS.locale_test_request_param]);

            if (dialectParam) {
                if (this.cow.isValidLanguage(dialectParam)) {
                    dialect = dialectParam;
                }
            }
            dialect = dialectSanitizer(dialect);
            return dialect;
        }
    },

    {
        name: 'viaRosettaPost',
        desc: 'Read rosetta language',

        method: function (req) {
            return null;
        }
    },

    {
        name: 'viaLocaleXUrlParam',
        desc: 'Read from locale.x url param, e.g. http://localhost.com:3000/?locale.x=en_GB',

        method: function (req) {
            var dialectParam = req.query[CONSTANTS.locale_x_request_param] || (req.body && req.body[CONSTANTS.locale_x_request_param]),
                dialect = null;

            if (dialectParam) {
                if (this.cow.isValidLanguage(dialectParam)) {
                    dialect = dialectParam;
                }
            }
            if (dialect) {
                setCookie(this.response, dialect, this.country);
            }
            dialect = dialectSanitizer(dialect);
            return dialect;
        }
    },

    {
        name: 'viaSession',
        desc: 'Read from session',

        method: function (req) {

            if (!req.session || !req.session.localeDialect) {
                return null;
            }

            var dialect = req.session.localeDialect;

            if (!this.cow.isValidLanguage(dialect) && !this.cow.isValidLanguage(dialect + '_XC')) {
                return null;
            }

            return dialect;
        }
    },

    {
        name: 'viaLangCookie',
        desc: 'Read lang cookie',

        method: function (req) {
            var headers,
                cookies,
                langCookie,
                dialectParam = null,
                dialect = null;

            if (this.cow.isConsiderCookieLanguage()) {
                headers = this.request.headers;
                if (headers && headers.cookie) {
                    cookies = cookie.parse(headers.cookie);
                }
                if (cookies) {
                    langCookie = cookies[CONSTANTS.cookieName];
                }
                if (langCookie) {
                    langCookie = langCookie;
                    langCookie = langCookie.split(";");
                    if (langCookie.length === 2) {
                        dialectParam = langCookie[0];
                    }
                }
                if (dialectParam) {
                    if (this.cow.isValidLanguage(dialectParam)) {
                        dialect = dialectParam;
                    } else if (this.cow.isValidLanguage(dialectParam + '_XC')) {
                        dialect = dialectParam;
                    }
                }
                dialect = dialectSanitizer(dialect);
            }
            return dialect;
        }
    },

    {
        name: 'viaUserProfile',
        desc: 'Read from user preference object',

        method: function (req) {
            var dialect = null;
            if (this.userPref && this.userPref.language) {
                dialect = this.userPref.language + '_' + this.userPref.country;
            }
            return dialect;
        }
    },

    {
        name: 'viaBrowserPref',
        desc: 'Read from accept-language http header',

        method: function (req) {
            var language_header,
                languages = [],
                regions = [],
                dialectParam = null,
                dialectXCParam = null,
                dialect = null;

            if (this.cow.isConsiderBrowserLanguage() && this.request.headers) {
                language_header = this.request.headers['accept-language'];
                if (language_header) {
                    language_header.split(',').forEach(function (l) {
                        var header = l.split(';', 1)[0],
                            lr = header.split('-', 2);
                        if (lr[0]) {
                            languages.push(lr[0].toLowerCase());
                        }
                        if (lr[1]) {
                            regions.push(lr[1].toUpperCase());
                        }
                    });
                }

                if (languages.length > 0 && regions.length > 0) {
                    dialectParam = languages[0] + '_' + regions[0];
                    dialectXCParam = languages[0] + '_XC';
                }

                if (dialectParam) {
                    if (this.cow.isValidLanguage(dialectParam)) {
                        dialect = dialectParam;
                    } else if (this.cow.isValidLanguage(dialectXCParam)) {
                        dialect = dialectXCParam;
                    }
                }

                if (dialect) {
                    setCookie(this.response, dialect, this.country);
                }
                dialect = dialectSanitizer(dialect);
            }
            return dialect;
        }
    },

    {
        name: 'viaCountryDefault',
        desc: 'Return the country default',

        method: function (req) {
            var defaultLanguage = CONSTANTS.defaultLanguage;

            if (this.cow.getLanguages()) {
                defaultLanguage = this.cow.getLanguages()[0];
            }
            defaultLanguage = dialectSanitizer(defaultLanguage);
            return defaultLanguage;
        }
    }
];

module.exports.CONSTANTS = CONSTANTS;
