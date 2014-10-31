/**
 *
 *  Resposible for resolving country, dialect and timezone
 *
 *  Using
 *      1. Loading all JQuery Globalize cultures for formatting
 *      2. COW for country specific rules
 */
'use strict';

var utils = require('./utils'),
    //cal = utils.tryRequire('cal'),
    CountryResolver = require('./resolvers/country-resolver'),
    DialectResolver = require('./resolvers/dialect-resolver'),
    TimeZoneResolver = require('./resolvers/timezone-resolver'),
    directionalityResolver = require('./resolvers/directionality-resolver'),
    Globalize = require('../globalize/lib/globalize.js'),
    //CowFactory = require('./cow/index'),
    currencies = require('./constants/currencies'),
    patterns = require('./constants/patterns'),
    countrySynonyms = require('./constants/country-synonyms'),
    cowFactory,
    calEvent,
    supportedCountries,
    supportedLocales,
    fallbackCountry,
    fallbackLanguage,
    CAL_TRANSCATION_TYPE = 'LOCALE';

// Loading only supported cultures
//for (i = 0; i < supportedLocales.length; i++) {
//    require('globalize/lib/cultures/globalize.culture.' + supportedLocales[i] + '.js');
//}

//loading all cultures to reduce the multiple disk lookup + add global support
require('../globalize/lib/cultures/globalize.cultures.js');


module.exports = function nodeLocale(options) {
    options = options || {};

    supportedCountries = options.supportedCountries || [];
    supportedLocales = options.supportedLocales || require('./constants/supported-locales');

    fallbackCountry = options.fallbackCountry || CountryResolver.CONSTANTS.defaultCountry;
    fallbackLanguage = options.fallback ? options.fallback.replace('-', '_') : DialectResolver.CONSTANTS.defaultLanguage;

   // cowFactory = CowFactory(options, cal);

    return function locale(req, res, next) {
        resolve(req, res);
        next();
    };
};


var resolve = module.exports.resolve = function (req, res) {
    var countryResolver,
        dialectResolver,
        timeZoneResolver,
        directionality,
        country,
        dialect,
        language,
        timezone,
        culture,
        cow,
        user,
        templatePath,
        userPref;

    // if (cal) {
    //     calEvent = cal.createEvent(CAL_TRANSCATION_TYPE, 'locale');
    //     calEvent.status = cal.Status.SUCCESS;
    //     calEvent.correlationId = req.correlationId;
    // }

    if (req.user) {
        user = req.user;
        userPref = {};
        if (user.country) {
            userPref.country = user.country.countryCode;

            if (user.dialect && user.dialect.language) {
                userPref.language = user.dialect.language.languageCode;
            }
            if (user.timeZone) {
                userPref.timezone = user.timeZone.timeZoneCode;
            }
        }
    }

    // countryResolver = new CountryResolver(cowFactory, req, userPref, calEvent);
    // country = countryResolver.resolve(req);
    country = countrySynonyms[country] || country;

    // Is our resolved locale in list of those supported?
    if (supportedCountries.length && supportedCountries.indexOf(country) === -1) {
        country = fallbackCountry;
    }

    // cow = cowFactory.getCow(country);

    // dialectResolver = new DialectResolver(cow, req, res, userPref, country, calEvent);
    // dialect = dialectResolver.resolve(req);

    // Is our resolved locale in list of those supported?
    // if (supportedLocales && supportedLocales.indexOf(dialect.replace('_', '-')) === -1) {

    //     //var languages = cow.getLanguages() || [];

    //     // Make sure our fallback language is actually valid for the country
    //     if (languages.indexOf(fallbackLanguage) !== -1) {
    //         dialect = fallbackLanguage;
    //     }

    //     // Otherwise default to the first language we can find
    //     else if (languages.length) {
    //         dialect = languages[0];
    //     }

    //     // Otherwise default to the default language
    //     else {
    //         dialect = DialectResolver.CONSTANTS.defaultLanguage;
    //     }
    // }

    // timeZoneResolver = new TimeZoneResolver(cow, userPref, calEvent);
    // timezone = timeZoneResolver.resolve(req);

    // if (dialect.indexOf('_') !== -1) {
    //     culture = dialect.split('_')[0] + '-' + country;
    //     language = dialect.split('_')[0];
    // } else {
    //     culture = dialect + '-' + country;
    //     language = dialect;
    // }

    // directionality = directionalityResolver.resolve(language);

    var locality = {
        timezone : timezone,
        country  : country,
        locale : dialect,
        culture : culture,
        language : language,
        directionality : directionality,
        getCountrySpecifics : function () {
            return cow;
        },
        formatter : function (countryParam, cultureParam) {
            countryParam = countryParam || country;
            cultureParam = cultureParam || culture;
            return formatter(countryParam, cultureParam);
        }
    };
    req.locality = locality;

    //adding locality in res.locals.context for client side to consume
    res.locals = res.locals || {};
    res.locals.context = res.locals.context || {};
    res.locals.context.locality = {
        timezone : timezone,
        country  : country,
        locale : dialect,
        language : language,
        directionality : directionality
    };

    var rlc = res.locals.context;

    templatePath = {
        language: language.toLowerCase(),
        country: dialect.indexOf('_') !== -1 ? dialect.split('_')[1].toUpperCase() : country
    };

    if (rlc.links && rlc.links.templateBaseUrl) {

        // Save the original template base url (e.g. /templates) which we can use to rebuild templateBaseUrl
        rlc.links.originalTemplateBaseUrl = rlc.links.originalTemplateBaseUrl || rlc.links.templateBaseUrl;

        // Rebuild the base url, so we can re-resolve without adding to the final templateBaseUrl
        rlc.links.templateBaseUrl = rlc.links.originalTemplateBaseUrl + '/' +
                                    templatePath.country + '/' +
                                    templatePath.language;
    }

    // if (calEvent) {
    //     calEvent.complete();
    // }
};


var getCalendar = module.exports.getCalendar = function getCalendar(culture) {
    var calendar = Globalize.culture(culture).calendars.standard,
        months = calendar.months || {};

    return {
        months: {
            names: months.names && months.names.filter(function (elem) { if (elem) {return true; }}),
            namesAbbr:  months.namesAbbr && months.namesAbbr.filter(function (elem) { if (elem) {return true; }})
        },
        days: calendar.days,
        AM: calendar.AM,
        PM: calendar.PM,
        patterns: calendar.patterns
    };
};

var formatter = module.exports.formatter = function formatter(country, culture) {

    var cow,
        currencySymbol;

    // if (!cowFactory) {
    //     cowFactory = CowFactory({}, cal);
    // }

    country = country || 'US';
    //cow = cowFactory.getCow(country);
    culture = culture || DialectResolver.getDefaultLanguage(cow);

    //In case culture is actually locale
    //Converting locale to JQuery globalize culture
    if (culture.indexOf('_') !== -1) {
        culture = culture.split('_')[0] + '-' + country;
    }

    // currencySymbol = (function () {
    //     var currencyCode = cow.getCurrencyCode(),
    //         currencyObj = currencies[currencyCode],
    //         currencySymbol;

    //     if (currencyObj) {
    //         currencySymbol = currencyObj.symbol;
    //     }
    //     return currencySymbol;
    // }());

    return  {
        format : function (value, format) {
            if (format === 'C' || format === 'c') {
                return this.formatCurrency(value);
            } else {
                return Globalize.format(value, format, culture);
            }

        },
        getCulture : function () {
            return culture;
        },
        formatDate: function (value, format) {
            var patternObj = patterns[culture];
            if (patternObj && patternObj.date && patternObj.date[format]) {
                format = patternObj.date[format];
            }
            return Globalize.format(value, format, culture);
        },
        formatCurrency : function (value, currency) {
            var symbol,
                patternObj,
                currencyObj;

            patternObj = patterns[culture];
            if (patternObj && patternObj.currency) {
                Globalize.addCultureInfo(culture, {
                    numberFormat: {
                        currency : {
                            pattern: patternObj.currency
                        }
                    }
                });
            }

            if (currency) {
                /*
                    convert currency to symbol
                    i.e. USD to $
                */
                currencyObj = currencies[currency];
                if (currencyObj) {
                    symbol = currencyObj.symbol;
                }
            }
            symbol = symbol || currencySymbol;
            if (symbol) {
                Globalize.addCultureInfo(culture, {
                    numberFormat: {
                        currency : {
                            symbol : symbol
                        }
                    }
                });
            }
            return Globalize.format(value, 'c', culture);
        },
        parseInt : function (value, radix) {
            radix = radix || 10;
            return Globalize.parseInt(value, radix, culture);
        },
        parseFloat : function (value, radix) {
            radix = radix || 10;
            return Globalize.parseFloat(value, radix, culture);
        },
        parseDate : function (value, format) {
            return Globalize.parseDate(value, format, culture);
        },
        getCalendar : function () {
            return getCalendar(culture);
        }
    };
};

/*
 * Take the currencyCode and returns currencySymbol
 */
module.exports.getCurrencySymbol = function getCurrencySymbol(currencyCode) {

    var currencyObj = currencies[currencyCode],
        symbol = '$';

    if (currencyObj) {
        symbol = currencyObj.symbol;
    }

    return symbol;
};




function findDeterminerIndex(determiners, name) {

    for (var i = 0; i < determiners.length; i++) {
        if (determiners[i].name === name) {
            return i;
        }
    }

    throw 'Determiner: ' + name + ' not found';
}

function addDeterminer(resolver) {
    var determiners = resolver.prototype.determiners;

    return {

        first: function (determiner) {
            determiners.unshift(determiner);
        },

        last: function (determiner) {
            determiners.push(determiner);
        },

        after: function (name, determiner) {
            var index = findDeterminerIndex(determiners, name);
            determiners.splice(index + 1, 0, determiner);
        },

        before: function (name, determiner) {
            var index = findDeterminerIndex(determiners, name);
            determiners.splice(index, 0, determiner);
        }
    };
}

function removeDeterminer(resolver) {
    var determiners = resolver.prototype.determiners;

    return function (name) {
        var index = findDeterminerIndex(determiners, name);
        determiners.splice(index, 1);
    };
}


module.exports.registerDeterminer = {

    country:  addDeterminer(CountryResolver),
    dialect:  addDeterminer(DialectResolver),
    timeZone: addDeterminer(TimeZoneResolver)
};

module.exports.removeDeterminer = {

    country:  removeDeterminer(CountryResolver),
    dialect:  removeDeterminer(DialectResolver),
    timeZone: removeDeterminer(TimeZoneResolver)
};



module.exports.currencies = currencies;
module.exports.languages = supportedLocales;
