/*
 * shiftenter: a jQuery plugin, version: 0.0.2 (2011-05-04)
 * tested on jQuery v1.5.0
 *
 * ShiftEnter is a jQuery plugin that makes it easy to allow submitting a form
 * with textareas using a simple press on 'Enter'. Line breaks (newlines) in
 * these input fields can then be achieved by pressing 'Shift+Enter'.
 * Additionally a hint is shown.
 *
 * For usage and examples, visit:
 * http://cburgmer.github.com/jquery-shiftenter
 *
 * Settings:
 * 
 * $('textarea').shiftenter({
 *     focusClass: 'shiftenter',
 *     inactiveClass: 'shiftenterInactive',
 *     hint: 'Shift+Enter for line break'
 * });
 *
 * Optional dependencies:
 *
 *   - needs jquery-resize (http://benalman.com/projects/jquery-resize-plugin/)
 *     to adjust the hint text on textarea resizes (especially for webkit
 *     browsers)
 * 
 * Licensed under the MIT:
 * http://www.opensource.org/licenses/mit-license.php
 *
 * Copyright (c) 2011, Christoph Burgmer (christoph -[at]- nwebs [*dot*] de)
 */
(function($) {
    $.extend({
        shiftenter: {
            settings: {
                focusClass: 'shiftenter',
                inactiveClass: 'shiftenterInactive',
                pseudoPadding: '0 10' // Pseudo-padding to work around webkit/firefox4 resize handler being hidden, follows the CSS padding style
            },
            get_padding: function(padding) {
                // Parse padding and return right & bottom padding
                var padding_right = 0,
                    padding_bottom = 0;
                if (padding) {
                    var padding_list = padding.split(/ +/);
                    switch (padding_list.length) {
                        case 1:
                            padding_bottom = padding_right = parseInt(padding_list[0]);
                            break;
                        case 2:
                            padding_bottom = parseInt(padding_list[0]);
                            padding_right = parseInt(padding_list[1]);
                            break;
                        default:
                            padding_right = parseInt(padding_list[1]);
                            padding_bottom = parseInt(padding_list[2]);
                    }
                }
                return {right: padding_right, bottom: padding_bottom}
            },
            debug: false,
            log: function(msg){
                if(!$.shiftenter.debug) return;
                msg = "[ShiftEnter] " + msg;
                $.shiftenter.hasFirebug ?
                console.log(msg) :
                $.shiftenter.hasConsoleLog ?
                    window.console.log(msg) :
                    alert(msg);
            },
            hasFirebug: "console" in window && "firebug" in window.console,
            hasConsoleLog: "console" in window && "log" in window.console
        }

    });
    // plugin code
    $.fn.shiftenter = function(opts) {
        opts = $.extend({},$.shiftenter.settings, opts);

        return this.each(function() {
            var $el = $(this);

            // Our goal only makes sense for textareas where enter does not trigger submit
            if(!$el.is('textarea')) {
                $.shiftenter.log('Ignoring non-textarea element');
                return;
            }

            // Wrap so we can apply the hint
            if (opts.hint) {
                $.shiftenter.log('Registered hint');
                var $hint = $('<div class="' + opts.inactiveClass + '">' + opts.hint + '</div>').insertAfter($el),
                    reposition = function() {
                        var position = $el.position(),
                            padding = $.shiftenter.get_padding(opts.pseudoPadding);

                        /* Position hint, relative right bottom corner of textarea,
                           add pseudo-padding to workaround hint text with heigher z-index hiding resize handler */
                        $hint.css("left", position.left + $el.outerWidth() - $hint.outerWidth() - padding.right)
                            .css("top", position.top + $el.outerHeight() - $hint.outerHeight() - padding.bottom);
                    };
                    
                reposition();

                // Show & Hide hint
                $el.bind('focus.shiftenter', function(){
                    $.shiftenter.log('Gained focus');
                    // Be safe and reposition, size of textarea might have been changed
                    reposition();
                    $hint.removeClass(opts.inactiveClass).addClass(opts.focusClass);
                });
                $el.bind('blur.shiftenter', function(){
                    $.shiftenter.log('Lost focus');
                    $hint.removeClass(opts.focusClass).addClass(opts.inactiveClass);
                });
                // Reposition hint on user grabbing the webkit/firefox4 textarea resize handler
                $el.bind('mousedown.shiftenter', function(){
                    $.shiftenter.log('Mousedown');
                    // Reposition while the mouse is down, use might have clicked on resize handler
                    $el.bind('mousemove.shiftenter', reposition);
                });
                $el.bind('mouseup.shiftenter', function(){
                    $.shiftenter.log('Mouseup');
                    // Stop repositioning
                    $el.unbind('mousemove.shiftenter');
                });
                /* Resize wrap (needs jquery-resize, http://benalman.com/projects/jquery-resize-plugin/),
                   only needed for cases where javascript-triggered resize happens while textarea has focus
                   (e.g. autogrow) */
                $el.bind('resize', function(){
                    reposition();
                });
            }

            // Catch return key without shift to submit form
            $el.bind('keydown.shiftenter', function(event) {
                if (event.keyCode === 13 && ! event.shiftKey) {
                    $.shiftenter.log('Got Shift+Enter, submitting');
                    event.preventDefault();
                    $(this).blur();
                    $(this).parents('form').submit();
                    $(this).focus()
                    return false;
                }
            });

        });
    };
})(jQuery);
