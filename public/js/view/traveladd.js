  "use strict";
/* global define:true */
define([
    'nougat',
    'underscore',
    'jquery',
    'backbone',
    'BaseView',
    'viewUtil',
],
            function (nougat, _, $, Backbone, BaseView, ViewUtil ) {
                var travelAddView = BaseView.extend({
                el:"#travelAdd",
                       events: {
                        'change #travelMode':'dropdownSpanUpdate',
                         'change #travelStatus':'dropdownSpanUpdate'
                       },

                initialize: function(){   
                        console.log("VIEW: TRAVEL ADD");
                        $('#travel_bookeddate, #travel_bookeddate_edit, #travel_date, #travel_date_edit').datetimepicker({pickTime: false});
                        this.preFillSelectbox();  // to prefill the select boxes with the selected default text
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
        return new travelAddView();
}); 
