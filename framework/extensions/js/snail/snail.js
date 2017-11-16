/*

    Snail (CPU speed benchmark utility)

    File name: snail.js (Version: 1.2)
    Description: This file contains the Snail - CPU speed benchmark utility extension.

    Coded by George Delaportas (G0D)
    Copyright (c) 2014 - 2017
    Open Software License (OSL 3.0)

*/

// Snail
function snail()
{
    this.run = function(loops)
    {
        performance.benchmark.start();

        while (loops >= 0)
            loops--;

        performance.benchmark.end();

        benchmark_index = performance.benchmark.latency();

        return true;
    };

    this.index = function()
    {
        if (benchmark_index === -1)
            return false;

        return benchmark_index;
    };

    var performance = new centurion(),
        benchmark_index = -1;
}
