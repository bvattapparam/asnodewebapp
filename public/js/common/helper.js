/*global define:true */
define([
	'nougat',
	'underscore',
	'jquery',
	'backbone',
	'BaseView'
],
	function (nougat, _, $, Backbone, BaseView) {

		"use strict";

		var Helper = {
			testf:function(){
				alert('tester');
			},

			simplePostAndRender: function (oParams) {
                var jqxhr;
				$(oParams.elementID).addClass('loading');
				jqxhr = $.post(oParams.sUrl, oParams.oForm,function (data) {
					oParams.view.template = oParams.template;
					oParams.view.model.set(data);
					oParams.view.afterRender = function (content) {
						$(oParams.elementID).removeClass('loading');
						$(oParams.elementID).html(content);
						if (typeof oParams.callback === 'function') {
							oParams.callback(oParams.context);
						}
					};
					oParams.view.render();
				}).done(function (data) {
					//Triggers the view name once fetched
					// $('body').trigger("viewLoaded", [data.viewName]);
				});
                return jqxhr;
			},

			simplePost: function (oParams) {
				return $.post(oParams.sUrl, oParams.oForm,function (data) {
					console.log("REACHED");
					if (typeof oParams.callback === 'function') {
						oParams.callback(data);
					}
				});
			},

			simpleRender: function (oParams) {
				oParams.view.template = oParams.template;
				oParams.view.model.set(oParams.data);
				oParams.view.afterRender = function (content) {
					$(oParams.elementID).html(content);
					if (typeof oParams.callback === 'function') {
						oParams.callback();
					}
				};
				oParams.view.render();
			}
		};

		return Helper;
	});
