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
        el:"#cc",
                events: {
                        // 'change #travel_mode_edit':'dropdownSpanUpdate',
                          'change #cc_status_edit':GlobalSpace.dropdownSpanUpdate,
                        //  'click .editTravelCall':'travelDataShow',
                        //  'click #editTravelbtn':'editTravelData',
                        'click .close':'reloadParent',
                        'click .editCCCall':'ccDataShow',
                        'click #editCCbtn':'editCCData',
                        'keypress #cc_fourdigit_edit':'updateCCClass',
                       },

        initialize: function(){   
                console.log("rent view loaded");
                GlobalSpace.paginationSection('#rentData');
               // this.showCalendar();
                this.ajaxPrefilter();
                this.toolTipShow();

          
        },
        reloadParent:function(){
              window.location.reload();
        },
        showCalendar:function(){
              $('#cal_cc_date_edit').datetimepicker({pickTime: false});
        },
    
        openModal:function(){
          $('#myCCModal').modal('show'); 
        },
          renderCCData: function (data) {
            var oParams = this.getCCDataRenderParams(),
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
            getCCDataRenderParams: function () {
            var ccDataView,
                  oSelf = this;
                  ccDataView = new BaseView();
                  ccDataView.model = new Backbone.Model();

            return {
                    elementID : '#ccDataView',
                    template :  'inc/modeledit_cc',
                    view : ccDataView
                };
        },


         getParams: function (ccID) {
           var oSelf = this;
           //console.log("THIS IS TEST"); 
           var ccID = ccID;
            return {
                sUrl : '/asnodewebapp/ccData',
                oForm : this.getFormData(ccID),
               callback : function (oData) {
                    if( (oData.data && oData.data.success) || undefined) {
                        oSelf.renderCCData(oData.data);
                    } else {
                       oSelf.renderCCData(oData.data);
                    }
                }
            };
        },
        getFormData: function (ccID) {
            var oParams = {
                ccID: ccID,
            };
            return oParams;
        },

          gettravelID: function (travelid) {
            var travelID = $( "#travel_id").val();
            console.log(travelID);
            return travelID;
        },

        ccDataShow:function(ev){
          var ccID = ev.target.id;
            var oParams = this.getParams(ccID);
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
    editCCData:function(){
      console.log('edit ajax');
      var oParamsEdit = this.getParamsEdit();
      $("#header").addClass('loading');
      $(".show-body").addClass('hide');
      $("#editCCbtn").addClass('disabled');
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
                sUrl : '/asnodewebapp/ccDataEdit',
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
                    ccID: $( "#cc_id_edit").val(),
                    cc_date: $( "#cc_date_edit").val(),
                    cc_item: $( "#cc_item_edit").val(),
                    cc_amount: $( "#cc_amount_edit").val(),
                    cc_status:$( "#cc_status_edit").val(),
                    cc_fourdigit:$( "#cc_fourdigit_edit").val(),
                    cc_type:$( "#cc_type_edit").val(),
                    cc_provider:$( "#cc_provider_edit").val(),
                    cc_comment:$( "#cc_comment_edit").val(),
            };
            return oParams;
        },
        gettravelIDEdit: function () {
            var travelID = $( "#travel_id_edit").val();
         
            return travelID;
        },
        gettravelBookeddate: function () {
            var travelBookeddate = $( "#travel_bookeddate_edit").val();
            //console.log(travelID);
            return travelBookeddate;
        },
        gettravelDate: function () {
            var travelDate = $( "#travel_date_edit").val();
          
            return travelDate;
        },
        gettravelFrom: function () {
            var travelFrom = $( "#travel_from_edit").val();
          
            return travelFrom;
        },
        gettravelTo: function () {
            var travelTo = $( "#travel_to_edit").val();
           
            return travelTo;
        },
        gettravelMode: function () {
            var travelMode = $( "#travel_mode_edit").val();
       
            return travelMode;
        },
        gettravelPNR: function () {
            var travelPNR = $( "#travel_pnr_edit").val();
        
            return travelPNR;
        },
        gettravelStatus: function () {
            var travelStatus = $( "#travel_status_edit").val();
     
            return travelStatus;
        },
        gettravelAmount: function () {
            var travelAmount = $( "#travel_amount_edit").val();
            return travelAmount;
        },

        gettravelCount: function () {
            var travelCount = $( "#travel_count_edit").val();
            return travelCount;
        }
    // close edit travel data ajax section

}); 
        return  RentView;
    }); 
