"use strict";

var cal = require('cal');

module.exports = {
    // Log a business activity with account identifier. Account identifier could be account number or payer id.
    logBusinessActivity: function(activity, accountIdentifier) {
        var event = cal.createEvent('BIZ', activity);
        event.addData('ACCOUNT_ID', accountIdentifier);
        event.complete();
    },

    // Log Errors
    logAsSystemError: function(errorName, err) {
        var event = cal.createEvent('ERROR', errorName);
        event.status = cal.Status.ERROR;

        // If the err can be converted to json, log as json
        if(typeof err.toJSON === "function")
        {
            event.addData("ERR_DESCRIPTION", err.toJSON());
        }
        // If err is an object, Iterate through keys and log them all.
        else if(typeof err === "object")
        {
            for(var key in err)
            {
                if(err.hasOwnProperty(key))
                {
                    event.addData(key, err[key]);
                }
            }
        }
        else
        {
            event.addData("ERR_DESCRIPTION", err);
        }
        event.complete();
    },

    // Log any debugging information
    logInfo: function(info){
        cal.createEvent('INFO', info).complete();
    }

};
