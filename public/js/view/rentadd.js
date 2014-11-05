
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
                var rentAddView = BaseView.extend({
                el:"#rentAdd",
                       events: {
                        'change #rent_owner':GlobalSpace.dropdownSpanUpdate
                       },
                        

                initialize: function(){   
                        console.log("VIEW: RENT ADD");
                        GlobalSpace.preFillSelectbox(); 
                     
                        $('#cal_rent_month').datetimepicker({pickTime: false});
                } ,//close init();
                
               
        });
        return  rentAddView;
}); 
