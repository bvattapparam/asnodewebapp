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
        var ShoppingView = BaseView.extend({
        el:"#shopping",
                events: {
                         'change #shopping_status_edit':GlobalSpace.dropdownSpanUpdate,
                        'click .close':'reloadParent',
                        'click .editShoppingCall':'shoppingDataShow',
                        'click #editShoppingbtn':'editShoppingData',
                       },

        initialize: function(){   
                console.log("shopping view loaded");
                GlobalSpace.paginationSection('#shoppingData');
                this.showCalendar();
                this.ajaxPrefilter();
              //  this.toolTipShow();
        },
        reloadParent:function(){
              window.location.reload();
        },
        showCalendar:function(){
              $('#cal_shopping_date_edit').datetimepicker({pickTime: false});
        },
    
        openModal:function(){
          $('#myShoppingModal').modal('show'); 
        },
          renderShoppingData: function (data) {
            var oParams = this.getShoppingDataRenderParams(),
            oSelf = this;
            oParams.data = data;
            oParams.callback = function () {
                        GlobalSpace.preFillSelectbox();
                        oSelf.openModal();
                             $('#loadingspan').removeClass('loadingTransp');
                             $('#loadingspan').removeClass('show');
                              oSelf.showCalendar();
            };
            Helper.simpleRender(oParams);
            
        },
            getShoppingDataRenderParams: function () {
            var shoppingDataView,
                  oSelf = this;
                  shoppingDataView = new BaseView();
                  shoppingDataView.model = new Backbone.Model();

            return {
                    elementID : '#shoppingDataView',
                    template :  'inc/modeledit_shopping',
                    view : shoppingDataView
                };
        },


         getParams: function (shoppingID) {
           var oSelf = this;
           //console.log("THIS IS TEST"); 
           var shoppingID = shoppingID;
            return {
                sUrl : '/asnodewebapp/shoppingData',
                oForm : this.getFormData(shoppingID),
               callback : function (oData) {
                    if( (oData.data && oData.data.success) || undefined) {
                        oSelf.renderShoppingData(oData.data);
                    } else {
                       oSelf.renderShoppingData(oData.data);
                    }
                }
            };
        },
        getFormData: function (shoppingID) {
            var oParams = {
                shoppingID: shoppingID,
            };
            return oParams;
        },

          gettravelID: function (travelid) {
            var travelID = $( "#travel_id").val();
            console.log(travelID);
            return travelID;
        },

        shoppingDataShow:function(ev){
          console.log("REACHED SHOPPING AJAX");
          var shoppingID = ev.target.id;
            var oParams = this.getParams(shoppingID);
            console.log(oParams);
            this.callLoading();
            Helper.simplePost(oParams);
            console.log("AJAX 1" + JSON.stringify(oParams));
        },
        callLoading:function(){
                $('#loadingspan').width($('.table-responsive').width());
                $('#loadingspan').height($('.table-responsive').height());
                var ps = $('.table-responsive').position();
                $("#loadingspan").css({top: ps.top, left: ps.left});
                $('#loadingspan').addClass('show');
                $('#loadingspan').addClass('loadingTransp');
        },
        ajaxPrefilter: function () {
      var csrf = $('input[name=_csrf]').val();

            $.ajaxPrefilter(function(opts, origOpts, jqXHR) {
                jqXHR.setRequestHeader('X-CSRF-Token', csrf);
            });
    },

    // Place for edit travel data ajax section
    editShoppingData:function(){
      console.log('edit ajax');
      var oParamsEdit = this.getParamsEdit();
      $("#header").addClass('loading');
      $(".show-body").addClass('hide');
      $("#editShoppingbtn").addClass('disabled');
      Helper.simplePost(oParamsEdit);
    },
    showMessagebox:function(oData){
        $("#header").removeClass('loading');
      $("#updateMessageShowView").addClass('show');
      
      $("#updateMessageShowView #alert").addClass('alert-'+oData.data.viewmd.message.messagetype);
          if($("#updateMessageShowView #alert").hasClass('alert-success')){
             $("#updateMessageShowView #alert #alertcontentsuccess").addClass('show');
             $("#updateMessageShowView #alert #alertcontentwarning").removeClass('show');
          }else
          {
               $("#updateMessageShowView #alert #alertcontentsuccess").removeClass('show');
              $("#updateMessageShowView #alert #alertcontentwarning").addClass('show');
          }
    },
    getParamsEdit:function(){
       var oSelf = this;
          // console.log("THIS IS TEST"); 
          console.log("EDIT VAL" + JSON.stringify(this.getFormDataEdit()));
            return {
                sUrl : '/asnodewebapp/shoppingDataEdit',
                oForm : this.getFormDataEdit(),
               callback : function (oData) {
                    if( (oData.data && oData.data.success) || undefined) {
                       oSelf.showMessagebox(oData);
                    } else {
                      console.log("updated" +  JSON.stringify(oData.data));
                      oSelf.showMessagebox(oData);
                    }
                }
            };
    },
          
    getFormDataEdit: function () {
            var oParams = {
                    shoppingID: $( "#shopping_id_edit").val(),
                    shopping_date: $( "#shopping_date_edit").val(),
                    shopping_item: $( "#shopping_item_edit").val(),
                    shopping_amount: $( "#shopping_amount_edit").val(),
                    shopping_status:$( "#shopping_status_edit").val(),
                    shopping_cart:$( "#shopping_cart_edit").val(),
                    shopping_comment:$( "#shopping_comment_edit").val(),
            };
            return oParams;
        },

}); 
        return  ShoppingView;
    }); 
