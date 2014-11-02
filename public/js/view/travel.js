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
    function (nougat, _, $, ui, Backbone, BaseView, ViewUtil, Helper, globalSpace) {
        var TravelView = BaseView.extend({
        el:"#travel",
                events: {
                        'change #travel_mode_edit':'dropdownSpanUpdate',
                         'change #travel_status_edit':'dropdownSpanUpdate',
                         'click .editTravelCall':'travelDataShow',
                         'click #editTravelbtn':'editTravelData',
                         'click .close':'reloadParent'
                       },

        initialize: function(){   
                console.log("travel view loaded");
                globalSpace.paginationSection('#travelData');
                this.showCalendar();
                this.preFillSelectbox();
                this.ajaxPrefilter();
                this.toolTipShow();
        },
        toolTipShow:function(){
            $('[data-toggle="popover"]').popover({
                  trigger: 'hover',
                      'placement': 'left'
              });
        },
        reloadParent:function(){
              window.location.reload();
        },
        showCalendar:function(){
              $('#cal_travel_bookeddate_edit, #cal_travel_date_edit').datetimepicker({pickTime: false});
        },
    
        openModal:function(){
          $('#myModal').modal('show'); 
        },
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
                },

      
          renderTravelData: function (data) {
            var oParams = this.getTravelDataRenderParams(),
            oSelf = this;
            oParams.data = data;
            oParams.callback = function () {
                        oSelf.preFillSelectbox();
                        oSelf.openModal();
                             $('#loadingspan').removeClass('loadingTransp');
                             $('#loadingspan').removeClass('show');
                              //$('#travel_date_edit').val($.datepicker.formatDate('yy/mm/dd', new Date($('#travel_date_edit').val())));
                              //$('#travel_bookeddate_edit').val($.datepicker.formatDate('yy/mm/dd', new Date($('#travel_bookeddate_edit').val())));
                              oSelf.showCalendar();
            };
            Helper.simpleRender(oParams);
            
        },
            getTravelDataRenderParams: function () {
            var travelDataView,
                  oSelf = this;
                  travelDataView = new BaseView();
            travelDataView.model = new Backbone.Model();

            return {
                    elementID : '#travelDataView',
                    template :  'inc/modeledit_travel',
                    view : travelDataView
                };
        },


         getParams: function (travelID) {
           var oSelf = this;
           //console.log("THIS IS TEST"); 
           var travelD=travelD;
           //alert(travelID);
            return {
                sUrl : '/asnodewebapp/travelData',
                oForm : this.getFormData(travelID),
               callback : function (oData) {
                    if( (oData.data && oData.data.success) || undefined) {
                        oSelf.renderTravelData(oData.data);
                    } else {
                       oSelf.renderTravelData(oData.data);
                    }
                }
            };
        },
        getFormData: function (travelID) {
            var oParams = {
                //travelID: this.gettravelID(),
                travelID: travelID,
            };
            return oParams;
        },

          gettravelID: function (travelid) {
            var travelID = $( "#travel_id").val();
            console.log(travelID);
            return travelID;
        },

        travelDataShow:function(ev){
          var travelID = ev.target.id;
            var oParams = this.getParams(travelID);
            console.log(oParams);
            this.callLoading();
            Helper.simplePost(oParams);
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
    editTravelData:function(){
      console.log('edit ajax');
      var oParamsEdit = this.getParamsEdit();
      $("#header").addClass('loading');
      $(".show-body").addClass('hide');
      $("#editTravelbtn").addClass('disabled');
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
                sUrl : '/asnodewebapp/travelDataEdit',
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
                    travelID: this.gettravelIDEdit(),
                    travel_bookeddate: this.gettravelBookeddate(),
                    travel_date: this.gettravelDate(),
                    travel_from: this.gettravelFrom(),
                    travel_to: this.gettravelTo(),
                    travel_mode: this.gettravelMode(),
                    travel_pnr: this.gettravelPNR(),
                    travel_status: this.gettravelStatus(),
                    travel_amount: this.gettravelAmount(),
                     travel_count: this.gettravelCount(),
                     travel_comment: this.gettravelComment()
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
        },
        gettravelComment: function () {
            var travelComment = $( "#travel_comment_edit").val();
            return travelComment;
        },
    // close edit travel data ajax section

}); 
        return TravelView;
    }); 
