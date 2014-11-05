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
    'common/helper',
    'common/globalSpace',
    'datatables',
    'dtpagination',
    'bootstrap-cal'
],
    function (nougat, _, $, ui, Backbone, BaseView, ViewUtil, Helper,GlobalSpace) {
        var Index = BaseView.extend({
        el:"#cc",
                events: {},

        initialize: function(){   
                console.log("cc view loaded");
     

          
        }
    // close edit travel data ajax section

}); 
        return  Index;
    }); 
