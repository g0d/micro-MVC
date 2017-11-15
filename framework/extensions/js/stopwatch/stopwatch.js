/*

    Stopwatch (High precision timer for JS)

    File name: stopwatch.js (Version: 0.2)
    Description: This file contains the Stopwatch extension.

    Coded by George Delaportas (G0D)
    Copyright (C) 2017
    Open Software License (OSL 3.0)

*/

// Stopwatch (High precision timer)
function stopwatch()
{
    function instance(interval, callback)
    {
        if (!is_on)
            return;

        callback.call(this, this);

        delay += interval;
        diff = (new Date().getTime() - init_time) - delay;

        clearTimeout(timer_handler);

        timer_handler = setTimeout(function() { instance(interval, callback); }, (interval - diff));
    }

    this.start = function(interval, callback)
    {
        if (is_on)
            return false;

        if (!utils.validation.numerics.is_integer(interval) || interval < 1 || 
            !utils.validation.misc.is_function(callback))
        return false;

        timer_handler = setTimeout(function() { instance(interval, callback); }, interval);

        is_on = true;

        return true;
    };

    this.stop = function()
    {
        if (!is_on)
            return false;

        clearTimeout(timer_handler);

        is_on = false;

        return true;
    };

    var is_on = false,
        init_time = new Date().getTime(),
        delay = 0,
        diff = 0,
        timer_handler = null,
        utils = new vulcan();
}
