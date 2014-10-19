/**
 * Created by hdoan on 5/5/14.
 *
 * Validates form inputs. Will emit Backbone event if input is valid, invalid, or empty.
 * The event naming convention is 'valid', 'invalid', or 'empty' followed by the name attribute of the field
 *
 * For example, if you are validating the email input, the three possible events are as follows:
 * 1. 'validemail'
 * 2. 'invalidemail'
 * 3. 'emptyemail'
 */
define(
    [ 'jquery', 'backbone', 'underscore' ],

    function($, Backbone, _) {
        'use strict';

        var validation = {

            init: function(view) {
                var elem = view.$el,
                    fields = elem.find('.validate');

                if (fields.length !== 0) {

                    // Find all fields with the 'validate' class and onblur add handler to validate
                    fields.each(function() {
                        $(this).on('blur', function (field) {
                            validation.doValidation(field.target);
                        });
                    });
                }
            },

            /**
             * Performs the validation
             *
             * @param {Object} target - event object
             */
            doValidation: function(target) {
                
                var targetElement = target,
                    targetType = target.type,
                    targetName = target.id,
                    targetValue= target.value,
                    trimmedValue = $.trim(targetValue),  // Trim leading and trailing whitespace

                    EMAIL_REGEX = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, // to be consistent with back end
                    //EMAIL_REGEX = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i,
                    PASSWORD_REGEX = /([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]){8,}/i,   
                    //CURRECY VALIDATION
                    CURRENCY_REGEX = /^(?!0\.00)\d{1,3}(,\d{3})*(\.\d\d)?$/,
                    //NUMBER VALIDATION
                    NUMBER_REGEX = /^[0-9]+$/;
                  //  alert(targetType + "and" + targetValue );

                // If its type is a text input, email, or password field then first check for isEmpty
                // If empty emit error event with the name attribute of the target element
                // There might be a better way to do this, perhaps a switch statement?
               // if (targetType === 'travel_bookeddate'  || targetType === 'travel_date'  || targetType === 'travel_to'  ||  targetType === 'travel_from'  || targetType === 'travel_pnr'  || targetType === 'travel_mode' || targetType === 'travel_amount'  || targetType === 'travel_count'  || targetType === 'text' || targetType === 'email' || targetType === 'password') {
                 if ( targetType === 'select-one' || targetType === 'text' || targetType === 'email' || targetType === 'password') {
                    if (validation.isEmpty(targetElement)) {
                        validation.trigger('empty' + targetName);
                    } else {
                    //     alert("targetValue " + targetValue);
                    // alert("trimmedValue "+trimmedValue);
                    // alert("tragetname  "+targetName);

                        // Then using the name attribute on a switch statement to route to the correct validation function after isEmpty check
                        switch (targetName) {
                            case 'travel_bookeddate':
                                        validation.trigger('valid' + targetName);
                            break;
                            case 'travel_date':
                                        validation.trigger('valid' + targetName);
                            break;
                            case 'travel_from':
                                        validation.trigger('valid' + targetName);
                            break;
                             case 'travel_to':
                                    validation.trigger('valid' + targetName);
                            break;
                            case 'travel_pnr':
                                    validation.trigger('valid' + targetName);
                            break;
                            case 'travel_mode':
                                    validation.trigger('valid' + targetName);
                            break;
                            case 'travel_status':
                                    validation.trigger('valid' + targetName);
                            break;
                            case 'travel_amount':
                                    validation.isValid(CURRENCY_REGEX, trimmedValue, targetName);
                            break;
                            case 'travel_count':
                                    validation.isValid(NUMBER_REGEX, trimmedValue, targetName);
                            break;
                          case 'email':
                            validation.isValid(EMAIL_REGEX, trimmedValue, targetName);
                            break;
                        case 'password':
                            // Commenting out for now, but might need for future
                            //validation.isValid(PASSWORD_REGEX, trimmedValue, targetName);
                           validation.trigger('valid' + targetName);
                            break;
                        default:
                            validation.trigger('valid' + targetName);
                        }
                    }
                }
            },

            /**
             * Performs an empty check
             *
             * @param targetElement - the element on which the empty check is performed
             * @returns {Boolean}
             */
            isEmpty: function(targetElement) {
               // alert(targetElement.value);
                if (targetElement.value === '' || targetElement.value === '0') {
                    //alert("target");
                    console.log("reac");
                    console.log(targetElement.value);
                    return true;
                } else {
                    return false;
                }
            },

            /**
             * Performs the validation of the input field
             *
             * @param {String} regex - the regular expression
             * @param {String} value - the trimmed value of the input field
             * @param {String} target - the input name attribute
             */
            isValid: function(regex, value, target) {
                
                if (regex.test(value)) {
                    validation.trigger('valid' + target);
                } else {
                    validation.trigger('invalid' + target);
                }
            }

        };

        _.extend(validation, Backbone.Events);

        return validation;

    }

);
