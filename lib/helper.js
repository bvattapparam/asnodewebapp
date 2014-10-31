/** Helper : Can be use to for global functions. **/
'use strict';
var locale = require('../lib/locale');
var mysqlDB = require('mysql');

function Helper(timezone) {
	// this.timezone = timezone;
}

Helper.prototype = {

        showConsole : true, // determine to show console log
	/**
	* Check if value exists in array
	* @param val Value which we search
	* @param arr Array where we search
	* @returns {boolean} True if exists and false if not
	* @example
	* Helper.isExistsInArray('My Value', [
	*      'First Value',
	*      'My Value',
	*      'Second Value'
	* ]);
	*/
        
	isExistsInArray: function (val, arr) {
        var i;

        for (i in arr) {
            if (arr.hasOwnProperty(i)) {
                if (arr[i] === val) {
                    return true;
                }
            }
        }
        return false;
    },

	/**
	 * Returns filename from a URL
	 * @param  {string} sUrl URL that has the filename
	 * @return {string}      filename
	 */
	getFileName: function (sUrl) {
		var aText = sUrl.split("/");
		return (aText[aText.length - 1]);
	},

	getAccountData: function (req) {
		var account = {
                accountNumber : req.user.accountNumber,
                id : req.user.email
			};
		return account;
	},
	  // Currency formatter
                /*
                  locality == country code eg IN
                  culture == country locale eg en_IN
                  serviceResponse == json result
                  currency == currency format eg INR if empty then it will take the default format like Re.
                  formatfield == which field needs to be formatted
                  formatted_field == new formatted object in existing json array
                */
                cFormatter:function(locality,culture,serviceResponse,currency,formatfield,formatted_field){
                        this.sConsole("TYPE OF SERVICE RESPONSE", typeof serviceResponse);
                        if(serviceResponse==='NA'){
                                var formatter= locale.formatter(locality,culture);
                                formatfield=formatter.formatCurrency(formatfield,currency);  
                                return formatfield;
                        }else{
                                var formatter= locale.formatter(locality,culture), i;
                                for (i = 0; i < serviceResponse.length; i++) {
                                        serviceResponse[i][formatted_field]=formatter.formatCurrency( serviceResponse[i][formatfield],currency);  
                                }
                        }    
                },
             
                // Currency formatter
                /*
                  locality == country code eg IN
                  culture == country locale eg en_IN
                  serviceResponse == json result
                  currency == currency format eg INR if empty then it will take the default format like Re.
                  formatfield == which field needs to be formatted
                  formatted_field == new formatted object in existing json array
                */
                 dFormatter:function(locality,culture,serviceResponse,currency,dateField,dateFormat){
                              var formatter= locale.formatter(locality,culture), i;
                             for (i = 0; i < serviceResponse.length; i++) {
                                          serviceResponse[i][dateField]=formatter.formatDate(serviceResponse[i][dateField],dateFormat);  
                              }
                },
                cTotalAmount:function(serviceResponse,totalAmountField){
                        var i, totalamount=0;
                        for(i=0;i<serviceResponse.length;i++){
                          totalamount +=serviceResponse[i][totalAmountField]
                        }
                        return totalamount;
                },
                // beautified console module 
                sConsole:function(oLog,oConsoledata){
                  if(this.showConsole){
                    if(typeof oConsoledata!="undefined"){
                      console.log("\n--------------------"+ oLog + "| "+ oConsoledata +" |-------------------\n")
                    }
                    else{
                      console.log("\n|--------------------"+ oLog +"-------------------|\n")
                    }  
                  }
                 },
                 
                 // database configuration
                dbConfigSet:function(){
                    this.host='localhost';
                    this.user='root';
                    this.password='testuser';
                    this.database='as_nodeapp';
                    return mysqlDB.createPool({host:this.host,user:this.user,password:this.password,database:this.database});
                }
};

module.exports = Helper;