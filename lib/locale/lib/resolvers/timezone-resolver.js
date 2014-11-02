/**
 *  PayPal Timezone resolver
 *  Determine the Timezone to use.
 *
 *  If user is logged-in and has timezone set, return that
 *  Else primary timezone from cow
 *
 */

var TimeZoneResolver,
    CAL_TZ_KEY = 'm_tz',
    CAL_TZ_RULE_KEY = 'rule_tz';

module.exports = TimeZoneResolver = function (cow, userPref, calEvent) {
    this.cow = cow;
    this.userPref = userPref;
    this.calEvent = calEvent;
};

var proto = TimeZoneResolver.prototype;

TimeZoneResolver.prototype.resolve = function (req) {

    var timezone, resFactor;

    this.determiners.some(function (determiner) {

        timezone  = determiner.method.call(this, req);
        resFactor = determiner.name;

        return timezone;

    }.bind(this));

    if (this.calEvent) {
        this.calEvent.addData(CAL_TZ_KEY, timezone);
        this.calEvent.addData(CAL_TZ_RULE_KEY, resFactor);
    }

    return timezone;
};


TimeZoneResolver.prototype.determiners = [

    {
        name: 'viaUserProfile',
        desc: 'Read from User Preference Object',

        method: function (req) {
            var timezone = null,
                tz,
                cowTZs;
            if (this.userPref) {
                tz = this.userPref.timezone;
                cowTZs = this.cow.getTimeZones();
                if (tz && cowTZs && cowTZs.indexOf(tz) !== -1) {
                    timezone = tz;
                }

            }
            return timezone;
        }
    },

    {
        name: 'viaCowPrimary',
        desc: 'Read from COW primary',

        method: function (req) {
            return this.cow.getPrimaryTimeZone();
        }
    }

];
