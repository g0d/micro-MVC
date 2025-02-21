/*
    Test JS

    File name: test.js
    Description: This file contains the test js code for the test view.

    Coded by George Delaportas (G0D) 
    Copyright (C) 2017
    Open Software License (OSL 3.0)
*/

var msg_box = new msgbox();
var work_box = new workbox();
var key_card = new keycard();
var regy_form = new regy();

var m_mvc = global_labels.fetch(global_m_mvc_dynamic_contents, utils.misc.active_language(), 'm_mvc');
var close_button = global_labels.fetch(global_m_mvc_dynamic_contents, utils.misc.active_language(), 'close_button');

msg_box.init('main');
work_box.init('main', m_mvc, close_button);

function send_data_to_server()
{
    var file_input_element = utils.objects.by_id('file_input');
    var form_data = new FormData();

    form_data.append('test_file', file_input_element.files[0]);

    var ajax_config = {
                            "type"                  :   "data",
                            "url"                   :   "/framework/mvc/views/assets/php/ajax_test.php",
                            "data"                  :   form_data,
                            "element_id"            :   "test_results",
                            "content_fill_mode"     :   "replace"
                      };

    classic_ajax.run(ajax_config);
}

function send_email()
{
    var data = 'gate=send_email&send=1&email=test@testdomain.com';

    ajax_factory(data, function(response)
                       {
                            utils.objects.by_id('test_results').innerHTML = response;

                            console.log('[Woody]')
                            console.log('OK');
                            console.log('');
                       },
                       function()
                       {
                            // Nothing to do...
                       },
                       function()
                       {
                            // Nothing to do...
                       });
}

// *** Either use this function when logged-in to avoid session hijacking or utilize Anti-Hijack extension straight from PHP ***
function hijack_protection()
{
    var data = 'gate=hijack_protection';

    ajax_factory(data, function(response)
                       {
                            console.log('[Anti-Hijack]')
                            console.log(response);
                            console.log('');
                       },
                       function()
                       {
                            location.assign('/');
                       },
                       function()
                       {
                           // Nothing to do...
                       });
}

function blur_screen(mode)
{
    var main_body = utils.objects.by_id('test');

    if (mode === 'show')
        main_body.style.filter = 'blur(8px)';
    else
        main_body.style.filter = 'none';
}
