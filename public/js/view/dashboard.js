  "use strict";
/* global define:true */


define([
    'nougat',
    'underscore',
    'jquery',
    'backbone',
    'BaseView',
    'viewUtil',
    'raphael',
    'morris'
],
    function (nougat, _, $, Backbone, BaseView, ViewUtil,Validation, ErrorDisplay) {

      

        var settlementView = BaseView.extend({
          //template:"dashboard",
          el:"#dashBoard",
               events: {
            // validate field interactions
         

        },

            initialize: function(){   
                console.log("test");
               // this.prettyPrintTrigger(); // call function for pretty print.



               var  dumpValue =$('#rowjsonDump').html();
                              
                                        var dumpvalue = JSON.parse( dumpValue);
                                    //$('#structuredjsonDump').html(this.prettyPrint(dumpvalue));
                                   // console.log("dump value is here" + JSON.stringify(dumpvalue));

                                    if (typeof Morris != 'undefined') {
                                         Morris.Donut({
                                                        element: 'donutcolored',
                                                        data: Object.keys(dumpvalue.viewModel.donutcol).map(function(key) {return dumpvalue.viewModel.donutcol[key]}),
                                                        labelColor: '#303641',
                                                        resize:true,
                                                        colors: ['#f26c4f', '#00a651', '#00bff3', '#0072bc']
                                                    });
                                    }
                                
            },

persistBubbles: function(event){
            event.preventDefault();
        },

                //show information bubble on focus if there are no errors present on that field
        showHelperInfo: function (event) {
           
                var field = event.target,
                parentField = this.$(field).parent(),
                errorField = this.$('.' + field.id + '-error'),
                tmpField = $(field);

                 console.log(field);
                console.log(parentField);
                 console.log(errorField);
                  console.log(tmpField);

                if (!parentField.hasClass('hasError')) {                
                                this.openError(parentField.find('.help-information'));
                }
        },

        //hide help information message 
        hideHelperInfo: function () {
            this.closeError();
        },
        // close error helper
        closeError: function () {
            $('p.open,form div.open').removeClass('open');
          //  $('.validationsContainer').hide();
        },
        // open error helper and mark it open
        openError: function ($target) {
            $target.addClass('open');
        },
            // used in content.js to show error state bubble when there is an error on field
        showErrorInfo: function (event) {

            var field = event.target,
                parentField = this.$(field).parent(),
                inputVal = $(field).val(),
                children = this.$('p.open, div.open'),
                errorField = parentField.parent(),
                tmpField = $(field);

            //this event is bubbling depending on what you click on, need to stop it from affecting other elements
            event.stopImmediatePropagation();

            // if there are any open help-bubbles, then hide them
            // but do not hide them if :focus is on the bubble
            if (children.length > 0 && !parentField.hasClass('help-error')) {
                this.closeError();
            }

            //for checkbox, if the value is not checked then show error
           

            if (inputVal === '') { // check for error states and open correct error helper
                this.openError(parentField.find('.help-error.error-empty'));
               // this.addAria(field, parentField.find('.help-error.error-empty'));
            } else if (parentField.hasClass('error-format')) {
                // open format state error
                this.openError(parentField.find('.help-error.error-format'));
                //this.addAria(field, parentField.find('.help-error.error-format'));

            } else if (parentField.hasClass('submitted')) {
                // if neither then open submit state error
                this.openError(parentField.find('.help-error.error-submit'));
               // this.addAria(field, parentField.find('.help-error.error-submit'));
            }


        },

        // for validation on submit

        validateFrm: function(ev){  

            
            var $target = this.$(ev.target);
            

               // this.disableEnableFields();         
            

            if (validateForm(ev)) {
                 alert("reached1");
                var frm = ev.target,
                    height = $(frm).height() + 'px',
                    width = $(frm).width() + 'px';

                $('.overlay').css({
                    "height": height,
                    "width": width
                });

                $('.overlay').removeClass('hide').addClass('show');


            /*  if(this.fields.$phoneTypeIVR.length){
                    this.fields.$phoneEntryIVR.removeClass('show').addClass('hide');
                    this.fields.$addPhoneIVR.find('.confirming').removeClass('hide').addClass('show');
                }
                if(this.fields.$phoneTypeSMS.length){
                    this.fields.$phoneEntrySMS.removeClass('show').addClass('hide');
                    this.fields.$addPhoneSMS.find('.confirming').removeClass('hide').addClass('show');
                }
            */
                return true;
            } else {
                       
                        $target.find('.hasError.submitted :input').get(0).focus();
                
            }
        
            return false;
        },
        // close it here

        // call vlform
validateForm: function (event) {
    alert("sss");
            var thisForm = $(event.target)[0],
                formInputs = $(event.target).find('.validate'),
                i = 0,
                isInvalid = false,
                field, errorField;


            // if checkbox then validate for checkbox else do HTML5 validations
            // workaround for making sure checkbox gets validated on all devices and browsers
          //  this.addCheckValidity(event);
            isInvalid = thisForm.checkValidity();


            if (formInputs[0].checkValidity) {
                //begin for loop
                for (i = 0; i < formInputs.length; i++) {
                    var inputVal = this.$(formInputs[i]).val(),
                        parentField = this.$(formInputs[i]).parent(),
                        submitMsg = parentField.find('.error-submit');



                    // if HTML5 validations say that the field is not valid, then check why exactly is it not valid
                    //for checkbox, if the value is not checked then show error only for > iOS4 and other browsers
                

                    if (!formInputs[i].checkValidity()) { //else run HTML5 validation
                        // add class first so that the messages can be styled correctly
                        parentField.addClass('hasError submitted');

                        
                        field = $(formInputs[i]);
                       

                        // if we get any errors from back-end then show them
                        if (submitMsg.length > 0) {
                            if (inputVal === '') {
                                parentField.addClass('error-empty').removeClass('error-format');
                            } else {
                                parentField.addClass('error-format').removeClass('error-empty');
                            }
                        }
                    }
                    //end of for loop   
                }
            } else {
                //clear error messages for legacy browsers
                this.$('.hasError').removeClass('hasError');
            }

            
            return isInvalid;
        }
        //close
          
        });

        return new settlementView();
    }); 
