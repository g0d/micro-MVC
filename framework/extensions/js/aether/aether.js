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

            function content_fill_mode_model()
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
            this.content_fill_mode = new content_fill_mode_model();
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
            this.scheduler_callback = null;
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
            this.content_fill_mode = null;
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
            return ['chain_mode', 'init_delay', 'interval', 'optional_task_callbacks', 'scheduler_callback'];
        }

        function tasks_group()
        {
            return ['type', 'url', 'data', 'response_timeout', 'callbacks', 'ajax_mode', 'element_id', 'content_fill_mode', 
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
            __entry = null;

        function factory_model()
        {
            var __factory_map = [];

            this.config_verification = function(main_config)
            {
                __factory_map.push(['main', __config_definition_models['main'], main_config]);
                __factory_map.push(['settings', __config_definition_models['settings'], main_config.settings]);
                __factory_map.push(['tasks', __config_definition_models['tasks'], main_config.tasks]);

                for (__index = 0; __index < __factory_map.length; __index++)
                {
                    if (!config_parser.verify(__factory_map[__index][1], __factory_map[__index][2]))
                        return false;

                    if (__index === 2)
                    {
                        var __record = 0,
                            __option = 0,
                            __object_options = ['callbacks', 'latency', 'bandwidth', 'repeat'];

                        for (__record = 0; __record < __factory_map[__index][2].length; __record++)
                        {
                            for (__entry in __factory_map[__index][2][__record])
                            {
                                if (__object_options.indexOf(__entry) === -1)
                                {
                                    if (system_config_keywords[__factory_map[__index][0]].indexOf(__entry) === -1)
                                        return false;
                                }
                                else
                                {
                                    for (__option in __object_options)
                                    {
                                        if (utils.validation.misc.is_undefined(main_config.tasks[__record][__object_options[__option]]))
                                            continue;

                                        __factory_map.push([__object_options[__option], 
                                                            __config_definition_models[__object_options[__option]], 
                                                            main_config.tasks[__record][__object_options[__option]]]);

                                        if (!config_parser.verify(__factory_map[3][1], __factory_map[3][2]))
                                            return false;

                                        __factory_map.pop();
                                    }
                                }
                            }
                        }
                    }
                    else
                    {
                        for (__entry in __factory_map[__index][2])
                        {
                            if (system_config_keywords[__factory_map[__index][0]].indexOf(__entry) === -1)
                                return false;
                        }
                    }
                }

                __factory_map = [];

                return true;
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

            this.ajax_task_call = function(task)
            {
                var __this_task = task.args,
                    __task_repeat = task.repeat,
                    __task_latency = task.latency,
                    __task_bandwidth = task.bandwidth,
                    __index = 0,
                    __ajax = new bull();

                if (task.type === 'data')
                {
                    if (!utils.validation.misc.is_invalid(__task_repeat))
                    {
                        if (__task_repeat.mode === system_constants.tasks.repeat.SERIAL)
                        {
                            if (!utils.validation.misc.is_invalid(__task_latency))
                            {
                                
                            }

                            if (!utils.validation.misc.is_invalid(__task_bandwidth))
                            {
                                
                            }

                            //TODO: ....
                        }
                        else
                        {
                            if (!utils.validation.misc.is_invalid(__task_latency))
                            {
                                
                            }

                            if (!utils.validation.misc.is_invalid(__task_bandwidth))
                            {
                                
                            }

                            for (__index = 0; __index < __task_repeat.times; __index++)
                            {
                                
                            }
                        }
                    }

                    __ajax.data(__this_task.url, __this_task.data, __this_task.element_id, __this_task.content_fill_mode,
                                __this_task.success_callback, __this_task.fail_callback, 
                                __this_task.response_timeout, __this_task.timeout_callback);
                }
                else
                {
                    if (!utils.validation.misc.is_invalid(__task_repeat))
                    {
                        if (__task_repeat.mode === system_constants.tasks.repeat.SERIAL)
                        {
                            if (!utils.validation.misc.is_invalid(__task_latency))
                            {
                                
                            }

                            if (!utils.validation.misc.is_invalid(__task_bandwidth))
                            {
                                
                            }

                            //TODO: ....
                        }
                        else
                        {
                            if (!utils.validation.misc.is_invalid(__task_latency))
                            {
                                
                            }

                            if (!utils.validation.misc.is_invalid(__task_bandwidth))
                            {
                                
                            }

                            for (__index = 0; __index < __task_repeat.times; __index++)
                            {
                                
                            }
                        }
                    }

                    __ajax.request(__this_task.url, __this_task.data, __this_task.ajax_mode,
                                   __this_task.success_callback, __this_task.fail_callback, 
                                   __this_task.response_timeout, __this_task.timeout_callback);
                }
            };
        }

        this.init_config_definition_models = function()
        {
            __config_definition_models['main'] = { arguments : [
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

            __config_definition_models['settings'] = { arguments : [
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
                                                                            key     :   { name : 'scheduler_callback', optional : true },
                                                                            value   :   { type : 'function' }
                                                                        }
                                                                   ]
                                                     };

            __config_definition_models['tasks'] = { arguments  :   [
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
                                                                            key     :   { name : 'content_fill_mode', optional : true },
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

            __config_definition_models['callbacks'] = { arguments :  [
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

            __config_definition_models['latency'] = { arguments :  [
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

            __config_definition_models['bandwidth'] = { arguments :  [
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

            __config_definition_models['repeat'] = { arguments :  [
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

        this.verify_config = function(main_config)
        {
            if (!utils.validation.misc.is_object(main_config)|| 
                !main_config.hasOwnProperty('settings') || !main_config.hasOwnProperty('tasks') || 
                !utils.validation.misc.is_object(main_config.settings) || !utils.validation.misc.is_object(main_config.tasks))
                return false;

            return system_tools.factory.config_verification(main_config);
        };

        this.load_settings = function(settings_config)
        {
            var __modes = utils.conversions.object_to_array(false, system_constants.settings.chain_mode),
                __options_map = system_config_keywords.settings;

            if (__modes.indexOf(settings_config.chain_mode) === -1)
                return false;

            for (__entry in __options_map)
            {
                if (settings_config.hasOwnProperty(__options_map[__entry]))
                {
                    if (__options_map[__entry] === 'init_delay' || __options_map[__entry] === 'interval')
                    {
                        if (settings_config[__options_map[__entry]] < 1 || 
                            settings_config[__options_map[__entry]] > system_constants.misc.MAX_DELAY)
                        {
                            __modes = [];
                            __options_map = [];

                            return false;
                        }
                    }

                    system_models.settings[__options_map[__entry]] = settings_config[__options_map[__entry]];
                }
            }

            if (settings_config.chain_mode === system_constants.settings.chain_mode.SERIAL)
                __is_serial_chain_mode = true;

            __is_optional_task_callbacks = settings_config.optional_task_callbacks;

            __modes = [];
            __options_map = [];

            return true;
        };

        this.load_tasks = function(tasks_config)
        {
            var __this_config_task = null,
                __new_task = null,
                __option = null,
                __callbacks_found = 0,
                __tasks_response_timeout_sum = 0,
                __tasks_delay_sum = 0,
                __same_priorities_num = 0,
                __modes = [];

            for (__index = 0; __index < tasks_config.length; __index++)
            {
                __this_config_task = tasks_config[__index];
                __modes = utils.conversions.object_to_array(false, system_constants.tasks.type);

                if (__modes.indexOf(__this_config_task.type) === -1)
                {
                    system_tools.reset();

                    return false;
                }

                __new_task = system_models.generate_task();

                __new_task.id = prng.generate();
                __new_task.type = __this_config_task.type;

                if (__this_config_task.type === system_constants.tasks.type.DATA)
                {
                    if (!__this_config_task.hasOwnProperty('element_id') || !__this_config_task.hasOwnProperty('content_fill_mode') || 
                        __this_config_task.hasOwnProperty('ajax_mode'))
                    {
                        system_tools.reset();

                        return false;
                    }
                }
                else
                {
                    if (!__this_config_task.hasOwnProperty('ajax_mode') || 
                        __this_config_task.hasOwnProperty('element_id') || __this_config_task.hasOwnProperty('content_fill_mode'))
                    {
                        system_tools.reset();

                        return false;
                    }
                }

                if (utils.validation.misc.is_nothing(__this_config_task.url))
                {
                    system_tools.reset();

                    return false;
                }

                __new_task.url = __this_config_task.url;

                if (utils.validation.misc.is_nothing(__this_config_task.data))
                {
                    system_tools.reset();

                    return false;
                }

                __new_task.data = __this_config_task.data;

                if (__this_config_task.response_timeout < 1 || __this_config_task.response_timeout > system_constants.misc.MAX_DELAY)
                {
                    system_tools.reset();

                    return false;
                }

                __new_task.response_timeout = __this_config_task.response_timeout;

                __tasks_response_timeout_sum += __new_task.response_timeout;

                __callbacks_found = 0

                for (__option in tasks_config[__index].callbacks)
                {
                    if (system_config_keywords.callbacks.indexOf(__option) === -1)
                    {
                        system_tools.reset();

                        return false;
                    }

                    __callbacks_found++;
                }

                if (!__is_optional_task_callbacks && __callbacks_found < system_config_keywords.callbacks.length)
                {
                    system_tools.reset();

                    return false;
                }

                __new_task.callbacks = __this_config_task.callbacks;

                if (__this_config_task.hasOwnProperty('ajax_mode'))
                {
                    __modes = utils.conversions.object_to_array(false, system_constants.tasks.ajax_mode);

                    if (__modes.indexOf(__this_config_task.ajax_mode) === -1)
                    {
                        system_tools.reset();
    
                        return false;
                    }

                    if (__this_config_task.ajax_mode === system_constants.tasks.ajax_mode.ASYNCHRONOUS)
                        __new_task.ajax_mode = 1;
                    else
                    {
                        __new_task.ajax_mode = 2;

                        sensei('Aether', 'Warning: Use of synchronous AJAX causes unexpected\nscheduling in various cases!');
                    }
                }

                if (__this_config_task.hasOwnProperty('element_id'))
                {
                    if (!utils.objects.by_id(__this_config_task.element_id))
                    {
                        system_tools.reset();
    
                        return false;
                    }

                    __new_task.element_id = __this_config_task.element_id;
                }

                if (__this_config_task.hasOwnProperty('content_fill_mode'))
                {
                    __modes = utils.conversions.object_to_array(false, system_constants.tasks.content_fill_mode);

                    if (__modes.indexOf(__this_config_task.content_fill_mode) === -1)
                    {
                        system_tools.reset();
    
                        return false;
                    }

                    if (__this_config_task.content_fill_mode === system_constants.tasks.content_fill_mode.REPLACE)
                        __new_task.content_fill_mode = false;
                    else
                        __new_task.content_fill_mode = true;
                }

                if (__this_config_task.hasOwnProperty('priority'))
                {
                    if (__this_config_task.priority < 1 || __this_config_task.priority > system_constants.misc.MAX_PRIORITY)
                    {
                        system_tools.reset();
    
                        return false;
                    }

                    __new_task.priority = __this_config_task.priority;
                }

                if (__this_config_task.hasOwnProperty('latency'))
                {
                    for (__entry in __this_config_task.latency)
                    {
                        if (!system_tools.factory.qos_validator(__this_config_task.latency[__entry], __entry, 'MAX_LATENCY'))
                        {
                            system_tools.reset();

                            return false;
                        }
                    }

                    __new_task.latency = __this_config_task.latency;
                }

                if (__this_config_task.hasOwnProperty('bandwidth'))
                {
                    for (__entry in __this_config_task.bandwidth)
                    {
                        if (!system_tools.factory.qos_validator(__this_config_task.bandwidth[__entry], __entry, 'MAX_BANDWIDTH'))
                        {
                            system_tools.reset();

                            return false;
                        }
                    }

                    __new_task.bandwidth = __this_config_task.bandwidth;
                }

                if (__this_config_task.hasOwnProperty('repeat'))
                {
                    __modes = utils.conversions.object_to_array(false, system_constants.tasks.repeat);

                    for (__entry in __this_config_task.repeat)
                    {
                        if (__this_config_task.repeat[__entry] !== system_constants.misc.IGNORE && 
                            (__entry === 'times' && __this_config_task.repeat[__entry] < 0) || 
                            (__entry === 'mode' && __modes.indexOf(__this_config_task.repeat[__entry]) === -1))
                        {
                            system_tools.reset();
        
                            return false;
                        }
                    }

                    __new_task.repeat = __this_config_task.repeat;
                }

                if (__this_config_task.hasOwnProperty('delay'))
                {
                    if (__is_serial_chain_mode || __this_config_task.delay < 1 || __this_config_task.delay > system_constants.misc.MAX_DELAY)
                    {
                        system_tools.reset();
    
                        return false;
                    }

                    __new_task.delay = __this_config_task.delay;

                    __tasks_delay_sum += __new_task.delay;
                }

                system_models.tasks.num++;
                system_models.tasks.list.push(__new_task);
            }

            if (!utils.misc.sort(system_models.tasks.list, 'asc', 'priority'))
            {
                system_tools.reset();

                return false;
            }

            __modes = [];

            if (__tasks_response_timeout_sum > system_models.settings.interval)
            {
                sensei('Aether', 'Warning: Scheduler loop interval is lower than the sum\nof response time outs in tasks. ' + 
                                 'This may lead to strange\nbehaviour due to the asynchronous nature of AJAX!');
            }

            if (system_models.settings.interval !== -1 && __tasks_delay_sum > system_models.settings.interval)
            {
                sensei('Aether', 'Warning: Scheduler loop interval is lower than the sum\nof delay produced by tasks. ' + 
                                 'This may lead to strange\nbehaviour due to the asynchronous nature of AJAX!');
            }

            for (__index = 0; __index < system_models.tasks.num - 1; __index++)
            {
                if (system_models.tasks.list[__index].priority === system_models.tasks.list[__index + 1].priority)
                    __same_priorities_num++;
            }

            if (__same_priorities_num > 0)
            {
                sensei('Aether', 'Warning: One or more AJAX tasks have the same priority.\n' + 
                                 'Please consider providing distinct priorities for better scheduling!');
            }

            return true;
        };

        this.process_tasks = function(process_callback)
        {
            var __index = 0,
                __this_task = null,
                __all_tasks = system_models.tasks.list,
                __modes_list = system_constants.settings.chain_mode,
                __task_delay = -1,
                __task_config_map = null,
                __scheduled_tasks_list = [];

            function go(mode, scheduled_tasks_list)
            {
                function scheduler_callback_action()
                {
                    if (system_models.settings.scheduler_callback !== null)
                        system_models.settings.scheduler_callback.call(this);
                }

                function repeater_delegate(mode, index)
                {
                    var __task_entry = null,
                        __task_delay = null;

                    if (mode === __modes_list.SERIAL || mode === __modes_list.DELAY || mode === __modes_list.CALLBACK)
                    {
                        if (index < __all_tasks.length - 1)
                            index++;
                        else
                        {
                            if ((mode === __modes_list.SERIAL || mode === __modes_list.CALLBACK) && index === __all_tasks.length - 1)
                                scheduler_callback_action();

                            return;
                        }
                    }

                    __task_entry = scheduled_tasks_list[index][0];
                    __task_delay = scheduled_tasks_list[index][1];

                    if (mode === __modes_list.CALLBACK)
                    {
                        var __old_success_callback = __task_entry.args.success_callback,
                            __new_success_callback = function()
                                                     {
                                                        __old_success_callback.call(this);

                                                        repeater_delegate(mode, index);
                                                     };

                        __task_entry.args.success_callback = __new_success_callback;
                    }

                    if (__task_delay === -1)
                    {
                        system_tools.factory.ajax_task_call(__task_entry);

                        if (mode === __modes_list.SERIAL || mode === __modes_list.DELAY)
                            repeater_delegate(mode, index);
                    }
                    else
                    {
                        setTimeout(function()
                                   {
                                        system_tools.factory.ajax_task_call(__task_entry);

                                        if (mode === __modes_list.DELAY)
                                        {
                                            repeater_delegate(mode, index);

                                            if (index === __all_tasks.length - 1)
                                                setTimeout(scheduler_callback_action, __task_delay);
                                        }
                                   }, __task_delay);
                    }
                }

                function repeater(mode)
                {
                    var __task_entry = null,
                        __task_delay = null;

                    if (mode === __modes_list.SERIAL || mode === __modes_list.DELAY || mode === __modes_list.CALLBACK)
                        repeater_delegate(mode, -1);
                    else
                    {
                        for (__index = 0; __index < scheduled_tasks_list.length; __index++)
                            repeater_delegate(mode, __index);

                        scheduler_callback_action();
                    }

                    if (utils.validation.misc.is_function(process_callback))
                        process_callback.call(this);
                }

                repeater(system_models.settings.chain_mode);
            }

            for (__index in __all_tasks)
            {
                __this_task = __all_tasks[__index];

                if (__this_task.type === system_constants.tasks.type.DATA)
                {
                    __task_config_map = {
                                            type        :   __this_task.type,
                                            args        :   {
                                                                url                 :       __this_task.url, 
                                                                data                :       __this_task.data, 
                                                                element_id          :       __this_task.element_id, 
                                                                content_fill_mode   :       __this_task.content_fill_mode, 
                                                                success_callback    :       __this_task.callbacks.success, 
                                                                fail_callback       :       __this_task.callbacks.fail, 
                                                                response_timeout    :       __this_task.response_timeout,
                                                                timeout_callback    :       __this_task.callbacks.timeout
                                                            },
                                            repeat      :   __this_task.repeat,
                                            latency     :   __this_task.latency,
                                            bandwidth   :   __this_task.bandwidth
                                        };
                }
                else
                {
                    __task_config_map = {
                                            type        :    __this_task.type,
                                            args        :   {
                                                                url                 :       __this_task.url, 
                                                                data                :       __this_task.data, 
                                                                ajax_mode           :       __this_task.ajax_mode, 
                                                                success_callback    :       __this_task.callbacks.success, 
                                                                fail_callback       :       __this_task.callbacks.fail, 
                                                                response_timeout    :       __this_task.response_timeout,
                                                                timeout_callback    :       __this_task.callbacks.timeout
                                                            },
                                            repeat      :   __this_task.repeat,
                                            latency     :   __this_task.latency,
                                            bandwidth   :   __this_task.bandwidth
                                        };
                }

                __scheduled_tasks_list.push([__task_config_map, __this_task.delay]);
            }

            go(system_models.settings.chain_mode, __scheduled_tasks_list);
        };

        this.run = function()
        {
            var __scheduler = new stopwatch();

            function do_tasks()
            {
                if (system_models.settings.interval === -1)
                    system_tools.process_tasks();
                else
                {
                    __scheduler = new stopwatch();

                    system_tools.process_tasks(function()
                                               {
                                                    __scheduler.start(system_models.settings.interval, 
                                                                      system_tools.process_tasks, false);
                                               });
                }
            }

            if (system_models.settings.init_delay === -1)
                do_tasks();
            else
            __scheduler.start(system_models.settings.init_delay, do_tasks, true);

            return true;
        };

        this.reset = function()
        {
            __is_init = false;
            __config_definition_models = [];

            system_models = new sys_models_class();
        };

        this.factory = new factory_model();
    }

    function init()
    {
        system_tools.init_config_definition_models();
    }

    this.schedule = function(json_config)
    {
        if (__is_init === true || 
            !system_tools.verify_config(json_config) || 
            !system_tools.load_settings(json_config.settings) || 
            !system_tools.load_tasks(json_config.tasks) || 
            !system_tools.run())
            return false;

        __is_init = true;
        __config_definition_models = [];

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
        __is_serial_chain_mode = false,
        __is_optional_task_callbacks = false,
        __config_definition_models = [],
        system_constants = new sys_constants_class(),
        system_models = new sys_models_class(),
        system_config_keywords = new config_keywords_class(),
        system_tools = new sys_tools_class(),
        config_parser = new jap(),
        prng = new pythia(),
        utils = new vulcan();

    // Initialize
    init();
}
