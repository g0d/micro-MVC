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
    function models_group()
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
            this.latency = [];
            this.bandwidth = [];
            this.repeat = 0;
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

    function tools_group()
    {
        this.load_settings = function(settings_config)
        {
            if (chain_modes.indexOf(settings_config.chain_mode) === -1)
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
            var index;

            for (index = 0; index < tasks_config.length; index++)
            {
                if (ajax_types.indexOf(tasks_config[index].type) === -1)
                {
                    system_tools.reset();

                    return false;
                }

                var new_task = system_models.generate_task();

                new_task.id = prng.generate();
                new_task.type = tasks_config[index].type;
                new_task.url = tasks_config[index].url;
                new_task.data = tasks_config[index].data;
                new_task.response_timeout = tasks_config[index].response_timeout;
                new_task.callbacks = tasks_config[index].callbacks;

                if (tasks_config[index].hasOwnProperty('ajax_mode'))
                {
                    if (ajax_modes.indexOf(tasks_config[index].ajax_mode) === -1)
                    {
                        system_tools.reset();
    
                        return false;
                    }

                    new_task.ajax_mode = tasks_config[index].ajax_mode;
                }

                if (tasks_config[index].hasOwnProperty('element_id'))
                    new_task.element_id = tasks_config[index].element_id;

                if (tasks_config[index].hasOwnProperty('content_mode'))
                {
                    if (content_modes.indexOf(tasks_config[index].content_mode) === -1)
                    {
                        system_tools.reset();
    
                        return false;
                    }

                    new_task.content_mode = tasks_config[index].content_mode;
                }

                if (tasks_config[index].hasOwnProperty('priority'))
                {
                    if (tasks_config[index].priority < 1 || tasks_config[index].priority > 999999)
                    {
                        system_tools.reset();
    
                        return false;
                    }

                    new_task.priority = tasks_config[index].priority;
                }

                if (tasks_config[index].hasOwnProperty('latency'))
                {
                    if (tasks_config[index].latency.length < 1 || tasks_config[index].latency.length > 2)
                    {
                        system_tools.reset();
    
                        return false;
                    }

                    new_task.latency = tasks_config[index].latency;
                }

                if (tasks_config[index].hasOwnProperty('bandwidth'))
                {
                    if (tasks_config[index].bandwidth.length < 1 || tasks_config[index].bandwidth.length > 2)
                    {
                        system_tools.reset();
    
                        return false;
                    }

                    new_task.bandwidth = tasks_config[index].bandwidth;
                }

                if (tasks_config[index].hasOwnProperty('repeat'))
                {
                    if (tasks_config[index].repeat < -1 || tasks_config[index].repeat > 100000)
                    {
                        system_tools.reset();
    
                        return false;
                    }

                    new_task.delay = tasks_config[index].delay;
                }

                if (tasks_config[index].hasOwnProperty('delay'))
                {
                    if (tasks_config[index].delay < 1 || tasks_config[index].delay > 86400000)
                    {
                        system_tools.reset();
    
                        return false;
                    }

                    new_task.delay = tasks_config[index].delay;
                }

                system_models.tasks.list.push(new_task);
                system_models.tasks.num++;
            }

            return true;
        };

        this.verify_config_model = function(main_config)
        {
            var index;

            if (!config_parser.define(config_models['main']) || !config_parser.validate(main_config))
                return false;

            if (!config_parser.define(config_models['settings']) || !config_parser.validate(main_config.settings))
                return false;

            if (!config_parser.define(config_models['tasks']) || !config_parser.validate(main_config.tasks))
                return false;

            if (!config_parser.define(config_models['callbacks']) || main_config.tasks.length < 1)
                return false;

            for (index = 0; index < main_config.tasks.length; index++)
            {
                if (!config_parser.validate(main_config.tasks[index].callbacks))
                    return false;
            }

            return true;
        };
    
        this.run_tasks = function()
        {
            

            return true;
        };
    
        this.init_config_models = function()
        {
            config_models['main'] = { arguments :   [
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

            config_models['settings'] = { arguments :   [
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
                                                                key     :   { name : 'final_callback', optional : true },
                                                                value   :   { type : 'function' }
                                                            }
                                                        ]
                                        };

            config_models['tasks'] = { arguments :  [
                                                        {
                                                            key     :   { name : 'type', optional : false },
                                                            value   :   { type : 'string' }
                                                        },
                                                        {
                                                            key     :   { name : 'element_id', optional : false },
                                                            value   :   { type : 'string' }
                                                        },
                                                        {
                                                            key     :   { name : 'content_mode', optional : false },
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
                                                            key     :   { name : 'priority', optional : true },
                                                            value   :   { type : 'number' }
                                                        },
                                                        {
                                                            key     :   { name : 'latency', optional : true },
                                                            value   :   { type : 'array' }
                                                        },
                                                        {
                                                            key     :   { name : 'bandwidth', optional : true },
                                                            value   :   { type : 'array' }
                                                        },
                                                        {
                                                            key     :   { name : 'repeat', optional : true },
                                                            value   :   { type : 'number' }
                                                        },
                                                        {
                                                            key     :   { name : 'delay', optional : true },
                                                            value   :   { type : 'number' }
                                                        }
                                                    ]
                                     };

            config_models['callbacks'] = { arguments :  [
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
        };

        this.reset = function()
        {
            is_init = false;
            config_models = [];
            system_models = new models_group();
        };
    }

    this.schedule = function(json_config)
    {
        if (is_init === true)
            return false;

        if (!system_tools.verify_config_model(json_config))
            return false;

        if (!system_tools.load_settings(json_config.settings))
            return false;

        if (!system_tools.load_tasks(json_config.tasks))
            return false;

        if (!system_tools.run_tasks())
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
        if (is_init === false)
            return false;

        return system_models.tasks;
    };

    var is_init = false,
        config_models = [],
        chain_modes = ['serial', 'parallel', 'delay', 'callback'],
        ajax_types = ['data', 'request'],
        ajax_modes = ['asynchronous', 'synchronous'],
        content_modes = ['replace', 'append'],
        system_models = new models_group(),
        system_tools = new tools_group(),
        prng = new pythia(),
        multi_proc = new parallel(),
        performance = new centurion(),
        timer = new stopwatch(),
        ajax = new bull(),
        utils = new vulcan(),
        config_parser = new jap();

	system_tools.init_config_models();
}
