/** Utils : Can be use to for global functions. **/
"use strict";

var tz = require("timezone");

function Utils(timezone) {
    this.timezone = timezone;
}

Utils.prototype = {

    genBirthYearList: function () {

        var birthYearList = {
            optionList: []
        };
        var tzUser = this.genTimezonePartial(),
            thisYear = tzUser(new Date(), "%Y"),
            i,
            year;

        for (i = thisYear - 110; i < thisYear - 18; i += 1) {
            year = {};
            year.optionId = year.optionValue = i;
            birthYearList.optionList.push(year);
        }

        return birthYearList;
    },

    // This method generates a timezone partial function from the given Olsen timezone.
    // For any questions, see:
    // https://github.com/bigeasy/timezone
    genTimezonePartial: function() {
        var tzPartial;
        try {
            tzPartial = tz(require("timezone/" + this.timezone));
        } finally {
            // Either an error occurred or the timezone wasn't found in the database.  Use default.
            // Catch both errors and unknown timezones.
            if (!tzPartial) {
                console.error("genTimezonePartial couldn't work with " + this.timezone + "; using default");
                tzPartial = tz(require("timezone/America/Los_Angeles"));
            }
        }
        return tzPartial;
    }
};
module.exports = Utils;
