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
    'errorDisplay',
     'common/globalSpace',
     'common/helper',
    'bootstrap-cal'

],
            function (nougat, _, $, Backbone, BaseView, ViewUtil, Validation, ErrorDisplay, GlobalSpace, Helper) {
                var travelAddView = BaseView.extend({
                el:"#travelAdd",
                       events: {
                                        'change #travel_mode':GlobalSpace.dropdownSpanUpdate,
                                        'change #travel_status':GlobalSpace.dropdownSpanUpdate,
                                        'focus #travel_from, #travel_bookeddate, #travel_date, #travel_to, #travel_pnr, #travel_mode, #travel_status, #travel_amount, #travel_count': ErrorDisplay.showError,
                                        'keypress #travel_from, #travel_bookeddate, #travel_date, #travel_to, #travel_pnr, #travel_mode, #travel_status,  #travel_amount, #travel_count': ErrorDisplay.showError,
                                        'keydown #travel_from, #travel_bookeddate, #travel_date, #travel_to, #travel_pnr, #travel_mode, #travel_status, #travel_amount, #travel_count': ErrorDisplay.removeError,
                                        'blur #travel_from, #travel_bookeddate, #travel_date, #travel_to, #travel_pnr, #travel_mode, #travel_status, #travel_amount, #travel_count': ErrorDisplay.removeError,
                        //'blur #travel_from': 'tester',
                        'submit form': ErrorDisplay.verifyForm
                       },

                initialize: function(){   
                        console.log("VIEW: TRAVEL ADD");
                        var formNames = ['travel_bookeddate','travel_date','travel_from','travel_to','travel_pnr','travel_mode','travel_status','travel_amount','travel_count'];
                        ErrorDisplay.markError(formNames);

                        // When the form is invalid, focus on the first input with an error
                        Validation.on('invalidtraveladd', function(form) {
                            ErrorDisplay.focusError(form);
                        }, this);
                         Validation.init(this);

                        $('#cal_travel_date, #cal_travel_bookeddate, #travel_bookeddate_edit, #travel_date_edit').datetimepicker({pickTime: false});
                        GlobalSpace.preFillSelectbox(); 
                } ,//close init();
                preFillSelectbox:function(){
                   $(".selectDropdown").children("span").each(function(){
                            var spanClass = $(this).attr('class');
                            var selectID = spanClass;
                            $('span.'+spanClass).html($('select#'+selectID+'>option:selected').text());
                    });                
               },
                dropdownSpanUpdate:function(ev){
                   var selectedItem = ev.target.options[ev.target.selectedIndex].text;
                    var selectedItemID = ev.target.id;
                    var spanClass = selectedItemID;
                   $('span.'+spanClass).html(selectedItem);
                }
        });
        return  travelAddView;
}); 
