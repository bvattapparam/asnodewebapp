/*global define:true */
define([
    'underscore',
    'jquery',
    'backbone'
    ],

    function (_, $, Backbone) {
        "use strict";

        var api = {

            // AJAX abstraction (improve on the way)
            ajax: function (options) {
                var jqxhr = $.ajax({
                    url: options.url,
                    type: options.type,
                    data: options.data
                });
                return jqxhr;
            }

        };

        return api;
});
