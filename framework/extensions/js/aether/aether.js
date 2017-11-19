/*

    Aether (AJAX Traffic Controller [TC] / QoS for web apps)

    File name: aether.js (Version: 2.0)
    Description: This file contains the Aether - TC & QoS extension.

    Coded by George Delaportas (G0D) 
    Copyright (C) 2014
    Open Software License (OSL 3.0)

*/

// Aether
function aether()
{
    function sys_models_class()
    {
        function settings_model()
        {
            this.chain_mode = null;
            this.init_delay = -1;
            this.interval = -1;
            this.final_callback = null;
        }

        function task_model()
        {
            this.id = null;
            this.type = null;
            this.url = null;
            this.data = null;
            this.response_timeout = -1;
            this.callbacks = null;
            this.ajax_mode = null;
            this.element_id = null;
            this.content_mode = null;
            this.priority = 999999;
            this.latency = null;
            this.bandwidth = null;
            this.repeat = null;
            this.delay = -1;
        }

        function tasks_list_model()
        {
            this.num = 0;
            this.list = [];
        }

        this.generate_task = function()
        {
            return new task_model();
        };

        this.settings = new settings_model();
        this.tasks = new tasks_list_model();
    }

    function sys_tools_class()
    {
        this.load_settings = function(settings_config)
        {
            if (system_modes.chain.indexOf(settings_config.chain_mode) === -1)
                return false;

            system_models.settings.chain_mode = settings_config.chain_mode;

            if (settings_config.hasOwnProperty('init_delay'))
                system_models.settings.init_delay = settings_config.init_delay;

            if (settings_config.hasOwnProperty('interval'))
                system_models.settings.interval = settings_config.interval;

            if (settings_config.hasOwnProperty('final_callback'))
                system_models.settings.final_callback = settings_config.final_callback;

            return true;
        };

        this.load_tasks = function(tasks_config)
        {
            var __index = 0;

            for (__index = 0; __index < tasks_config.length; __index++)
            {
                if (system_modes.bull.indexOf(tasks_config[__index].type) === -1)
                {
                    system_tools.reset();

                    return false;
                }

                var new_task = system_models.generate_task();

                new_task.id = prng.generate();
                new_task.type = tasks_config[__index].type;
                new_task.url = tasks_config[__index].url;
                new_task.data = tasks_config[__index].data;
                new_task.response_timeout = tasks_config[__index].response_timeout;
                new_task.callbacks = tasks_config[__index].callbacks;

                if (tasks_config[__index].hasOwnProperty('ajax_mode'))
                {
                    if (system_modes.ajax.indexOf(tasks_config[__index].ajax_mode) === -1)
                    {
                        system_tools.reset();
    
                        return false;
                    }

                    new_task.ajax_mode = tasks_config[__index].ajax_mode;
                }

                if (tasks_config[__index].hasOwnProperty('element_id'))
                    new_task.element_id = tasks_config[__index].element_id;

                if (tasks_config[__index].hasOwnProperty('content_mode'))
                {
                    if (system_modes.content.indexOf(tasks_config[__index].content_mode) === -1)
                    {
                        system_tools.reset();
    
                        return false;
                    }

                    new_task.content_mode = tasks_config[__index].content_mode;
                }

                if (tasks_config[__index].hasOwnProperty('priority'))
                {
                    if (tasks_config[__index].priority < 1 || tasks_config[__index].priority > 999999)
                    {
                        system_tools.reset();
    
                        return false;
                    }

                    new_task.priority = tasks_config[__index].priority;
                }

                if (tasks_config[__index].hasOwnProperty('latency'))
                {
                    if (tasks_config[__index].latency.length < 1 || tasks_config[__index].latency.length > 2)
                    {
                        system_tools.reset();
    
                        return false;
                    }

                    new_task.latency = tasks_config[__index].latency;
                }

                if (tasks_config[__index].hasOwnProperty('bandwidth'))
                {
                    if (tasks_config[__index].bandwidth.length < 1 || tasks_config[__index].bandwidth.length > 2)
                    {
                        system_tools.reset();
    
                        return false;
                    }

                    new_task.bandwidth = tasks_config[__index].bandwidth;
                }

                if (tasks_config[__index].hasOwnProperty('repeat'))
                {
                    if (tasks_config[__index].repeat < -1 || tasks_config[__index].repeat > 1000000)
                    {
                        system_tools.reset();
    
                        return false;
                    }

                    new_task.delay = tasks_config[__index].delay;
                }

                if (tasks_config[__index].hasOwnProperty('delay'))
                {
                    if (tasks_config[__index].delay < 1 || tasks_config[__index].delay > 86400000)
                    {
                        system_tools.reset();
    
                        return false;
                    }

                    new_task.delay = tasks_config[__index].delay;
                }

                system_models.tasks.list.push(new_task);
                system_models.tasks.num++;
            }

            return true;
        };

        this.verify_config = function(main_config)
        {
            var __index = 0;

            if (!config_parser.define(__config_models['main']) || !config_parser.validate(main_config))
                return false;

            if (!config_parser.define(__config_models['settings']) || !config_parser.validate(main_config.settings))
                return false;

            if (!config_parser.define(__config_models['tasks']) || !config_parser.validate(main_config.tasks))
                return false;

            if (!config_parser.define(__config_models['callbacks']))
                return false;

            for (__index = 0; __index < main_config.tasks.length; __index++)
            {
                if (!config_parser.validate(main_config.tasks[__index].callbacks))
                    return false;
            }

            //if (!config_parser.define(__config_models['latency']) || main_config.tasks.length < 1)
            //    return false;

            return true;
        };
    
        this.run_tasks = function()
        {
            

            return true;
        };
    
        this.init_config_models = function()
        {
            __config_models['main'] = { arguments :   [
                                                        {
                                                            key     :   { name : 'settings', optional : false },
                                                            value   :   { type : 'object' }
                                                        },
                                                        {
                                                            key     :   { name : 'tasks', optional : false },
                                                            value   :   { type : 'array' }
                                                        }
                                                    ]
                                    };

            __config_models['settings'] = { arguments :   [
                                                            {
                                                                key     :   { name : 'chain_mode', optional : false },
                                                                value   :   { type : 'string' }
                                                            },
                                                            {
                                                                key     :   { name : 'init_delay', optional : true },
                                                                value   :   { type : 'number' }
                                                            },
                                                            {
                                                                key     :   { name : 'interval', optional : true },
                                                                value   :   { type : 'number' }
                                                            },
                                                            {
                                                                key     :   { name : 'optional_task_callbacks', optional : true },
                                                                value   :   { type : 'boolean' }
                                                            },
                                                            {
                                                                key     :   { name : 'final_callback', optional : true },
                                                                value   :   { type : 'function' }
                                                            }
                                                        ]
                                        };

            __config_models['tasks'] = { arguments :  [
                                                        {
                                                            key     :   { name : 'type', optional : false },
                                                            value   :   { type : 'string' }
                                                        },
                                                        {
                                                            key     :   { name : 'url', optional : false },
                                                            value   :   { type : 'string' }
                                                        },
                                                        {
                                                            key     :   { name : 'data', optional : false },
                                                            value   :   { type : 'string' }
                                                        },
                                                        {
                                                            key     :   { name : 'response_timeout', optional : false },
                                                            value   :   { type : 'number' }
                                                        },
                                                        {
                                                            key     :   { name : 'callbacks', optional : false },
                                                            value   :   { type : 'object' }
                                                        },
                                                        {
                                                            key     :   { name : 'ajax_mode', optional : true },
                                                            value   :   { type : 'string' }
                                                        },
                                                        {
                                                            key     :   { name : 'element_id', optional : true },
                                                            value   :   { type : 'string' }
                                                        },
                                                        {
                                                            key     :   { name : 'content_mode', optional : true },
                                                            value   :   { type : 'string' }
                                                        },
                                                        {
                                                            key     :   { name : 'priority', optional : true },
                                                            value   :   { type : 'number' }
                                                        },
                                                        {
                                                            key     :   { name : 'latency', optional : true },
                                                            value   :   { type : 'object' }
                                                        },
                                                        {
                                                            key     :   { name : 'bandwidth', optional : true },
                                                            value   :   { type : 'object' }
                                                        },
                                                        {
                                                            key     :   { name : 'repeat', optional : true },
                                                            value   :   { type : 'object' }
                                                        },
                                                        {
                                                            key     :   { name : 'delay', optional : true },
                                                            value   :   { type : 'number' }
                                                        }
                                                    ]
                                     };

            __config_models['callbacks'] = { arguments :  [
                                                            {
                                                                key     :   { name : 'success', optional : false },
                                                                value   :   { type : 'function' }
                                                            },
                                                            {
                                                                key     :   { name : 'fail', optional : true },
                                                                value   :   { type : 'function' }
                                                            },
                                                            {
                                                                key     :   { name : 'timeout', optional : true },
                                                                value   :   { type : 'function' }
                                                            }
                                                        ]
                                         };

            __config_models['latency'] = { arguments :  [
                                                            {
                                                                key     :   { name : 'min', optional : false },
                                                                value   :   { type : 'number' }
                                                            },
                                                            {
                                                                key     :   { name : 'max', optional : false },
                                                                value   :   { type : 'number' }
                                                            }
                                                      ]
                                       };

            __config_models['bandwidth'] = { arguments :  [
                                                            {
                                                                key     :   { name : 'min', optional : false },
                                                                value   :   { type : 'number' }
                                                            },
                                                            {
                                                                key     :   { name : 'max', optional : false },
                                                                value   :   { type : 'number' }
                                                            }
                                                        ]
                                         };

            __config_models['repeat'] = { arguments :  [
                                                            {
                                                                key     :   { name : 'times', optional : false },
                                                                value   :   { type : 'number' }
                                                            },
                                                            {
                                                                key     :   { name : 'mode', optional : false },
                                                                value   :   { type : 'string' }
                                                            }
                                                      ]
                                      };
        };

        this.reset = function()
        {
            __is_init = false;
            __config_models = [];
            system_models = new sys_models_class();
        };
    }

    function sys_modes_class()
    {
        this.chain = ['serial', 'parallel', 'delay', 'callback'];
        this.bull = ['data', 'request'];
        this.ajax = ['asynchronous', 'synchronous'];
        this.content = ['replace', 'append'];
        this.repeat = ['serial', 'parallel'];
    }

    function init()
    {
        system_tools.init_config_models();
    }

    this.schedule = function(json_config)
    {
        if (__is_init === true)
            return false;

        if (!system_tools.verify_config(json_config))
            return false;

        if (!system_tools.load_settings(json_config.settings))
            return false;

        if (!system_tools.load_tasks(json_config.tasks))
            return false;

        if (!system_tools.run_tasks())
            return false;

        __is_init = true;

        return true;
    };

    this.cancel = function()
    {
        if (__is_init === false)
            return false;

        

        __is_init = false;

        return true;
    };

    this.status = function()
    {
        if (__is_init === false)
            return false;

        return system_models.tasks;
    };

    var __is_init = false,
        __config_models = [],
        system_models = new sys_models_class(),
        system_tools = new sys_tools_class(),
        system_modes = new sys_modes_class(),
        prng = new pythia(),
        multi_proc = new parallel(),
        performance = new centurion(),
        timer = new stopwatch(),
        ajax = new bull(),
        utils = new vulcan(),
        config_parser = new jap();

    // Initialize
    init();
}
