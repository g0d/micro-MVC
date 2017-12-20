/*

    Heartbeat

    File name: heartbeat.js (Version: 0.5)
    Description: This file contains the Heartbeat extension (Ping services).

    Coded by George Delaportas (G0D)
    Copyright (C) 2017
    Open Software License (OSL 3.0)

*/

// Heartbeat
function heartbeat(interval, url, service_name, response_timeout, success_callback, fail_callback, timeout_callback)
{
    var utils = new vulcan(),
        timer = new stopwatch(),
        ajax = new bull(),
        ajax_config = {
                            "type"                  :   "request",
                            "data"                  :   "1",
                            "ajax_mode"             :   "asynchronous"
                      };

    if (!utils.validation.numerics.is_integer(interval) || interval < 1 || 
        utils.validation.misc.is_invalid(url) || !utils.validation.alpha.is_string(url) || 
        utils.validation.misc.is_invalid(service_name) || !utils.validation.alpha.is_string(service_name) || 
        !utils.validation.numerics.is_integer(response_timeout) || response_timeout < 1 || 
        !utils.validation.misc.is_function(success_callback) || 
        !utils.validation.misc.is_function(fail_callback) || 
        !utils.validation.misc.is_function(timeout_callback))
        return false;

    function message(service, status, callback)
    {
        console.log('----- Heartbeat -----');
        console.log(service + ': <' + status + '>');
        console.log('-------- *** --------');
        console.log('');

        callback.call(this);
    }

    ajax_config.url = url;
    ajax_config.on_success = function() { message(service_name, 'SUCCESS', success_callback); };
    ajax_config.on_fail = function() { message(service_name, 'FAIL', fail_callback); };
    ajax_config.on_timeout = function() { message(service_name, 'TIMEOUT', timeout_callback); };
    ajax_config.response_timeout = response_timeout;

    timer.start(interval, function() { ajax.run(ajax_config); });

    return true;
}
