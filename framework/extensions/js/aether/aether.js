/*

    Aether (AJAX Traffic Controller [ATC] / QoS for web apps)

    File name: aether.js (Version: 2.0)
    Description: This file contains the Aether - ATC/QoS extension.

    Coded by George Delaportas (G0D) 
    Copyright (C) 2014 - 2017
    Open Software License (OSL 3.0)

*/

// Aether
function aether()
{
    this.schedule = function(json_config)
    {
        if (is_init === true)
            return false;

        is_init = true;

        return true;
    };

    this.cancel = function()
    {
        if (is_init === false)
            return false;

        is_init = false;

        return true;
    };

    this.status = function()
    {
        return null;
    };

    var is_init = false,
        config_model = { arguments :   [
                                            {
                                                key     :   { name : '', optional : false },
                                                value   :   { type : 'string' }
                                            }
                                       ]
                       },
        prng = new pythia(),
        multi_proc = new parallel(),
        perfomrance = new centurion(),
        timer = new stopwatch(),
        ajax = new bull(),
        utils = new vulcan(),
        config_parser = new jap();
}
