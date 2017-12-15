/*
    MsgBox

    File name: msgbox.js (Version: 0.5)
    Description: This file contains the MsgBox - Message window.

    Coded by George Delaportas (G0D) 
    Copyright (C) 2017
    Open Software License (OSL 3.0)
*/

// MsgBox 
function msgbox()
{
    // General helpers
    function general_helpers()
    {
        var me = this;

        this.draw_screen = function(container_id)
        {
            var __button_object = null,
                __container = utils.objects.by_id(container_id),
                __html = null;

            if (__container === false || utils.validation.misc.is_undefined(__container) || __container === null)
                return false;

            msgbox_object = utils.objects.by_id('msgbox');

            if (msgbox_object !== null)
                __container.removeChild(msgbox_object);

            msgbox_object = document.createElement('div');

            msgbox_object.id = 'msgbox';
            msgbox_object.className = 'mb_screen'

            var win_title = msgbox_object.id + '_title',
                button_title = msgbox_object.id + '_button';

            __html = '<div class="msg_window">' + 
                     '  <div id="' + win_title + '"></div>' + 
                     '  <div id="' + msgbox_object.id + '_content"></div>' + 
                     '  <div id="' + button_title + '"></div>' + 
                     '</div>';

            msgbox_object.innerHTML = __html;

            __container.appendChild(msgbox_object);

            content_fetcher(win_title, null, 
                            function(content)
                            {
                                utils.objects.by_id(win_title).innerHTML = 'Pro4ia :: KBS';
                                utils.objects.by_id(button_title).innerHTML = 'Close';

                                __button_object = utils.objects.by_id(button_title);

                                utils.events.attach(button_title, __button_object, 'click',  me.hide_win);
                            });

            return true;
        };

        this.show_win = function(message)
        {
            if (timer !== null)
                clearTimeout(timer);

            msgbox_object.childNodes[0].childNodes[3].innerHTML = message;

            msgbox_object.style.visibility = 'visible';

            msgbox_object.classList.remove('mb_fade_out');
            msgbox_object.classList.add('mb_fade_in');

            is_open = true;
        };

        this.hide_win = function()
        {
            if (timer !== null)
                clearTimeout(timer);

            msgbox_object.style.visibility = 'visible';

            msgbox_object.classList.remove('mb_fade_in');
            msgbox_object.classList.add('mb_fade_out');

            timer = setTimeout(function() { msgbox_object.style.visibility = 'hidden'; }, 250);

            is_open = false;

            if (hide_callback !== null)
            {
                hide_callback.call(this);

                hide_callback = null;
            }
        };
    }

    // Show msgbox
    this.show = function(message, callback)
    {
        if (!is_init || is_open || !utils.validation.alpha.is_string(message) || 
            (!utils.validation.misc.is_invalid(callback) && 
             !utils.validation.misc.is_function(callback)))
            return false;

        hide_callback = callback;

        helpers.show_win(message);

        return true;
    };

    // Hide msgbox (with optional callback)
    this.hide = function(callback)
    {
        if (!is_init || !is_open || 
            (!utils.validation.misc.is_invalid(callback) && 
             !utils.validation.misc.is_function(callback)))
            return false;

        hide_callback = callback;

        helpers.hide_win();

        return true;
    };

    // Get msgbox status
    this.is_open = function()
    {
        if (!is_init)
            return false;

        return is_open;
    };

    // Initialize
    this.init = function(container_id)
    {
        if (is_init)
            return false;

        if (utils.validation.misc.is_invalid(container_id) || !utils.validation.alpha.is_string(container_id))
            return false;

        if (!utils.graphics.apply_theme('/framework/extensions/js/msgbox', 'style'))
            return false;

        if (!helpers.draw_screen(container_id))
            return false;

        is_init = true;

        return true;
    };

    var is_init = false,
        is_open = false,
        msgbox_object = null,
        hide_callback = null,
        timer = null,
        helpers = new general_helpers(),
        utils = new vulcan();
}
