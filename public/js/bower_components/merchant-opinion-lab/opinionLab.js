/*
 * This file contains the javascript functions and snippets
 * that are used to introduce the site feedback link in the footer.
 * Function O_GoT inserts the link in the footer list and assigns onclick
 * for popup window that displays the feedback from from opinionlab site.
 */

define([], function () {

	'use strict';
	window.PAYPAL = window.PAYPAL ? window.PAYPAL : {};
	var opVars = window.PAYPAL.opinionLabVars;

	var _doc = document,
		_w 	 = window,
		_tm  = (new Date()).getTime(),
		_sH  = screen.height,
		_sW  = screen.width;

	/**
	 * This method forms the siteFeedback image tag to be written into the DOM
	 * Note: While calling this method, please make sure to check if sitefbIcon is enabled. This is decided by boolean the property 'showSitefbIcon'.
	 * @returns sfimg
	 */
	function siteFeedBackImage () {
		var sfImg = document.createElement('img');
		sfImg.setAttribute('src', opVars.sitefb_plus_icon);
		sfImg.setAttribute('alt', '');
		return sfImg;
	}

	function popUp (opinionlabURL) {
		_w.open(opinionlabURL, 'comments', 'width=535,height=192'
											+ ',screenX=' + ((_sW - 535)/2)
											+ ',screenY=' + ((_sH - 192) / 2)
											+ ',top=' + ((_sH - 192) / 2)
											+ ',left=' + ((_sW - 535) / 2)
											+ ',resizable=yes'
											+ ',copyhistory=yes'
											+ ',scrollbars=no');
	}

	function createLink (_p) {
		var sfLink 	= document.createElement('a');

		sfLink.setAttribute('href', '#');
		sfLink.innerHTML=_p;
		_doc.getElementById("siteFeedback").appendChild(sfLink);

		if(opVars.showSitefbIcon){
			_doc.getElementById("siteFeedback").appendChild(siteFeedBackImage());
		}

		return sfLink;
	}

	function _fC (_u) {
		var _sp = '%3A\\/\\/',
			_rp = '%3A//',
			_aT = _sp + ',\\/,\\.,-,_,' + _rp + ',%2F,%2E,%2D,%5F',
			_aA = _aT.split(',');

		for (var i = 0; i < 5; i++) {
			eval('_u=_u.replace(/' + _aA[i] + '/g,_aA[i+5])');
		}
		return _u;
	}

	return {
			'custom_var'				: '',
			'_ht'						: escape(_w.location.href),
			'_hr'						: _doc.referrer,
			'_kp'						: 0,
			'baseurl'					: '',
			'url_var'					: '',
			'assignSiteCatalystVars'	: '',

			'PP_O_LC' : function (openPopup) {
				var opinionlabURL = this.baseurl + '&olparams='
									+ 'time1$' 			+ _tm
									+ '|time2$'			+ (new Date()).getTime()
									+ '|prev$'			+ _fC(escape(this._hr))
									+ '|referer$'		+ _fC(this._ht)
									+ '|height$'		+ _sH
									+ '|width$'			+ _sW
									+ '&custom_var='	+ this.custom_var;

			  	if(openPopup){
			  		popUp(opinionlabURL);
			  	}else{
			  		return opinionlabURL;
				}
			},

			'O_LC' : function (openPopup) {
				var opinionlabURL = 'https://secure.opinionlab.com/ccc01/comment_card.asp?'
									+ 'time1=' 			+ _tm
									+ '&time2=' 		+ (new Date()).getTime()
									+ '&prev=' 			+ _fC(escape(this._hr))
									+ '&referer=' 		+ _fC(this._ht)
									+ '&height=' 		+ _sH
									+ '&width=' 		+ _sW
									+ '&custom_var=' 	+ this.custom_var
									+ (this.url_var !== undefined && this.url_var.length > 0 ? '&url_var=' + _fC(escape(this.url_var)) : '');

				if (openPopup) {
					popUp(opinionlabURL);
				} else {
					return opinionlabURL;
				}
			},

			'O_GoT' : function (_p) {
				var sfLink 	= createLink(_p),
					self 	= this;

				sfLink.onclick=function(){
					self.assignSiteCatalystVars();
					self.O_LC(true);
					return false;
				};
			},

			'PP_O_GoT' : function (_p){
				var sfLink 	= createLink(_p),
					self 	= this;

				sfLink.onclick=function(){
					self.assignSiteCatalystVars();
					self.PP_O_LC(true);
					return false;
				};
			},


			'Mini_O_GoT' : function (_p, base){
				var sfLink 		= document.createElement('a'),
					sfLinkSpan 	= document.createElement('span'),
					self 		= this;

				sfLink.setAttribute("href","#");
				if(opVars.showSitefbIcon){
					sfLink.appendChild(siteFeedBackImage());
				}

				if ( base ) {
					sfLink.onclick = function () {
						self.assignSiteCatalystVars();
						self.PP_O_LC(true);
						return false;
					};
				} else {
					sfLink.onclick = function () {
						self.assignSiteCatalystVars();
						self.O_LC(true);
						return false;
					};
				}

				sfLinkSpan.innerHTML=_p;
				sfLink.appendChild(sfLinkSpan);
				_doc.getElementById("siteFeedback").appendChild(sfLink);
			}
	};
});
