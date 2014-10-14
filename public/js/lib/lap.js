/*global define:false, clearTimeout:true, setTimeout:true */

/**
	Name:  Label as Placeholder ("lap")

	Description:
		Replacement for HTML5's 'placeholder' attribute.  Hovers a label over a textfield.
		Hides the label when user types in the text field.  Accessible.

	Markup:
		<div class="inputField confidential">
			<label for="email" class="">Email address</label>
			<input id="email" name="email" type="email" value="">
		</div>

	Usage:
		$(".inputField").lap();

	Event Matrix (8-30-2012):
		IE7 : keydown, cut, paste
		IE8 : keydown, cut, paste
		IE9 : keydown, cut, paste, textinput, input (exc. backspace)
		Chrome : keydown, cut, paste, input (inc. backspace)
		Firefox: keydown, cut, paste, input (inc. backspace)
		Opera : keydown, input (inc. backspace)
		Safari : keydown, cut, paste, input (inc. backspace)
		iOS : keydown, cut, paste, input (inc. backspace)

		Rationale: Most browsers use "keydown", "cut/paste". Opera requires "input"
		in lieu of "cut/paste," and "change" and "textinput" are added for completeness/outliers.
*/
define([
	"jquery",
	"jqueryUI"
], function ($) {

	"use strict";

	$.widget("pp.lap", {

		_create: function () {
			var $el = this.element,
				$input = (this.$input = $el.find("input")),
				$label = (this.$label = $el.find("label"));

			this._togglePlaceholder = $.proxy(this._togglePlaceholder, this);
			this._timer = null;

			$input.on("focus", $.proxy(this.onFocus, this))
				.on("click", function () {
					$input.focus();
				})
				.on("blur",  $.proxy(this.onBlur, this))
				.on("change cut paste keydown textinput input", $.proxy(this.onInput, this));

			$label.on("click", function (e) {
				if (!$label.hasClass("focus")) {
					$input.focus();
					e.stopPropagation();
				}
			});

			if ($input.val()) {
				$label.addClass("focus accessAid");
			}

			this.element.data("type", "lap");
		},

		destroy: function () {
			$.Widget.prototype.destroy.call(this);
			this.$input.off("focus click blur change cut paste keydown textinput input");
			this.$label.off("click");
		},

		onFocus: function () {
			var $label = this.$label;
			if (!$label.parent().hasClass("error")) {
				$label.addClass("focus");
			}
		},

		onBlur: function () {
			this.$label.removeClass("focus");
			this.$input.attr("aria-invalid", "false");
		},

		onInput: function () {
			// Since we're firing {n} events and each browser supports a different combination
			// of said events to handle input via keyboard and/or cut-and-paste, we used a
			// timeout to attempt to ensure only the last of {n} events has an effect on the DOM.
			// The timeout may have to be adjusted, but the worst-case time complexity is O(n),
			// ({n} * timeout). Should the events fire prior to the timeout it should be faster.
			var timer = this._timer;
			if (timer) {
				clearTimeout(timer);
			}
			this._timer = setTimeout(this._togglePlaceholder, 3);
		},

		_togglePlaceholder: function () {
			this.$label.toggleClass("accessAid", !!this.$input.val());
		}
	});
});