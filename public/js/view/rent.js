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
    'bootstrap-cal'
],
    function (nougat, _, $, ui, Backbone, BaseView, ViewUtil, Helper,GlobalSpace) {
        var RentView = BaseView.extend({
        el:"#rent",
                events: {
                        // 'change #travel_mode_edit':'dropdownSpanUpdate',
                          'change #rent_owner_edit':GlobalSpace.dropdownSpanUpdate,
                        //  'click .editTravelCall':'travelDataShow',
                        //  'click #editTravelbtn':'editTravelData',
                        'click .close':'reloadParent',
                        'click .editRentCall':'rentDataShow',
                        'click #editRentbtn':'editRentData'
                       },

        initialize: function(){   
                console.log("rent view loaded");
                GlobalSpace.paginationSection('#rentData');
               // this.showCalendar();
                this.ajaxPrefilter();

          
        },
        reloadParent:function(){
              window.location.reload();
        },
        showCalendar:function(){
              $('#cal_rent_month_edit').datetimepicker({pickTime: false});
        },
    
        openModal:function(){
          $('#myRentModal').modal('show'); 
        },
          renderRentData: function (data) {
            var oParams = this.getRentDataRenderParams(),
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
            getRentDataRenderParams: function () {
            var rentDataView,
                  oSelf = this;
                  rentDataView = new BaseView();
                  rentDataView.model = new Backbone.Model();

            return {
                    elementID : '#rentDataView',
                    template :  'inc/modeledit_rent',
                    view : rentDataView
                };
        },


         getParams: function (rentID) {
           var oSelf = this;
           //console.log("THIS IS TEST"); 
           var rentID = rentID;
            return {
                sUrl : '/asnodewebapp/rentData',
                oForm : this.getFormData(rentID),
               callback : function (oData) {
                    if( (oData.data && oData.data.success) || undefined) {
                        oSelf.renderRentData(oData.data);
                    } else {
                       oSelf.renderRentData(oData.data);
                    }
                }
            };
        },
        getFormData: function (rentID) {
            var oParams = {
                rentID: rentID,
            };
            return oParams;
        },

          gettravelID: function (travelid) {
            var travelID = $( "#travel_id").val();
            console.log(travelID);
            return travelID;
        },

        rentDataShow:function(ev){
          var rentID = ev.target.id;
            var oParams = this.getParams(rentID);
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
    editRentData:function(){
      console.log('edit ajax');
      var oParamsEdit = this.getParamsEdit();
      $("#header").addClass('loading');
      $(".show-body").addClass('hide');
      $("#editRentbtn").addClass('disabled');
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
                sUrl : '/asnodewebapp/rentDataEdit',
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
                    rentID: $( "#rent_id_edit").val(),
                    rent_month: $( "#rent_month_edit").val(),
                    rent_amount: $( "#rent_amount_edit").val(),
                    rent_owner:$( "#rent_owner_edit").val(),
                    rent_comment:$( "#rent_comment_edit").val(),
            };
            return oParams;
        }
    // close edit travel data ajax section

}); 
        return  RentView;
    }); 
