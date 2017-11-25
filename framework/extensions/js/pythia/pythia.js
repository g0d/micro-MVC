/*

    Pythia (Fast pseudo random number generator / shuffler)

    File name: pythia.js (Version: 0.5)
    Description: This file contains the Pythia - Pseudo random / shuffling number generator.

    Coded by George Delaportas (G0D) 
    Copyright (C) 2014
    Open Software License (OSL 3.0)

*/

// Pythia
function pythia()
{
    function loop(rnd_num)
    {
        var __results_length = __results.length,
            __index = 0;

        if (__results_length === 0 || rnd_num >= __results[__results_length - 1])
        {
            if (rnd_num === __max_random_num)
                return rnd_num;
            else
            {
                if (rnd_num === __results[__results_length - 1])
                    rnd_num++;

                __results.push(rnd_num);

                return rnd_num;
            }
        }

        for (__index = 0; __index < __results_length; __index++)
        {
            if (rnd_num === __results[__index])
                rnd_num++;
            else
            {
                if (rnd_num < __results[__index])
                {
                    __results.splice(__index, 0, rnd_num);

                    break;
                }
            }
        }

        return rnd_num;
    }

    this.generate = function()
    {
        var __this_rnd_num = Math.floor((Math.random() * __max_random_num) + 1);

        return loop(__this_rnd_num);
    };

    this.reset = function()
    {
        __results = [];

        return;
    };

    var __max_random_num = Number.MAX_SAFE_INTEGER,
        __results = [];
}
