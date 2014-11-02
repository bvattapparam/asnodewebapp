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
            'keypress #cc':'updateCCClass' 

        },

            initialize: function(){   
                console.log("login test");
                $('.s').append('span');
               
                var formNames = ['email', 'password'];
                ErrorDisplay.markError(formNames);

            // When the form is invalid, focus on the first input with an error
                Validation.on('invalidlogin', function(form) {
                    ErrorDisplay.focusError(form);
                }, this);

                Validation.init(this);
        },

        updateCCClass:function(ev){
            var field = $(ev.target);
            var cctype= this.getCreditCardType(field.val());
            console.log(cctype);
            $("#ccname").removeClass();
            $('#ccname').addClass('fa fa-cc-'+cctype);
        },

        getCreditCardType:function(accountNumber){
                        console.log('sd' + accountNumber);
                      //start without knowing the credit card type
                      var result = "unknown";
                      //first check for MasterCard
                      if (/^5[1-5]/.test(accountNumber))
                      {
                        result = "mastercard";
                      }
                      //then check for Visa
                      else if (/^4/.test(accountNumber))
                      {
                        result = "visa";
                      }
                      //then check for AmEx
                      else if (/^3[47]/.test(accountNumber))
                      {
                        result = "amex";
                      }
                      return result;
                }

});

        return  loginView;
}); 
