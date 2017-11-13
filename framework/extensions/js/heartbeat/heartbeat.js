/*

    Heartbeat
    
    File name: heartbeat.js (Version: 0.1)
    Description: This file contains the Heartbeat extension (Ping services).
    
    Coded by George Delaportas (G0D)
    Copyright (C) 2017
    Open Software License (OSL 3.0)

*/

// Heartbeat
function heartbeat(interval, time_out_callback, fail_callback)
{
    var my_vulcan = new vulcan();
    var my_bull = new bull();
    var is_service_up = true;

    if (!my_vulcan.validation.numerics.is_integer(interval) || interval < 1 || 
        !my_vulcan.validation.misc.is_function(time_out_callback) || 
        !my_vulcan.validation.misc.is_function(fail_callback))
        return false;

    function message(service, status, callback)
    {
        console.log('----- Heartbeat -----');
        console.log(service + ': <' + status + '>');
        console.log('-------- *** --------');
        console.log('');

        if (my_vulcan.validation.misc.is_function(callback))
            callback.call(this, service);
    }

    setInterval(function()
                {
                    my_bull.request('yourdomain.com', '1', 1, 
                    function()
                    {
                        message('Your message here...', 'SUCCESS');
                    }, 5000, 
                    function()
                    {
                        message('Your message here...', 'TIME OUT', time_out_callback);
                    },
                    function()
                    {
                        message('Your message here...', 'FAIL', fail_callback);
                    });
                }, interval);

    return true;
}
