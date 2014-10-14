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


        //close
          
        });

        return new settlementView();
    }); 
