/*
    KeyCard (Login form and logout button)

    File name: keycard.js (Version: 1.4)
    Description: This file contains the KeyCard extension.
    Dependencies: Vulcan, MsgBox, Key Manager, Heartbeat and AJAX Factory.

    Coded by George Delaportas (G0D)
    Copyright (C) 2019
    Open Software License (OSL 3.0)
*/

// KeyCard
function keycard()
{
    var utils = new vulcan();
    var key_control = new key_manager();
    var msg_box = null;
    var content_object = null;
    var login_username_object = null;
    var login_password_object = null;
    var login_button_object = null;
    var logout_button_object = null;

    function bootstrap()
    {
        content_object = utils.objects.by_class('content')[0];

        utils.graphics.apply_theme('/framework/extensions/php/user/keycard', 'keycard');

        setTimeout(function(){ run_heartbeat(); }, 2500);
    }

    function scan_enter(event)
    {
        key_control.scan(event);

        if (key_control.get() === key_control.constants().ENTER)
            check_credentials();
    }

    function check_credentials()
    {
        var username = utils.objects.by_id('login_username_text');
        var password = utils.objects.by_id('login_password_text');

        if (!utils.validation.utilities.is_email(username.value))
        {
            content_object.style.filter = 'blur(8px)';

            msg_box.show('micro-MVC', 'The email format is invalid!', 
                         function() { content_object.style.filter = 'none'; });

            return;
        }

        if (username.value.length < 3 || password.value.length < 8)
        {
            content_object.style.filter = 'blur(8px)';

            msg_box.show('micro-MVC', 'Credentials are invalid!', 
                         function() { content_object.style.filter = 'none'; });

            return;
        }

        login_username_object.disabled = true;
        login_password_object.disabled = true;
        login_button_object.disabled = true;

        var data = 'gate=auth&mode=login&username=' + username.value + '&password=' + password.value;

        ajax_factory(data, function()
                        {
                            location.assign('/');
                        },
                        function()
                        {
                            content_object.style.filter = 'blur(8px)';

                            msg_box.show('micro-MVC', 'Your credentials are wrong!', 
                                         function() { content_object.style.filter = 'none'; });
                        },
                        function()
                        {
                            login_username_object.disabled = false;
                            login_password_object.disabled = false;
                            login_button_object.disabled = false;
                        });
    }

    function logout()
    {
        var data = 'gate=auth&mode=logout';

        logout_button_object.disabled = true;

        ajax_factory(data, function()
                           {
                                location.assign('/');
                           },
                           function()
                           {
                                content_object.style.filter = 'blur(8px)';

                                msg_box.show('micro-MVC', 'Logout was impossible!', 
                                             function() { content_object.style.filter = 'none'; });
                           },
                           function()
                           {
                                logout_button_object.disabled = false;
                           });
    }

    function abnormal_logout()
    {
        content_object.style.filter = 'blur(8px)';

        msg_box.show('micro-MVC', 'Your session has been terminated!', 
                     function() { content_object.style.filter = 'none'; });

        setTimeout(function(){ logout(); }, 2500);
    }

    function run_heartbeat()
    {
        var heartbeat_config = {
                                    "interval"          :   60000,
                                    "response_timeout"  :   3000,
                                    "on_success"        :   function() { console.log('OK'); },
                                    "on_fail"           :   function() { console.log('ERROR'); abnormal_logout(); },
                                    "on_timeout"        :   function() { console.log('TIME OUT'); abnormal_logout(); }
                                };

        heartbeat_config.url = '/';
        heartbeat_config.service_name = 'KeyCard';

        heartbeat(heartbeat_config);
    }

    this.init = function(mode)
    {
        msg_box = new msgbox();
        msg_box.init('main');

        if (mode === 'login')
        {
            login_username_object = utils.objects.by_id('login_username_text');
            login_password_object = utils.objects.by_id('login_password_text');
            login_button_object = utils.objects.by_id('login_button');

            utils.events.attach('username', login_username_object, 'keydown', scan_enter);
            utils.events.attach('password', login_password_object, 'keydown', scan_enter);
            utils.events.attach('login', login_button_object, 'click', check_credentials);
        }
        else if (mode === 'logout')
        {
            logout_button_object = utils.objects.by_id('logout_button');

            utils.events.attach('logout', logout_button_object, 'click', logout);
        }
        else
            return false;

        return true;
    };

    bootstrap();
}
