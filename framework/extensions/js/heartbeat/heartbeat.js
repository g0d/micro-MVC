/*

    Heartbeat

    File name: heartbeat.js (Version: 0.3)
    Description: This file contains the Heartbeat extension (Ping services).

    Coded by George Delaportas (G0D)
    Copyright (C) 2017
    Open Software License (OSL 3.0)

*/

// Heartbeat
function heartbeat(interval, url, service_name, success_callback, fail_callback, time_out_callback)
{
    var utils = new vulcan(),
        timer = new stopwatch(),
        ajax = new bull();

    if (!utils.validation.numerics.is_integer(interval) || interval < 1 || 
        utils.validation.misc.is_invalid(url) || !utils.validation.alpha.is_string(url) || 
        utils.validation.misc.is_invalid(service_name) || !utils.validation.alpha.is_string(service_name) || 
        !utils.validation.misc.is_function(success_callback) || 
        !utils.validation.misc.is_function(fail_callback) || 
        !utils.validation.misc.is_function(time_out_callback))
        return false;

    function message(service, status, callback)
    {
        console.log('----- Heartbeat -----');
        console.log(service + ': <' + status + '>');
        console.log('-------- *** --------');
        console.log('');

        callback.call(this);
    }

    timer.start(interval, function()
                {
                    ajax.request(url, '1', 1, 
                    function()
                    {
                        message(service_name, 'SUCCESS', success_callback);
                    }, 
                    function()
                    {
                        message(service_name, 'FAIL', fail_callback);
                    },
                    5000,
                    function()
                    {
                        message(service_name, 'TIME OUT', time_out_callback);
                    });
                });

    return true;
}
