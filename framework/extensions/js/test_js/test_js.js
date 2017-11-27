/*

    Test JS

    File name: test_js.js
    Description: This file contains the test js code for the test view.

    Coded by George Delaportas (G0D) 
    Copyright (C) 2017
    Open Software License (OSL 3.0)

*/

ultron(function(event)
{
    var dom = new vulcan();
    var ajax = new bull();
    var prng = new pythia();
    var timer = new stopwatch();
    var my_aether = new aether();
    var my_bdb = new browser_db();
    var my_centurion = new centurion();
    var my_snail = new snail();
    var multi_proc = new parallel();
    var my_lava = new lava();
    var my_jap = new jap();
    var aether_config = {
                            settings    :   {
                                                chain_mode                  :   'parallel',             // CHOICES: ['parallel', 'delay', 'callback' (Proceed on 'success' callback)]
                                                init_delay                  :   3000,                   // OPTIONAL (Delay initialization of scheduler by so many milliseconds)
                                                interval                    :   10000,                  // OPTIONAL (Repeat scheduled tasks every so many milliseconds)
                                                optional_task_callbacks     :   true,                   // OPTIONAL (Allow optional task callbacks: 'fail' and 'timeout' - DEFAULT: true)
                                                scheduler_callback          :   function() {  }         // OPTIONAL (Function to execute after scheduler runs all tasks)
                                            },
                            tasks       :   [
                                                {
                                                    type                :   'data',
                                                    element_id          :   'test_id',                                  // OPTIONAL (Use only with 'data' type / Any valid HTML element ID)
                                                    content_mode        :   'replace',                                  // OPTIONAL (Use only with 'data' type / Modes: 'replace' or 'append')
                                                    url                 :   '/',
                                                    data                :   '',
                                                    response_timeout    :   2500,                                       // RESPONSE TIMEOUT: Waiting time of response until timeout in milliseconds
                                                    callbacks           :   {
                                                                                success     :   function() { console.log('2nd task'); },
                                                                                fail        :   function() {  },        // OPTIONAL (By design unless enforced by 'optional_task_callbacks')
                                                                                timeout     :   function() {  }         // OPTIONAL (By design unless enforced by 'optional_task_callbacks')
                                                                            },
                                                    priority            :   3,                                          // OPTIONAL (Relative priority to other tasks / If not set, priority is the lowest)
                                                    latency             :   { min : 16, max : 150 },                    // OPTIONAL (Guarantee latency in ms / To ignore set min or max to -1)
                                                    bandwidth           :   { min : 2000, max : 4000 },                 // OPTIONAL (Guarantee bandwidth in Kbps / To ignore set min or max to -1)
                                                    repeat              :   { times : 3, mode : 'serial' },             // OPTIONAL (Repeat task so many times - DEFAULT: 0 / FOREVER: -1 | Modes: 'serial' or 'parallel')
                                                    delay               :   2000                                        // OPTIONAL (Delayed start in milliseconds)
                                                },
                                                {
                                                    latency             :   { min : -1, max : 50 },
                                                    bandwidth           :   { min : 10, max : -1 },
                                                    delay               :   1340,
                                                    type                :   'data',
                                                    element_id          :   'test_id',
                                                    content_mode        :   'append',
                                                    url                 :   '/',
                                                    data                :   '',
                                                    response_timeout    :   2500,
                                                    callbacks           :   {
                                                                                success     :   function() { console.log('n-th task'); },
                                                                                //fail        :   function() {  },
                                                                                timeout     :   function() {  }
                                                                            }
                                                },
                                                {
                                                    priority            :   4,
                                                    latency             :   { min : 100, max : -1 },
                                                    bandwidth           :   { min : 300, max : 550 },
                                                    //delay               :   400,
                                                    type                :   'request',
                                                    ajax_mode           :   'synchronous',                              // OPTIONAL (Use only with 'request' type / Modes: 'synchronous' or 'asynchronous')
                                                    url                 :   '/test',
                                                    data                :   '',
                                                    response_timeout    :   3000,
                                                    callbacks           :   {
                                                                                success     :   function() { console.log('3rd task'); },
                                                                                fail        :   function() {  },
                                                                                //timeout     :   function() {  }
                                                                            }
                                                },
                                                {
                                                    priority            :   2,
                                                    latency             :   { min : 20, max : 120 },
                                                    repeat              :   { times : -1, mode : 'parallel' },
                                                    type                :   'request',
                                                    ajax_mode           :   'asynchronous',
                                                    url                 :   '/test',
                                                    data                :   '',
                                                    response_timeout    :   1000,
                                                    callbacks           :   {
                                                                                success     :   function() { console.log('1st task'); },
                                                                                //fail        :   function() {  },
                                                                                //timeout     :   function() {  }
                                                                            }
                                                }
                                            ]
                        };

    console.log(my_aether.schedule(aether_config)); // Schedule and run AJAX tasks
    //console.log(my_aether.constants());
    console.log(my_aether.status()); // All AJAX tasks
    //console.log(my_aether.status(task_list[3])); // Only a specified AJAX task
    //console.log(my_aether.cancel()); // All tasks
    //console.log(my_aether.cancel(task_list[1])); // Only a specified AJAX task
});
