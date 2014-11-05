/**
 * Created by lmarkus on 1/5/14.
 */

// Load the MomentJS Library
var moment = require('moment');
// Load the project's configuration
var nconf = require('nconf');

//We require that dustjs, and the dustjs-helpers have been loaded. The way we invoke this function will ensure that.
(function (dust){
    dust.helpers.provide = function provide(chunk, ctx, bodies, params) {
        'use strict';
        var resData,
            paramVals = {},
            k,
            localCtx = ctx,
            blockData,
            saveData = chunk.data;

        if (params) {
            localCtx = ctx.push(params); // make params available to all bodies
        }

        for (k in bodies) {
            if (k !== 'block') {
                chunk.data = [];
                try {
                    blockData = bodies[k](chunk, localCtx).data.join('');
                    resData = JSON.parse(blockData);
                } catch (e) {
                    resData = blockData; // not valid JSON so just return raw data
                } 
                paramVals[k] = resData;
            }
        }
        chunk.data = saveData;

        // combine block-defined params with any existing ones.
        // A block param overrides if the name duplicates regular param name
        return bodies.block(chunk, localCtx.push(paramVals));

    };

    //Create a helper called 'formatDate'
    dust.helpers.formatDate = function (chunk, context, bodies, params) {

        //Retrieve the fallback language from the configuration
        var fallbackLang = nconf.get('i18n').fallback || 'en-US';

        //Dig the current language out of the context, or go to the fallback.
        var lang = (context && context.stack && context.stack.head && context.stack.head.context && context.stack.head.context.locality) 
            || (context.stack && context.stack.tail && context.stack.tail.head.context && context.stack.tail.head.context.locality)
            || (context.stack && context.stack.tail && context.stack.tail.tail && context.stack.tail.tail.head.context && context.stack.tail.tail.head.context.locality)
            || fallbackLang;

        //Retrieve the date value from the template parameters.
        var date = dust.helpers.tap(params.date, chunk, context);

        //Retrieve the format string from the template parameters.
        var format = dust.helpers.tap(params.format, chunk, context);

        //Parse the date object using MomentJS
        var m = moment(new Date(date));

        //Set the language in which the date should be formatted
        m.lang(lang);

        //Format the string
        var output = m.format(format);

        //Write the final value out to the template
        return chunk.write(output);
    };
    // to truncate the string in to specified nlength // added Bijeshkumar
    dust.helpers.Truncate = function(chunk, context, bodies, params) {
    var data   = dust.helpers.tap(params.data, chunk, context),
        length = dust.helpers.tap(params.length, chunk, context);
    return chunk.write(data.substr(0, length));
}

})(typeof exports !== 'undefined' ? module.exports = require('dustjs-helpers') : dust);
