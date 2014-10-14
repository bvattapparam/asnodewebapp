/*global define:true, s:true */

/**
 * @fileOverview PageHelper – page render on Ajax calls
 * @name PageHelper Widget
 * @author pchallapathi
 */

define(["jquery", "backbone", "BaseView", "nougat"],
    function ($, Backbone, BaseView, nougat) {
        "use strict";

        return BaseView.extend({

            el: "#main",
            currentView: null,

            initialize: function () {
                this.model = new Backbone.Model();
            },

            activate: function (view) {
                if (this.currentView) {
                    this.deactivate(this.currentView);

                    view.delegateEvents();
                    view.$el.show();
                    view.render();

                    document.activeElement.blur();

                }

                this.currentView = view;
            },

            deactivate: function (view, destroy) {
                if (!view) {
                    return;
                }

                view.undelegateEvents();

                if (destroy) {
                    view.remove();
                } else {
                    view.$el.hide();
                }
            },

            /**
             * @override
             */
            _doRender: function (content, template) {
                var $section = this.$('#' + template),
                    $content = $(content);

                if ($section.length) {
                    $section.html($content.contents());
                    this.currentView.render();
                } else {
                    $content.hide();
                    this.$el.append($content);
                }
            },

            afterRender: function () {
                // "Navigate" to the new page
                // TODO: uncomment when pageview is being used in node app
              /*  Backbone.history.navigate(tmp, {
                    trigger: true
                }); */
            },

            back: function (e) {
                e.preventDefault();
                window.history.go(-1);
            }

        });

    });