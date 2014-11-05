  "use strict";
/* global define:true */
define([
    'nougat',
    'underscore',
    'jquery',
      'jqueryUI',
    'backbone',
    'BaseView',
    'viewUtil',
      'validation', 
    'errorDisplay',
    'common/helper',
    'common/globalSpace',
    'bootstrap-cal'
],
    function (nougat, _, $, ui, Backbone, BaseView, ViewUtil, Validation, ErrorDisplay, Helper,GlobalSpace) {
        var TodoView = BaseView.extend({
        el:"#todo",
                events: {
                    'change #todo_category':GlobalSpace.dropdownSpanUpdate,
                     'focus #todo, #todo_category': ErrorDisplay.showError,
             'keypress #todo, #todo_category': ErrorDisplay.showError,
            'keydown #todo, #todo_category': ErrorDisplay.removeError,
            'blur #todo, #todo_category': ErrorDisplay.removeError,
            'submit form': ErrorDisplay.verifyForm
                },

        initialize: function(){   
                console.log("TODO view loaded");
                GlobalSpace.preFillSelectbox(); 
                 var formNames = ['todo', 'todo_category'];
                ErrorDisplay.markError(formNames);
            // When the form is invalid, focus on the first input with an error
                Validation.on('invalidlogin', function(form) {
                    alert("SSSSSS");
                    ErrorDisplay.focusError(form);
                }, this);

                Validation.init(this);
                

        }
}); 
        return TodoView;
    }); 
