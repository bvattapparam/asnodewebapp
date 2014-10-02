/*global define:true, console:true, jQuery:true, require:true */
define([ 'nougat',
        'jquery',
        'backbone',
        'BaseView',
        'business/pageView',
        'bootstrap',
        'lap',
        'businessHelper',
        'raphael',
        'morris',
        'header',
        'footer',
        'login',
        'dashboard',
        'travel'
    ],
    function (nougat, $, Backbone, BaseView, ContentView) {

        'use strict';

        var router, viewName, pageView;

        router = new (Backbone.Router.extend({
            routes: {
                '*path': 'showViews'
            },

            /**
            * Handles default view use cases
            * @param {String} name The action being passed to the route from the URI
            * @param {Function} callback Function to execute after scripts are loaded
            */
            showViews: function (name, callback) {
                var pageName = $("body").data("view-name");

                if (pageName) {
                    this.loadScripts(pageName, callback);
                }
            },

            /**
             * Handles default view use cases
             * @param {String} pageName The name of the script for the page that is paired with the template
             * @param {Function} callback Function to execute after scripts are loaded
             */
            loadScripts: function (scriptName, callback) {
                require(["view/" + scriptName], $.proxy(function (ViewClass) {
                    this.view = new ViewClass();
                    this.view.delegateEvents();
                    this.view.afterRender();
                    if (callback) {
                        callback();
                    }
                }, this));
            }
        }))();


        $(function () {
            var context = nougat.getContext();

            // Grab data from the page context
            nougat.setContext($(document.body).data());

            context = nougat.getContext();

            viewName = context.viewName;

            if (viewName !== 'index') {
                $(document.body).removeClass('loading');
            }

            // build the Ajax'd content UI
            pageView = new ContentView();

            // Start watching the history
            // Note: Remove the existing hash if there is one
            if (window.location.hash) {
                window.location.hash = '';
            }

            // start recording history for backbone for Ajax'd content
            Backbone.history.start({
                pushState: true, // Use HTML5 Push State
                hashChange: false, // Do full page refresh if Push State isn't supported
                root: "/settlementprefsnodeweb/" //Initial path for app
            });
        });
    });
