/** Helper : Can be use to for global functions. **/
'use strict';

function Helper(timezone) {
	// this.timezone = timezone;
}

Helper.prototype = {
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
	}
};

module.exports = Helper;