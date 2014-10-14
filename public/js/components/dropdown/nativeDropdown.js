/**     Name:  Dropdown Widget */
define(["jquery"], function($) {
    "use strict";
    $.fn.nativeDropdown = function(settings) {

        var config = {
            replacedClass : 'replaced', // Class name added to replaced selects
            customSelectClass : 'custom-select', // Class name of the (outer) inserted span element
            activeClass : 'active', // Class name assigned to the fake select when the real select is in hover/focus state
            wrapperElement : '<div class="custom-select-container" />' // Element that wraps the select to enable positioning
        };

        if (settings) {
            $.extend(config, settings);
        }

        this.each(function() {
            var $wrapper = $(this), $select = $wrapper.find("select");

            if($(this).closest('.nativeDropdown').hasClass('enhanced')){
                var label = $('<div class="' + config.customSelectClass + '" aria-hidden="true">' + $('option:selected', this).text() + '</div>');
                $wrapper.append(label);
                /**
                 Update method to change the selected value inside the span, This method picks the abbrevation present in data-abbreviation
                 attribute else the selcted option text
                 **/
                var update = function() {
                    var option = $('option:selected', this), val = option.attr('data-abbreviation') ? option.attr('data-abbreviation') : option.text();
                    label.text(val);
                };

                // Update the fake select when the real select’s value changes
                $select.bind('change keyup', update);
            }

            // Change class names to enable styling of hover/focus states
            $select.bind('mouseenter focus', function() {
                $wrapper.addClass("hovered");
            });
            // Change class names to enable styling of hover/focus states
            $select.bind('mouseleave blur', function() {
                $wrapper.removeClass("hovered");
            });
        });
    };
}); 