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
    function sys_constants_class()
    {
        function settings_group()
        {
            function chain_mode_model()
            {
                this.SERIAL = 'serial';
                this.PARALLEL = 'parallel';
                this.DELAY = 'delay';
                this.CALLBACK = 'callback';
            }

            this.chain_mode = new chain_mode_model();
        }

        function tasks_group()
        {
            function type_model()
            {
                this.DATA = 'data';
                this.REQUEST = 'request';
            }

            function ajax_mode_model()
            {
                this.ASYNCHRONOUS = 'asynchronous';
                this.SYNCHRONOUS = 'synchronous';
            }

            function content_mode_model()
            {
                this.REPLACE = 'replace';
                this.APPEND = 'append';
            }

            function repeat_model()
            {
                this.SERIAL = 'serial';
                this.PARALLEL = 'parallel';
            }

            this.type = new type_model();
            this.ajax_mode = new ajax_mode_model();
            this.content_mode = new content_mode_model();
            this.repeat = new repeat_model();
        }

        function misc_group()
        {
            this.IGNORE = -1;
            this.MAX_PRIORITY = 999999;
            this.MAX_LATENCY = 1000;
            this.MAX_BANDWIDTH = 10737418240;
            this.MAX_DELAY = 86400000;
        }

        this.settings = new settings_group();
        this.tasks = new tasks_group();
        this.misc = new misc_group();
    }

    function sys_models_class()
    {
        function settings_model()
        {
            this.chain_mode = null;
            this.init_delay = -1;
            this.interval = -1;
            this.optional_task_callbacks = true;
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

    function config_keywords_class()
    {
        function main_group()
        {
            return ['settings', 'tasks'];
        }

        function settings_group()
        {
            return ['chain_mode', 'init_delay', 'interval', 'optional_task_callbacks', 'final_callback'];
        }

        function tasks_group()
        {
            return ['type', 'url', 'data', 'response_timeout', 'callbacks', 'ajax_mode', 'element_id', 'content_mode', 
                    'priority', 'latency', 'bandwidth', 'repeat', 'delay'];
        }

        function callbacks_group()
        {
            return ['success', 'fail', 'timeout'];
        }

        function qos_group()
        {
            return ['min', 'max'];
        }

        function repeat_group()
        {
            return ['times', 'mode'];
        }

        this.main = new main_group();
        this.settings = new settings_group();
        this.tasks = new tasks_group();
        this.callbacks = new callbacks_group();
        this.qos = new qos_group();
        this.repeat = new repeat_group();
    }

    function sys_tools_class()
    {
        var __index = 0,
            __entry = null,
            __modes = null;

        function utilities_class()
        {
            function factory_model()
            {
                this.config_objects_verification = function(main_config)
                {
                    
                };

                this.config_settings_loader = function(settings_config)
                {
                    
                };

                this.qos_validator = function(record, entry, check)
                {
                    if (record !== system_constants.misc.IGNORE && 
                        (entry === 'min' && record < 1) || 
                        (entry === 'max' && record > system_constants.misc[check]))
                    {
                        system_tools.reset();
    
                        return false;
                    }

                    return true;
                };
            }

            this.factory = new factory_model();
        }

        this.init_config_models = function()
        {
            __config_models['main'] = { arguments : [
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

            __config_models['settings'] = { arguments : [
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

            __config_models['tasks'] = { arguments  :   [
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

        this.verify_config_objects = function(main_config)
        {
            //system_tools.utilities.factory.config_objects_verification(main_config);

            var __callbacks_found = 0;

            if (!config_parser.verify(__config_models['main'], main_config))
                return false;

            for (__entry in main_config)
            {
                if (system_config_keywords.main.indexOf(__entry) === -1)
                    return false;
            }

            if (!config_parser.verify(__config_models['settings'], main_config.settings))
                return false;

            for (__entry in main_config.settings)
            {
                if (system_config_keywords.settings.indexOf(__entry) === -1)
                    return false;
            }

            if (!config_parser.verify(__config_models['tasks'], main_config.tasks))
                return false;

            for (__index = 0; __index < main_config.tasks.length; __index++)
            {
                for (__entry in main_config.tasks[__index])
                {
                    if (system_config_keywords.tasks.indexOf(__entry) === -1)
                        return false;
                }
            }

            for (__index = 0; __index < main_config.tasks.length; __index++)
            {
                __callbacks_found = 0;

                if (!config_parser.verify(__config_models['callbacks'], main_config.tasks[__index].callbacks))
                    return false;

                for (__entry in main_config.tasks[__index].callbacks)
                {
                    if (system_config_keywords.callbacks.indexOf(__entry) === -1)
                        return false;

                    __callbacks_found++;
                }

                if (!main_config.settings.optional_task_callbacks && __callbacks_found < system_config_keywords.callbacks.length)
                    return false;

                if (main_config.tasks[__index].hasOwnProperty('latency') && 
                    !config_parser.verify(__config_models['latency'], main_config.tasks[__index].latency))
                    return false;

                if (main_config.tasks[__index].hasOwnProperty('bandwidth') && 
                    !config_parser.verify(__config_models['bandwidth'], main_config.tasks[__index].bandwidth))
                    return false;

                if (main_config.tasks[__index].hasOwnProperty('repeat') && 
                    !config_parser.verify(__config_models['repeat'], main_config.tasks[__index].repeat))
                    return false;
            }

            return true;
        };

        this.load_settings = function(settings_config)
        {
            //system_tools.utilities.factory.config_settings_loader(settings_config);

            __modes = utils.conversions.object_to_array(false, system_constants.settings.chain_mode);

            if (__modes.indexOf(settings_config.chain_mode) === -1)
                return false;

            system_models.settings.chain_mode = settings_config.chain_mode;

            if (settings_config.hasOwnProperty('init_delay'))
                system_models.settings.init_delay = settings_config.init_delay;

            if (settings_config.hasOwnProperty('interval'))
                system_models.settings.interval = settings_config.interval;

            if (settings_config.hasOwnProperty('optional_task_callbacks'))
                system_models.settings.optional_task_callbacks = settings_config.optional_task_callbacks;

            if (settings_config.hasOwnProperty('final_callback'))
                system_models.settings.final_callback = settings_config.final_callback;

            return true;
        };

        this.load_tasks = function(tasks_config)
        {
            var __this_task = null;

            for (__index = 0; __index < tasks_config.length; __index++)
            {
                __this_task = tasks_config[__index];
                __modes = utils.conversions.object_to_array(false, system_constants.tasks.type);

                if (__modes.indexOf(__this_task.type) === -1)
                {
                    system_tools.reset();

                    return false;
                }

                var new_task = system_models.generate_task();

                new_task.id = prng.generate();
                new_task.type = __this_task.type;
                new_task.url = __this_task.url;
                new_task.data = __this_task.data;
                new_task.response_timeout = __this_task.response_timeout;
                new_task.callbacks = __this_task.callbacks;

                if (__this_task.hasOwnProperty('ajax_mode'))
                {
                    __modes = utils.conversions.object_to_array(false, system_constants.tasks.ajax_mode);

                    if (__modes.indexOf(__this_task.ajax_mode) === -1)
                    {
                        system_tools.reset();
    
                        return false;
                    }

                    new_task.ajax_mode = __this_task.ajax_mode;
                }

                if (__this_task.hasOwnProperty('element_id'))
                    new_task.element_id = __this_task.element_id;

                if (__this_task.hasOwnProperty('content_mode'))
                {
                    __modes = utils.conversions.object_to_array(false, system_constants.tasks.content_mode);

                    if (__modes.indexOf(__this_task.content_mode) === -1)
                    {
                        system_tools.reset();
    
                        return false;
                    }

                    new_task.content_mode = __this_task.content_mode;
                }

                if (__this_task.hasOwnProperty('priority'))
                {
                    if (__this_task.priority < 1 || __this_task.priority > system_constants.misc.MAX_PRIORITY)
                    {
                        system_tools.reset();
    
                        return false;
                    }

                    new_task.priority = __this_task.priority;
                }

                if (__this_task.hasOwnProperty('latency'))
                {
                    for (__entry in __this_task.latency)
                    {
                        if (!system_tools.utilities.factory.qos_validator(__this_task.latency[__entry], __entry, 'MAX_LATENCY'))
                            return false;
                    }

                    new_task.latency = __this_task.latency;
                }

                if (__this_task.hasOwnProperty('bandwidth'))
                {
                    for (__entry in __this_task.bandwidth)
                    {
                        if (!system_tools.utilities.factory.qos_validator(__this_task.bandwidth[__entry], __entry, 'MAX_BANDWIDTH'))
                            return false;
                    }

                    new_task.bandwidth = __this_task.bandwidth;
                }

                if (__this_task.hasOwnProperty('repeat'))
                {
                    __modes = utils.conversions.object_to_array(false, system_constants.tasks.repeat);

                    for (__entry in __this_task.repeat)
                    {
                        if (__this_task.repeat[__entry] !== system_constants.misc.IGNORE && 
                            (__entry === 'times' && __this_task.repeat[__entry] < 0) || 
                            (__entry === 'mode' && __modes.indexOf(__this_task.repeat[__entry]) === -1))
                        {
                            system_tools.reset();
        
                            return false;
                        }
                    }

                    new_task.repeat = __this_task.repeat;
                }

                if (__this_task.hasOwnProperty('delay'))
                {
                    if (__this_task.delay < 1 || __this_task.delay > system_constants.misc.MAX_DELAY)
                    {
                        system_tools.reset();
    
                        return false;
                    }

                    new_task.delay = __this_task.delay;
                }

                system_models.tasks.num++;
                system_models.tasks.list.push(new_task);
            }

            return true;
        };

        this.run = function()
        {
            var __index = 0,
                __task_a = null,
                __task_b = null;

            for (__index = 0; __index < system_models.tasks.num - 1; __index++)
            {
                task_a = system_models.tasks.list[__index];
                task_b = system_models.tasks.list[__index + 1];

                utils.misc.sort(system_models.tasks.list, 'asc', 'priority');
            }

            ajax.request();

            if (system_models.settings.chain_mode === 'serial')
            {

            }

            return true;
        };

        this.reset = function()
        {
            __is_init = false;
            __config_models = [];
            system_models = new sys_models_class();
        };

        this.utilities = new utilities_class();
    }

    function init()
    {
        system_tools.init_config_models();
    }

    this.schedule = function(json_config)
    {
        if (__is_init === true || 
            !system_tools.verify_config_objects(json_config) || 
            !system_tools.load_settings(json_config.settings) || 
            !system_tools.load_tasks(json_config.tasks) || 
            !system_tools.run())
            return false;

        __is_init = true;
        __config_models = [];

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

    this.constants = function()
    {
        return system_constants;
    };

    var __is_init = false,
        __config_models = [],
        system_constants = new sys_constants_class(),
        system_models = new sys_models_class(),
        system_config_keywords = new config_keywords_class(),
        system_tools = new sys_tools_class(),
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
