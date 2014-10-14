/*
 * Behaviour For UVL TextField
 *
 * DESCRIPTION:
 *
 * USAGE:
 *
 * REQUIRED FILES:
 *	jquery-1.7.1.min.js
 *	jQuery-ui-widgets-1.8.16.min.js
 *
 */
define(['jquery', 'jqueryUI'], function($) {
	$.widget('pp.textField', {
		_create : function() {
			this._getElements();
			this._addListeners();
			this._load();
		},
		_getElements : function() {
			this.elements = {};
			this.elements.parent = this.element;
			this.elements.input = this.element.find('input, textarea');
			this.elements.helpErrors = this.element.find('.help-error');
			this.elements.helpInformation = this.element.find('.help-information');
		},
		_addListeners : function() {
			this.elements.input.bind('focus', $.proxy(this._focus, this));
			this.elements.input.bind('blur', $.proxy(this._blur, this));

			this.elements.input.bind('complete', $.proxy(function() {
				this.closeBubble();
				var field = this.elements.input[0];
				/*
				 if (field.checkValidity && !field.checkValidity()) {
				 this.elements.parent.addClass('hasError');
				 }*/
				var result = this.validateField(field);
				if (!result.valid) {
					this.elements.parent.addClass('hasError');
					this.elements.input.attr("aria-invalid", "true");
				} /*
				 else {
				 this.elements.parent.removeClass('hasError');
				 this.elements.input.attr("aria-invalid", "false");
				 }*/

			}, this));

			this.elements.input.bind('error', $.proxy(this.openError, this));
		},
		_load : function() {
			if (this.elements.input.val()) {
				this.elements.input.addClass('userText');
			} else {
				this.elements.input.removeClass('userText');
			}
		},

		_blur : function() {
			this._load();
			this.closeBubble();
			var field = this.elements.input[0];
			//if (field.checkValidity) {
			//	if (!field.checkValidity()) {
			var result = this.validateField(field);
			this._emptyFieldRule(result);
			//	}
			//}
		},

		_emptyFieldRule : function(result) {
			/* Special rules for empty required field */
			if (!result.valid && result.error !== 'valueMissing') {
				this.elements.parent.addClass('hasError');
				this.elements.input.attr("aria-invalid", "true");
			} /*
			 else {
			 this.elements.parent.removeClass('hasError');
			 this.elements.input.attr("aria-invalid", "false");
			 }*/

		},

		/*
		 * On focus
		 * - Close All tooltips
		 * - Check if the field has error
		 *   - if yes : open tooltip
		 *   - if no : do nothing
		 */
		_focus : function(event) {
			this.closeAllBubble();

			hasErrors = this.elements.parent.hasClass('hasError');
			if (hasErrors) {
				this.openError();
			} else {
				this.openHelp();
			}
		},

		// open error helper and mark it open
		openError : function() {
			var id = this.elements.input.attr("id");
			if (id && id.length > 0) {
				this.elements.input.attr("aria-describedby", id + "-help-error");
			}
			this.elements.helpErrors.addClass('open');
		},

		// open error helper and mark it open
		openHelp : function(target) {
			var id = this.elements.input.attr("id");
			if (id && id.length > 0) {
				this.elements.input.attr("aria-describedby", id + "-help-information");
			}
			this.elements.helpInformation.addClass('open');
		},

		closeBubble : function() {
			var id = this.elements.input.attr("id");
			if (id && id.length > 0) {
				this.elements.input.removeAttr("aria-describedby");
			}
			this.elements.helpErrors.removeClass('open');
			this.elements.helpInformation.removeClass('open');
		},

		// close error helper
		closeAllBubble : function() {
			$('p.open, div.open').removeClass('open');
		},

		validateField : function(field) {
			if (field.checkValidity) {
				/* Check HTML5 Field Validity */
				if (!field.checkValidity()) {
					var prop = "";
					for (prop in field.validity) {
						if (field.validity[prop] === true && prop !== 'valid') {
							return {
								'valid' : false,
								'error' : prop
							};
						}
					}
				}
			} else {
				/* Non-HTML5 Compatibility Case */

				validity = {
					valueMissing : this.processRequired(),
					typeMismatch : true,
					patternMismatch : this.processPattern(),
					rangeUnderflow : true,
					rangeOverflow : true,
					customError : true
				};

				if (!validity.valueMissing) {
					return {
						'valid' : false,
						'error' : 'valueMissing'
					};
				} else if (!validity.patternMismatch) {
					return {
						'valid' : false,
						'error' : 'patternMismatch'
					}
				}

			}

			return {
				'valid' : true
			};
		},

		processRequired : function() {
			if ( typeof this.elements.input.attr('required') !== 'undefined') {
				var val = this.elements.input.val();
				if (val != null && $.trim(val).length > 0) {
					return true;
				} else {
					return false;
				}
			}
			return true;
		},

		processPattern : function() {
			var $input = this.elements.input;
			if (! $input.attr('pattern')) {
				return true;
			}
			var pattern = new RegExp($input.attr('pattern'), 'g');
			return pattern.test($input.val());
		}
	});
}); 