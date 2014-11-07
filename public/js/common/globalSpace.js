  "use strict";
/* global define:true */
define([
    'nougat',
    'underscore',
    'jquery',
    'backbone',
    'BaseView',
    'viewUtil',
    'datatables',
     'dtpagination'
],
function (nougat, _, $, Backbone, BaseView, ViewUtil) {

        	var globalSpaceView ={
        		preFillSelectbox:function(){
			$(".selectDropdown").children("span").each(function(){
                            			var spanClass = $(this).attr('class');
                            			var selectID = spanClass;
                            			$('span.'+spanClass).html($('select#'+selectID+'>option:selected').text());
                    		});                
               		},
               		// global function for dropdown box event on select the item
               		 dropdownSpanUpdate:function(ev){
	                   	var selectedItem = ev.target.options[ev.target.selectedIndex].text;
                    		var selectedItemID = ev.target.id;
	                    	var spanClass = selectedItemID;
	                   	$('span.'+spanClass).html(selectedItem);
	                },
	                // find the cc type based on the cc number given	
	                getCreditCardType:function(ccNumber){
	                      	//start without knowing the credit card type
	                      	var result = "credit-card"; // this is the default fa-icon. and not needed then remove this
	                     	 //first check for MasterCard
	                     	 if (/^5[1-5]/.test(ccNumber))
	                     	 {
	                        		result = "mastercard";
	                      	}
	                      	//then check for Visa
	                      	else if (/^4/.test(ccNumber))
	                     	{
	                        		result = "visa";
	                      	}
	                      	//then check for AmEx
	                      	else if (/^3[47]/.test(ccNumber))
	                      	{
	                        		result = "amex";
	                      	}
	                      	return result;
                	},
                	paginationSection:function(oTable){
		          console.log("REACHED pagination function" + oTable);
		          $(oTable).dataTable();
		          $('.pagination-topliner').find('input').addClass('form-control').attr('placeholder','search inside the report').wrap("<div class='input-group'></div>" ).before( " <div class='input-group-addon'><span class='fa fa-search'></span></div>" );
		},

	};

        	return  globalSpaceView;
}); 
