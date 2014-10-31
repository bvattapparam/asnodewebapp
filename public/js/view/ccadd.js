
  "use strict";
    //var globalSpace_Call = require('./globaldefinition');
/* global define:true */
define([
    'nougat',
    'underscore',
    'jquery',
    'backbone',
    'BaseView',
    'viewUtil',
     'validation', 
    'errorDisplay',
     'common/globalSpace',
    'bootstrap-cal',
   
],
            function (nougat, _, $, Backbone, BaseView, ViewUtil, Validation, ErrorDisplay,GlobalSpace) {
                var ccAddView = BaseView.extend({
                el:"#ccAdd",
                       events: {
                        'keypress #cc_fourdigit':'updateCCClass',
                        'change #cc_status':GlobalSpace.dropdownSpanUpdate,
                        //                 'change #travel_status':'dropdownSpanUpdate',
                        //                 'focus #travel_from, #travel_bookeddate, #travel_date, #travel_to, #travel_pnr, #travel_mode, #travel_status, #travel_amount, #travel_count': ErrorDisplay.showError,
                        //                 'keypress #travel_from, #travel_bookeddate, #travel_date, #travel_to, #travel_pnr, #travel_mode, #travel_status,  #travel_amount, #travel_count': ErrorDisplay.showError,
                        //                 'keydown #travel_from, #travel_bookeddate, #travel_date, #travel_to, #travel_pnr, #travel_mode, #travel_status, #travel_amount, #travel_count': ErrorDisplay.removeError,
                        //                 'blur #travel_from, #travel_bookeddate, #travel_date, #travel_to, #travel_pnr, #travel_mode, #travel_status, #travel_amount, #travel_count': ErrorDisplay.removeError,
                        // //'blur #travel_from': 'tester',
                        // 'submit form': ErrorDisplay.verifyForm
                       },
                        

                initialize: function(){   
                        console.log("VIEW: CC ADD");
                        GlobalSpace.preFillSelectbox(); 
                        //var formNames = ['travel_bookeddate','travel_date','travel_from','travel_to','travel_pnr','travel_mode','travel_status','travel_amount','travel_count'];
                        //ErrorDisplay.markError(formNames);

                        // When the form is invalid, focus on the first input with an error
                        /*Validation.on('invalidtraveladd', function(form) {
                            ErrorDisplay.focusError(form);
                        }, this);
                         Validation.init(this);
                         */

                        $('#cal_cc_date').datetimepicker({pickTime: false});
                } ,//close init();
                updateCCClass:function(ev){
                    var field = $(ev.target);
                    var cctype= GlobalSpace.getCreditCardType(field.val());
                    var cctype_icon;
                    if(cctype !='credit-card'){
                        cctype_icon='cc-' + cctype;
                    }
                    else{
                        cctype_icon=cctype;
                    }
                    $("#cc_cctype").removeClass();
                    $('#cc_cctype').addClass('fa fa-'+cctype_icon);

                    $("#cc_type_icon").removeClass();
                    $('#cc_type_icon').addClass('fa fa-'+cctype_icon);
                    $('#cc_type').val(cctype);
                },
               
        });
        return  ccAddView;
}); 
