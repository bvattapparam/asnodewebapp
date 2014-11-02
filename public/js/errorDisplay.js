/**
 * Created by hdoan on 5/8/14.
 *
 * This is used to hide and show the error associated with an input field.
 * Used also to mark the container of the input field with a 'hasError' class so when the input has focus, the error container can be shown
 * Used also to focus on the first input with an error when the form is invalid due to empty inputs
 */
define(['jquery', 'validation', 'backbone'], function($, Validation, Backbone) {
        'use strict';

        var errorDisplay = {

            /**
             * Shows the error container associated with the input field
             *
             * @param {Object} event - event object
             */
            showError: function (event) {
                var $targetElement = $(event.target),

                    $targetParent = $targetElement.parents('.textInput');
                 // alert($targetParent.value);
                   // console.log($targetParent);

                if ($targetParent.hasClass('hasError')) {
                    $targetParent.css('z-index', '100');
                    $targetElement.parents('.fieldWrapper').siblings('.errorMessage').addClass('show');
                   // $targetElement.parents('.fieldWrapper').siblings('.errorMessage').addClass('show');
                    $targetElement.attr('aria-describedby', event.target.name + 'ErrorMessage');
                }
            },

            /**
             * Hides the error container associated with the input field
             *
             * @param {Object} event - event object
             */
            removeError: function (event) {
                var $targetElement = $(event.target),
                    $targetParent = $targetElement.parents('.textInput');

                if ($targetParent.hasClass('hasError')) {
                    $targetParent.removeClass('hasError');
                    $targetParent.css('z-index', '');  // This removes the inline style
                    $targetElement.parents('.fieldWrapper').siblings('.errorMessage').removeClass('show');
                    $targetElement.removeAttr('aria-describedby');
                }
            },

            /**
             * Added classes necessary to hide or show the error message
             *
             * @param formNames - an array of the name attribute of the form element(s)
             */
            markError: function (formNames) {
                var eventPrefixes = ['empty', 'invalid', 'valid'];

                eventPrefixes.forEach(function(prefix) {


                    formNames.forEach(function(name) {
                        Validation.on(prefix + name, function() {

                            var fieldName = name,
                                $inputContainer = $('#' + fieldName + 'div');
 //alert(prefix);
                            if (prefix === 'invalid') {
                                $inputContainer.addClass('field' + prefix + ' hasError');
                                $inputContainer.removeClass('fieldempty');
                                $inputContainer.find('.errorMessage').find('.emptyError').addClass('hide');
                            }

                            if (prefix === 'empty') {
                                if ($('#frm').hasClass('hasErrors')) {
                                        //alert(":");
                                        $inputContainer.addClass('field' + prefix + ' hasError'); // added hasError but need to reomve this
                                        $inputContainer.removeClass('fieldinvalid');
                                        $inputContainer.find('.errorMessage').find('.invalidError').addClass('hide');
                                }else{
                                        $inputContainer.addClass('field' + prefix); // added hasError but need to reomve this
                                        $inputContainer.removeClass('fieldinvalid');
                                        $inputContainer.find('.errorMessage').find('.invalidError').addClass('hide');
                                }
                            }

                            if (prefix === 'empty' || prefix === 'invalid') {
                                $inputContainer.find('.errorMessage').find('.' + prefix + 'Error').removeClass('hide');
                            }

                            if (prefix === 'valid') {
                                $inputContainer.removeClass('fieldempty fieldinvalid hasError');
                                $inputContainer.find('.errorMessage').find('.emptyError').addClass('hide');
                                $inputContainer.find('.errorMessage').find('.invalidError').addClass('hide');
                            }

                        }, this);
                    });
                });
            },

            /**
             * Used to focus on the first input with an error when the form is invalid due to empty inputs
             * For accessibility
             *
             * @param {Object} $form - the form
             */
            focusError: function(form) {
                var formFields = $(form).find('.validate'),
                    indecies = [];

                formFields.each(function(index, element) {

                    if ($(element).parents('div.hasError').length > 0) {
                        indecies.push(index);
                    }

                });

                formFields[indecies[0]].focus();

            },

            /**
             * Used to animate the page-level notification component
             *
             * @param {Object} view - the view that contains the page-level notification component
             */
            animateNotification: function() {
                var notifications = $('#notifications');

                notifications.slideDown();
                setTimeout(function animateNotification() {
                    notifications.slideUp(function() {
                        Backbone.trigger('slidUp')
                    });
                }, 5000);
            },

            /**
             * Performs the validation of form on submit
             *
             * @param {Object} event - event object
             */
            verifyForm: function (event) {
                var form = event.target,
                    fields = $(form).find('.validate'),
                    toSubmit = true;

                if (fields.length !== 0) {
                    fields.each(function() {

                            var fieldName = this.name,
                                $container = $('#' + fieldName + 'div');

                            Validation.doValidation(this);

                            // Check to see if the wrapping container has class of 'fieldEmpty'
                            // If it does, then we know there is an error there, so we mark the container with a 'hasError' class
                            // so that on focus we can show the error message
                            if ($container.hasClass('fieldempty') || $container.hasClass('fieldinvalid')) {
                                $container.addClass('hasError');
                                toSubmit = false;
                            }
                        }
                    );
                }

                if (toSubmit) {
                    $(form).removeClass('hasErrors');
                    Validation.trigger('valid' + form.name);
                } else {
                    $(form).addClass('hasErrors');
                    event.preventDefault();
                    Validation.trigger('invalid' + form.name, form);
                }
            }

        };

        return errorDisplay;
    }
);
