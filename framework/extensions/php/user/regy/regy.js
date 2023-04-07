/*
    Regy (Registration form)

    File name: regy.js (Version: 1.4)
    Description: This file contains the Regy extension.
    Dependencies: Vulcan, MsgBox, Key Manager and AJAX Factory.

    Coded by George Delaportas (G0D) 
    Copyright (C) 2019
    Open Software License (OSL 3.0)
*/

// Regy
function regy()
{
    var utils = new vulcan();
    var local_labels = new yoda();
    var key_control = new key_manager();
    var msg_box = null;
    var content_object = null;
    var register_username_object = null;
    var register_password_object = null;
    var register_password_confirm_object = null;
    var register_button_object = null;

    function bootstrap()
    {
        content_object = utils.objects.by_class('content')[0];

        utils.graphics.apply_theme('/framework/extensions/php/user/regy', 'regy');
    }

    function scan_enter(event)
    {
        key_control.scan(event);

        if (key_control.get() === key_control.keys.ENTER)
            check_credentials();
    }

    function check_credentials()
    {
        var username = utils.objects.by_id('register_username_text');
        var password = utils.objects.by_id('register_password_text');
        var confirm_password = utils.objects.by_id('register_password_confirm_text');

        if (!utils.validation.utilities.is_email(username.value))
        {
            content_object.style.filter = 'blur(8px)';

            msg_box.show(local_labels.fetch(global_m_mvc_dynamic_contents, utils.misc.active_language(), 'm_mvc'), 
                         local_labels.fetch(global_m_mvc_dynamic_contents, utils.misc.active_language(), 'email_inv'), 
                         function() { content_object.style.filter = 'none'; });

            return;
        }

        if (username.value.length < 3 || password.value.length < 8)
        {
            content_object.style.filter = 'blur(8px)';

            msg_box.show(local_labels.fetch(global_m_mvc_dynamic_contents, utils.misc.active_language(), 'm_mvc'), 
                         local_labels.fetch(global_m_mvc_dynamic_contents, utils.misc.active_language(), 'credentials_cmplx'), 
                         function() { content_object.style.filter = 'none'; });

            return;
        }

        if (password.value !== confirm_password.value)
        {
            content_object.style.filter = 'blur(8px)';

            msg_box.show(local_labels.fetch(global_m_mvc_dynamic_contents, utils.misc.active_language(), 'm_mvc'), 
                         local_labels.fetch(global_m_mvc_dynamic_contents, utils.misc.active_language(), 'passwd_confirm'), 
                         function() { content_object.style.filter = 'none'; });

            return;
        }

        register_username_object.disabled = true;
        register_password_object.disabled = true;
        register_password_confirm_object.disabled = true;
        register_button_object.disabled = true;

        var data = 'gate=register&mode=reg&username=' + username.value + '&password=' + password.value + '&confirm=' + confirm_password.value;

        ajax_factory(data, function()
                        {
                            content_object.style.filter = 'blur(8px)';

                            msg_box.show(local_labels.fetch(global_m_mvc_dynamic_contents, utils.misc.active_language(), 'm_mvc'), 
                                         local_labels.fetch(global_m_mvc_dynamic_contents, utils.misc.active_language(), 'reg_success'), 
                                         function(){ content_object.style.filter = 'none'; location.assign('/'); });
                        },
                        function()
                        {
                            content_object.style.filter = 'blur(8px)';

                            msg_box.show(local_labels.fetch(global_m_mvc_dynamic_contents, utils.misc.active_language(), 'm_mvc'), 
                                         local_labels.fetch(global_m_mvc_dynamic_contents, utils.misc.active_language(), 'reg_fail'), 
                                         function() { content_object.style.filter = 'none'; });
                        },
                        function()
                        {
                            register_username_object.disabled = false;
                            register_password_object.disabled = false;
                            register_password_confirm_object.disabled = false;
                            register_button_object.disabled = false;
                        });
    }

    this.init = function()
    {
        msg_box = new msgbox();
        msg_box.init('main');

        register_username_object = utils.objects.by_id('register_username_text');
        register_password_object = utils.objects.by_id('register_password_text');
        register_password_confirm_object = utils.objects.by_id('register_password_confirm_text');
        register_button_object = utils.objects.by_id('register_button');

        utils.events.attach('username', register_username_object, 'keydown', scan_enter);
        utils.events.attach('password', register_password_object, 'keydown', scan_enter);
        utils.events.attach('confirm_password', register_password_confirm_object, 'keydown', scan_enter);
        utils.events.attach('login', register_button_object, 'click', check_credentials);

        return true;
    };

    bootstrap();
}
