  "use strict";
/* global define:true */


define([
    'nougat',
    'underscore',
    'jquery',
    'backbone',
    'BaseView',
    'viewUtil',
    'validation', 
    'errorDisplay'
],
function (nougat, _, $, Backbone, BaseView, ViewUtil,Validation, ErrorDisplay) {

        var loginView = BaseView.extend({
          //template:"dashboard",
          el:"#loginPage",
               events: {
            // validate field interactions
           
            // information tooltip interaction
            'focus #email, #password': ErrorDisplay.showError,
             'keypress #email, #password': ErrorDisplay.showError,
            'keydown #email, #password': ErrorDisplay.removeError,
            'blur #email, #password': ErrorDisplay.removeError,
            'submit form': ErrorDisplay.verifyForm,

        },

            initialize: function(){   
                console.log("login test");
               
                var formNames = ['email', 'password'];
                ErrorDisplay.markError(formNames);

            // When the form is invalid, focus on the first input with an error
                Validation.on('invalidlogin', function(form) {
                    ErrorDisplay.focusError(form);
                }, this);

                Validation.init(this);
        },
        });

        return new loginView();
    }); 