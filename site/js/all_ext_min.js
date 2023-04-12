
function ajax_factory(ajax_data, success_cb, failure_cb, default_cb)
{
 var ajax = new bull(),
 utils = new vulcan(),
 bull_config = {
 "type" : "request",
 "url" : "/",
 "data" : ajax_data,
 "method" : "post",
 "ajax_mode" : "asynchronous",
 "on_success" : function(response)
 {
 if (response !== '0' && response !== '-1' && response !== 'undefined')
 success_cb.call(this, response);
 else
 failure_cb.call(this, response);
 default_cb.call(this);
 }
 };
 if (!utils.validation.misc.is_function(success_cb) ||
 !utils.validation.misc.is_function(failure_cb) ||
 !utils.validation.misc.is_function(default_cb))
 return false;
 ajax.run(bull_config);
 return true;
}
function bull()
{
 function init_config()
 {
 config_definition_model = { "arguments" : [
 {
 "key" : { "name" : "type", "optional" : false },
 "value" : {
 "type" : "string",
 "choices" : ["data", "request"]
 }
 },
 {
 "key" : { "name" : "url", "optional" : false },
 "value" : { "type" : "string" }
 },
 {
 "key" : { "name" : "data", "optional" : true },
 "value" : { "type" : "*" }
 },
 {
 "key" : { "name" : "element_id", "optional" : true },
 "value" : { "type" : "string" }
 },
 {
 "key" : { "name" : "method", "optional" : true },
 "value" : {
 "type" : "string",
 "choices" : ["get", "post"]
 }
 },
 {
 "key" : { "name" : "ajax_mode", "optional" : true },
 "value" : {
 "type" : "string",
 "choices" : ["asynchronous", "synchronous"]
 }
 },
 {
 "key" : { "name" : "content_fill_mode", "optional" : true },
 "value" : {
 "type" : "string",
 "choices" : ["replace", "append"]
 }
 },
 {
 "key" : { "name" : "response_timeout", "optional" : true },
 "value" : { "type" : "number" }
 },
 {
 "key" : { "name" : "on_success", "optional" : true },
 "value" : { "type" : "function" }
 },
 {
 "key" : { "name" : "on_fail", "optional" : true },
 "value" : { "type" : "function" }
 },
 {
 "key" : { "name" : "on_timeout", "optional" : true },
 "value" : { "type" : "function" }
 }
 ]
 };
 }
 function ajax_core()
 {
 function ajax_model()
 {
 this.http_session = function(url, data, method, mode)
 {
 __xml_http.open(method.toUpperCase(), url, mode);
 if (method === 'post' && !utils.validation.misc.is_object(data))
 __xml_http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
 __xml_http.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
 if (mode === true)
 __xml_http.onreadystatechange = state_changed;
 __xml_http.send(data);
 if (mode === false)
 state_changed();
 };
 this.create_object = function()
 {
 var __xml_http_obj = null;
 if (window.XMLHttpRequest)
 __xml_http_obj = new XMLHttpRequest();
 else
 __xml_http_obj = new ActiveXObject("Microsoft.XMLHTTP");
 return __xml_http_obj;
 };
 }
 function state_changed()
 {
 if (__xml_http.readyState === 4)
 {
 if (__is_timeout === true)
 {
 if (utils.validation.misc.is_function(__timeout_callback))
 __timeout_callback.call(this);
 else
 {
 if (utils.validation.misc.is_function(__fail_callback))
 __fail_callback.call(this);
 }
 return false;
 }
 stop_timer(__timer_handler);
 __ajax_response = null;
 __is_timeout = false;
 if (__xml_http.status === 200)
 {
 if (__data_div_id === null)
 __ajax_response = __xml_http.responseText;
 else
 {
 var __container = utils.objects.by_id(__data_div_id);
 if (utils.validation.misc.is_invalid(__container))
 return false;
 __ajax_response = __xml_http.responseText;
 if (__content_fill_mode === 'replace')
 __container.innerHTML = __ajax_response;
 else
 __container.innerHTML += __ajax_response;
 }
 if (utils.validation.misc.is_function(__success_callback))
 __success_callback.call(this, result());
 }
 else
 {
 if (utils.validation.misc.is_function(__fail_callback))
 __fail_callback.call(this);
 return false;
 }
 }
 return true;
 }
 function result()
 {
 if (utils.validation.misc.is_undefined(__ajax_response))
 return null;
 return __ajax_response;
 }
 function init_ajax()
 {
 __xml_http = ajax.create_object();
 }
 function set_callbacks(success_callback, fail_callback, timeout_callback)
 {
 __success_callback = success_callback;
 __fail_callback = fail_callback;
 __timeout_callback = timeout_callback;
 }
 function run_timer(response_timeout)
 {
 if (utils.validation.numerics.is_integer(response_timeout))
 __timer_handler = setTimeout(function() { __is_timeout = true; }, response_timeout);
 }
 function stop_timer(timer_handler)
 {
 if (!utils.validation.misc.is_invalid(timer_handler))
 clearTimeout(timer_handler);
 }
 this.data = function(url, data, element_id, content_fill_mode, success_callback, fail_callback, response_timeout, timeout_callback)
 {
 __data_div_id = element_id;
 __content_fill_mode = content_fill_mode;
 set_callbacks(success_callback, fail_callback, timeout_callback);
 run_timer(response_timeout);
 ajax.http_session(url, data, 'post', true);
 return null;
 };
 this.request = function(url, data, method, ajax_mode, success_callback, fail_callback, response_timeout, timeout_callback)
 {
 set_callbacks(success_callback, fail_callback, timeout_callback);
 run_timer(response_timeout);
 if (ajax_mode === 'asynchronous')
 ajax.http_session(url, data, method, true);
 else
 {
 ajax.http_session(url, data, method, false);
 if (!utils.validation.misc.is_invalid(__ajax_response))
 return __ajax_response;
 }
 return null;
 };
 var __xml_http = null,
 __data_div_id = null,
 __content_fill_mode = null,
 __success_callback = null,
 __timeout_callback = null,
 __fail_callback = null,
 __timer_handler = null,
 __ajax_response = null,
 __is_timeout = false,
 ajax = new ajax_model();
 init_ajax();
 }
 this.run = function(user_config)
 {
 if (!config_parser.verify(config_definition_model, user_config))
 return false;
 if (utils.validation.misc.is_nothing(user_config.url) ||
 !utils.validation.misc.is_invalid(user_config.response_timeout) &&
 (!utils.validation.numerics.is_integer(user_config.response_timeout) ||
 user_config.response_timeout < 1 || user_config.response_timeout > 60000))
 return false;
 if (utils.validation.misc.is_invalid(user_config.data))
 user_config.data = null;
 if (user_config.type === 'data') // [AJAX Data] => Modes: Asynchronous / Methods: POST
 {
 if (utils.validation.misc.is_invalid(user_config.data) ||
 !utils.validation.misc.is_invalid(user_config.method) || !utils.validation.misc.is_invalid(user_config.ajax_mode) ||
 !utils.objects.by_id(user_config.element_id) || utils.validation.misc.is_invalid(user_config.content_fill_mode))
 return false;
 return new ajax_core().data(user_config.url, user_config.data, user_config.element_id, user_config.content_fill_mode,
 user_config.on_success, user_config.on_fail,
 user_config.response_timeout, user_config.on_timeout);
 }
 else // [AJAX Request] => Modes: Asynchronous, Synchronous / Methods: GET, POST
 {
 if (utils.validation.misc.is_invalid(user_config.ajax_mode))
 return false;
 if (utils.validation.misc.is_invalid(user_config.method))
 user_config.method = 'get';
 else
 user_config.method = user_config.method.toLowerCase();
 return new ajax_core().request(user_config.url, user_config.data, user_config.method, user_config.ajax_mode,
 user_config.on_success, user_config.on_fail,
 user_config.response_timeout, user_config.on_timeout);
 }
 };
 var config_definition_model = null,
 utils = new vulcan(),
 config_parser = new jap();
 init_config();
}
function centurion()
{
 function epoch()
 {
 return new Date().getTime();
 }
 function actions_model()
 {
 this.started = false;
 this.ended = false;
 this.latency_set = false;
 }
 function results_model()
 {
 this.initial_msec = -1;
 this.final_msec = -1;
 this.latency = -1;
 }
 function benchmark()
 {
 this.start = function()
 {
 if (actions_list.started)
 return false;
 results_list.initial_msec = epoch();
 actions_list.started = true;
 actions_list.ended = false;
 actions_list.latency_set = false;
 return true;
 };
 this.end = function()
 {
 if (!actions_list.started)
 return false;
 results_list.final_msec = epoch();
 actions_list.started = false;
 actions_list.ended = true;
 return true;
 };
 this.latency = function()
 {
 if (!actions_list.ended)
 return false;
 results_list.latency = results_list.final_msec - results_list.initial_msec;
 actions_list.started = false;
 actions_list.latency_set = true;
 return results_list.latency;
 };
 }
 function status()
 {
 function actions()
 {
 this.is_started = function()
 {
 return actions_list.started;
 };
 this.is_ended = function()
 {
 return actions_list.ended;
 };
 this.is_latency_set = function()
 {
 return actions_list.latency_set;
 };
 }
 function results()
 {
 this.initial_msec = function()
 {
 return results_list.initial_msec;
 };
 this.final_msec = function()
 {
 return results_list.final_msec;
 };
 this.latency = function()
 {
 return results_list.latency;
 };
 }
 this.actions = new actions();
 this.results = new results();
 }
 function init()
 {
 self.benchmark = new benchmark();
 self.status = new status();
 }
 var self = this,
 actions_list = new actions_model(),
 results_list = new results_model();
 init();
}
function content_fetcher(content_id, language_code, success_cb, failure_cb, default_cb)
{
 var data = null,
 ajax_config = null,
 utils = new vulcan(),
 ajax = new bull();
 if (utils.validation.misc.is_undefined(content_id))
 return false;
 if (!utils.validation.alpha.is_string(content_id) ||
 (!utils.validation.misc.is_nothing(language_code) &&
 !utils.validation.alpha.is_string(language_code)))
 return false;
 if (!utils.validation.misc.is_function(success_cb) ||
 !utils.validation.misc.is_function(failure_cb) ||
 !utils.validation.misc.is_function(default_cb))
 return false;
 data = "gate=content&content_id=" + content_id;
 if (!utils.validation.misc.is_nothing(language_code))
 data += '&language_code=' + language_code;
 ajax_config = {
 "type" : "request",
 "url" : "/",
 "data" : data,
 "method" : "post",
 "ajax_mode" : "asynchronous",
 "on_success" : function(response)
 {
 if (response !== 'undefined')
 success_cb.call(this, response);
 else
 failure_cb.call(this, response);
 default_cb.call(this);
 }
 };
 ajax.run(ajax_config);
 return true;
}
function heartbeat(user_config)
{
 var utils = new vulcan(),
 timer = new stopwatch(),
 ajax = new bull(),
 config_parser = new jap(),
 config_definition_model = { "arguments" : [
 {
 "key" : { "name" : "interval", "optional" : false },
 "value" : { "type" : "number" }
 },
 {
 "key" : { "name" : "url", "optional" : true },
 "value" : { "type" : "string" }
 },
 {
 "key" : { "name" : "service_name", "optional" : false },
 "value" : { "type" : "string" }
 },
 {
 "key" : { "name" : "response_timeout", "optional" : false },
 "value" : { "type" : "number" }
 },
 {
 "key" : { "name" : "on_success", "optional" : false },
 "value" : { "type" : "function" }
 },
 {
 "key" : { "name" : "on_fail", "optional" : true },
 "value" : { "type" : "function" }
 },
 {
 "key" : { "name" : "on_timeout", "optional" : true },
 "value" : { "type" : "function" }
 }
 ]
 },
 ajax_config = {
 "type" : "request",
 "method" : "post",
 "ajax_mode" : "asynchronous"
 };
 if (!config_parser.verify(config_definition_model, user_config))
 return false;
 if (!utils.validation.numerics.is_integer(user_config.interval) || user_config.interval < 1 ||
 utils.validation.misc.is_nothing(user_config.service_name) ||
 !utils.validation.numerics.is_integer(user_config.response_timeout) || user_config.response_timeout < 1)
 return false;
 function message(service, status, callback)
 {
 sensei(service, 'Status: <' + status + '>');
 callback.call(this, service);
 }
 if (utils.validation.misc.is_undefined(user_config.url))
 user_config.url = '';
 ajax_config.url = user_config.url;
 ajax_config.response_timeout = user_config.response_timeout;
 ajax_config.on_success = function(service_name, callback)
 {
 return function()
 {
 message(service_name, 'SUCCESS', callback);
 };
 }(user_config.service_name, user_config.on_success);
 if (!utils.validation.misc.is_invalid(user_config.on_fail))
 {
 ajax_config.on_fail = function(service_name, callback)
 {
 return function()
 {
 message(service_name, 'FAIL', callback);
 };
 }(user_config.service_name, user_config.on_fail);
 }
 if (!utils.validation.misc.is_invalid(user_config.on_timeout))
 {
 ajax_config.on_timeout = function(service_name, callback)
 {
 return function()
 {
 message(service_name, 'TIMEOUT', callback);
 };
 }(user_config.service_name, user_config.on_timeout);
 }
 timer.start(user_config.interval, function() { ajax.run(ajax_config); });
 return true;
}
function jap()
{
 function has_unknown_keywords(definition_model)
 {
 if (!utils.validation.misc.is_object(definition_model))
 return false;
 var __index = null,
 __attribute = null,
 __option = null,
 __property = null;
 for (__index in definition_model)
 {
 __attribute = definition_model[__index];
 if (!utils.validation.misc.is_object(__attribute))
 {
 if (!utils.misc.contains(__index, def_keywords))
 return true;
 continue;
 }
 if ((utils.validation.misc.is_object(__attribute) && Object.getOwnPropertyNames(__attribute).length === 0) ||
 (utils.validation.misc.is_array(__attribute) && __attribute.length === 0))
 return true;
 for (__option in __attribute)
 {
 if (utils.validation.misc.is_object(__attribute[__option]))
 {
 for (__property in __attribute[__option])
 {
 if (utils.validation.numerics.is_number(__option))
 continue;
 if (!utils.misc.contains(__property, def_keywords))
 return true;
 if (has_unknown_keywords(__attribute[__option][__property]))
 return true;
 }
 }
 else
 {
 if (!utils.misc.contains(__option, def_keywords))
 return true;
 if (has_unknown_keywords(__attribute[__option]))
 return true;
 }
 }
 }
 return false;
 }
 this.define = function(definition_model)
 {
 if (!utils.validation.misc.is_object(definition_model))
 {
 sensei('J.A.P', 'Invalid definition model!');
 return false;
 }
 if (definition_model.length === 0)
 {
 sensei('J.A.P', 'The definition model is null!');
 return false;
 }
 if (has_unknown_keywords(definition_model))
 {
 sensei('J.A.P', 'The definition model contains unknown keywords!');
 return false;
 }
 var __this_key = null,
 __this_value = null;
 is_model_defined = false;
 if (definition_model.hasOwnProperty('ignore_keys_num') && !utils.validation.misc.is_bool(definition_model.ignore_keys_num))
 {
 sensei('J.A.P', 'Missing or invalid "ignore_keys_num" attribute!');
 return false;
 }
 if (!definition_model.hasOwnProperty('arguments') || !utils.validation.misc.is_object(definition_model.arguments))
 {
 sensei('J.A.P', 'Missing or invalid "arguments" attribute!');
 return false;
 }
 def_model_args = definition_model.arguments;
 for (counter = 0; counter < def_model_args.length; counter++)
 {
 if (!utils.validation.misc.is_object(def_model_args[counter]))
 {
 sensei('J.A.P', 'Invalid JSON object in "arguments" attribute!');
 return false;
 }
 if (!def_model_args[counter].hasOwnProperty('key') || !def_model_args[counter].hasOwnProperty('value'))
 {
 sensei('J.A.P', 'Missing "key" or "value" mandatory attributes!');
 return false;
 }
 __this_key = def_model_args[counter].key;
 __this_value = def_model_args[counter].value;
 if (!utils.validation.misc.is_object(__this_key) || !utils.validation.misc.is_object(__this_value))
 {
 sensei('J.A.P', 'A "key" or "value" attribute does not point to a JSON object!');
 return false;
 }
 if (!__this_key.hasOwnProperty('name') || !__this_key.hasOwnProperty('optional'))
 {
 sensei('J.A.P', 'Missing "name" or "optional" mandatory properties!');
 return false;
 }
 if (!utils.validation.alpha.is_string(__this_key.name) || !utils.validation.misc.is_bool(__this_key.optional))
 {
 sensei('J.A.P', 'Invalid specification for "name" or "optional" property!');
 return false;
 }
 if (!__this_value.hasOwnProperty('type'))
 {
 sensei('J.A.P', 'Missing "type" mandatory property!');
 return false;
 }
 if (!utils.validation.alpha.is_string(__this_value.type) || !utils.misc.contains(__this_value.type, all_value_types))
 {
 sensei('J.A.P', 'Invalid specification for "type" property!');
 return false;
 }
 if (__this_value.hasOwnProperty('choices'))
 {
 if (!utils.misc.contains(__this_value.type, types_with_choices))
 {
 sensei('J.A.P', 'This type does not support the "choices" option!');
 return false;
 }
 if (!utils.validation.misc.is_array(__this_value.choices) || __this_value.choices.length < 1)
 {
 sensei('J.A.P', 'The "choices" option has to be an array with at least\none element!');
 return false;
 }
 }
 if (__this_value.hasOwnProperty('length'))
 {
 if (utils.misc.contains(__this_value.type, uncountable_value_types))
 {
 sensei('J.A.P', 'This type does not support the "length" option!');
 return false;
 }
 if (!utils.validation.numerics.is_integer(__this_value.length) || __this_value.length < 1)
 {
 sensei('J.A.P', 'The "length" option has to be a positive integer!');
 return false;
 }
 }
 if (__this_value.hasOwnProperty('regex'))
 {
 if (utils.misc.contains(__this_value.type, uncountable_value_types) || __this_value.type === 'array')
 {
 sensei('J.A.P', 'This type does not support the "regex" option!');
 return false;
 }
 if (!utils.validation.misc.is_object(__this_value.regex) || __this_value.regex === '')
 {
 sensei('J.A.P', 'Invalid "regex" option!');
 return false;
 }
 }
 }
 is_model_defined = true;
 json_def_model = definition_model;
 return true;
 };
 this.validate = function(config)
 {
 if (!is_model_defined)
 {
 sensei('J.A.P', 'No definition model was specified!');
 return false;
 }
 if (!utils.validation.misc.is_object(config))
 {
 sensei('J.A.P', 'Invalid JSON object!');
 return false;
 }
 var __json_key = null,
 __this_key = null,
 __this_value = null,
 __is_multiple_keys_array = false,
 __keys_exist = 0,
 __mandatory_keys_not_found = 0,
 __model_keywords = [];
 def_model_args = json_def_model.arguments;
 if (utils.validation.misc.is_array(config))
 __is_multiple_keys_array = true;
 for (counter = 0; counter < def_model_args.length; counter++)
 {
 for (__json_key in def_model_args[counter])
 {
 if (!utils.validation.misc.is_undefined(def_model_args[counter][__json_key].name))
 __model_keywords.push(def_model_args[counter][__json_key].name);
 }
 }
 for (__json_key in config)
 {
 if (__is_multiple_keys_array)
 __mandatory_keys_not_found = 0;
 for (counter = 0; counter < def_model_args.length; counter++)
 {
 __this_key = def_model_args[counter].key;
 if (__is_multiple_keys_array)
 {
 for (__this_value in config[__json_key])
 {
 if (!utils.misc.contains(__this_value, __model_keywords))
 {
 sensei('J.A.P', 'Unknown keyword: "' + __this_value + '" in the configuration model!');
 return false;
 }
 }
 }
 else
 {
 if (!utils.misc.contains(__json_key, __model_keywords))
 {
 sensei('J.A.P', 'Unknown keyword: "' + __json_key + '" in the configuration model!');
 return false;
 }
 }
 if (__this_key.optional === false)
 {
 if (__is_multiple_keys_array)
 {
 if (!config[__json_key].hasOwnProperty(__this_key.name))
 __mandatory_keys_not_found++;
 }
 else
 {
 if (!config.hasOwnProperty(__this_key.name))
 __mandatory_keys_not_found++;
 }
 }
 }
 if (__is_multiple_keys_array && __mandatory_keys_not_found > 0)
 break;
 __keys_exist++;
 }
 if ((!json_def_model.hasOwnProperty('ignore_keys_num') || json_def_model.ignore_keys_num === false) &&
 __mandatory_keys_not_found > 0)
 {
 sensei('J.A.P', 'Mandatory properties are missing!');
 return false;
 }
 if (__keys_exist === 0)
 {
 sensei('J.A.P', 'The JSON object is null!');
 return false;
 }
 for (counter = 0; counter < def_model_args.length; counter++)
 {
 __this_key = def_model_args[counter].key;
 __this_value = def_model_args[counter].value;
 if (__this_value.type !== '*')
 {
 if (__this_value.type === 'null')
 {
 if (config[__this_key.name] !== null)
 {
 sensei('J.A.P', 'Argument: "' + __this_key.name + '" accepts only "null" values!');
 return false;
 }
 }
 else if (__this_value.type === 'number')
 {
 if (__is_multiple_keys_array)
 {
 for (__json_key in config)
 {
 if (utils.validation.misc.is_undefined(config[__json_key][__this_key.name]))
 continue;
 if (utils.validation.misc.is_nothing(config[__json_key][__this_key.name].toString().trim()) ||
 !utils.validation.numerics.is_number(Number(config[__json_key][__this_key.name])))
 {
 sensei('J.A.P', 'Argument: "' + __this_key.name + '" accepts only "numeric" values!');
 return false;
 }
 }
 }
 else
 {
 if (utils.validation.misc.is_undefined(config[__this_key.name]))
 continue;
 if (utils.validation.misc.is_nothing(config[__this_key.name].toString().trim()) ||
 !utils.validation.numerics.is_number(Number(config[__this_key.name])))
 {
 sensei('J.A.P', 'Argument: "' + __this_key.name + '" accepts only "numeric" values!');
 return false;
 }
 }
 }
 else if (__this_value.type === 'array')
 {
 if (!utils.validation.misc.is_array(config[__this_key.name]))
 {
 sensei('J.A.P', 'Argument: "' + __this_key.name + '" accepts only "array" values!');
 return false;
 }
 }
 else
 {
 if (__is_multiple_keys_array)
 {
 for (__json_key in config)
 {
 if (utils.validation.misc.is_undefined(config[__json_key][__this_key.name]))
 continue;
 if (typeof config[__json_key][__this_key.name] !== __this_value.type)
 {
 sensei('J.A.P', 'Argument: "' + __this_key.name + '" has a type mismatch!');
 return false;
 }
 }
 }
 else
 {
 if (utils.validation.misc.is_undefined(config[__this_key.name]))
 continue;
 if (typeof config[__this_key.name] !== __this_value.type)
 {
 sensei('J.A.P', 'Argument: "' + __this_key.name + '" has a type mismatch!');
 return false;
 }
 }
 }
 }
 if (__this_value.hasOwnProperty('choices'))
 {
 if (__is_multiple_keys_array)
 {
 for (__json_key in config)
 {
 if (utils.validation.misc.is_undefined(config[__json_key][__this_key.name]))
 continue;
 if (!utils.misc.contains(config[__json_key][__this_key.name], __this_value.choices))
 {
 sensei('J.A.P', 'Argument: "' + __this_key.name + '" does not contain any\ndefined choices!');
 return false;
 }
 }
 }
 else
 {
 if (utils.validation.misc.is_undefined(config[__this_key.name]))
 continue;
 if (!utils.misc.contains(config[__this_key.name], __this_value.choices))
 {
 sensei('J.A.P', 'Argument: "' + __this_key.name + '" does not contain any\ndefined choices!');
 return false;
 }
 }
 }
 if (__this_value.hasOwnProperty('length'))
 {
 if (__this_value.type === 'array')
 {
 if (config[__this_key.name].length > __this_value.length)
 {
 sensei('J.A.P', 'Argument: "' + __this_key.name + '" has exceeded the defined length!');
 return false;
 }
 }
 else
 {
 if (config[__this_key.name].toString().length > __this_value.length)
 {
 sensei('J.A.P', 'Argument: "' + __this_key.name + '" has exceeded the defined length!');
 return false;
 }
 }
 }
 if (__this_value.hasOwnProperty('regex'))
 {
 if (!utils.validation.utilities.reg_exp(__this_value.regex, config[__this_key.name]))
 {
 sensei('J.A.P', 'Argument: "' + __this_key.name + '" has not matched the specified regex!');
 return false;
 }
 }
 }
 return true;
 };
 this.verify = function(definition_model, config)
 {
 if (self.define(definition_model))
 return self.validate(config);
 return false;
 };
 var self = this,
 is_model_defined = false,
 counter = 0,
 json_def_model = null,
 def_model_args = null,
 def_keywords = ['ignore_keys_num', 'arguments', 'key', 'value', 'name', 'optional', 'type', 'choices', 'length', 'regex'],
 all_value_types = ['number', 'string', 'boolean', 'array', 'object', 'function', 'null', '*'],
 uncountable_value_types = ['boolean', 'object', 'function', 'null', '*'],
 types_with_choices = ['number', 'string', 'array'],
 utils = new vulcan();
}
function yoda()
{
 this.fetch = function(dynamic_contents, lang, label = null)
 {
 if (!utils.validation.misc.is_object(dynamic_contents) || utils.validation.misc.is_undefined(lang) ||
 utils.validation.alpha.is_symbol(lang) || lang.length !== 2 ||
 utils.validation.misc.is_undefined(label))
 return false;
 if (label !== null)
 {
 for (var this_record of dynamic_contents[lang])
 {
 if (this_record.hasOwnProperty(label))
 return this_record[label];
 }
 }
 return dynamic_contents[lang];
 };
 this.get = function(dynamic_contents, lang, label = null)
 {
 if (!is_init)
 return false;
 if (!utils.validation.misc.is_object(dynamic_contents) || utils.validation.misc.is_undefined(lang) ||
 utils.validation.alpha.is_symbol(lang) || lang.length !== 2 ||
 utils.validation.misc.is_undefined(label))
 return false;
 if (!available_langs.hasOwnProperty(lang))
 return false;
 if (label !== null)
 {
 for (var this_record of dynamic_contents[lang])
 {
 if (this_record.hasOwnProperty(label))
 return this_record[label];
 }
 }
 return dynamic_contents[lang];
 };
 this.set = function(dynamic_contents, lang, label)
 {
 if (!is_init)
 return false;
 if (!utils.validation.misc.is_object(dynamic_contents) || utils.validation.misc.is_undefined(lang) ||
 utils.validation.alpha.is_symbol(lang) || lang.length !== 2 ||
 utils.validation.misc.is_undefined(label))
 return false;
 if (!available_langs.hasOwnProperty(lang))
 return false;
 available_langs[lang].push(label);
 return available_langs;
 };
 this.list = function(dynamic_contents, lang = null)
 {
 if (!is_init)
 return false;
 if (!utils.validation.misc.is_object(dynamic_contents))
 return false;
 if (lang !== null)
 {
 if (utils.validation.alpha.is_symbol(lang) || lang.length !== 2)
 return false;
 else
 return dynamic_contents[lang];
 }
 return dynamic_contents;
 };
 this.reset = function(dynamic_contents)
 {
 if (!is_init)
 return false;
 if (!utils.validation.misc.is_object(dynamic_contents))
 return false;
 available_langs = {};
 dynamic_contents = [];
 return true;
 };
 this.init = function(languages_array)
 {
 if (is_init)
 return false;
 if (!utils.validation.misc.is_array(languages_array))
 return false;
 var this_lang = null;
 for (this_lang of languages_array)
 {
 if (this_lang.length !== 2)
 return false;
 available_langs[this_lang] = [];
 }
 is_init = true;
 return true;
 };
 var is_init = false,
 available_langs = {},
 utils = new vulcan();
}
function key_manager()
{
 var __keyboard_key = null;
 function key_constants()
 {
 this.ESCAPE = 27;
 this.ENTER = 13;
 this.BACKSPACE = 8;
 this.TAB = 9;
 this.SHIFT = 16;
 this.CONTROL = 17;
 this.ALT = 18;
 }
 this.scan = function(key_event)
 {
 try
 {
 if (typeof key_event.keyCode === 'undefined')
 __keyboard_key = key_event.button;
 else
 __keyboard_key = key_event.keyCode;
 return true;
 }
 catch(e)
 {
 console.log(e);
 return false;
 }
 };
 this.get = function()
 {
 return __keyboard_key;
 };
 this.keys = new key_constants();
}
function msgbox()
{
 function general_helpers()
 {
 var self = this;
 this.draw_screen = function(container_id)
 {
 var __button_object = null,
 __container = utils.objects.by_id(container_id),
 __html = null;
 if (__container === false || utils.validation.misc.is_undefined(__container) || __container === null)
 return false;
 msgbox_object = utils.objects.by_id('msgbox');
 if (msgbox_object !== null)
 __container.removeChild(msgbox_object);
 msgbox_object = document.createElement('div');
 msgbox_object.id = 'msgbox';
 msgbox_object.className = 'mb_screen';
 var __win_title = msgbox_object.id + '_title',
 __button_title = msgbox_object.id + '_button',
 __close_label = local_labels.fetch(global_m_mvc_dynamic_contents, utils.misc.active_language(), 'close_button');
 __html = '<div class="msg_window">' +
 ' <div id="' + __win_title + '"></div>' +
 ' <div id="' + msgbox_object.id + '_content"></div>' +
 ' <div id="' + __button_title + '">' + __close_label + '</div>' +
 '</div>';
 msgbox_object.innerHTML = __html;
 __container.appendChild(msgbox_object);
 __button_object = utils.objects.by_id(__button_title);
 utils.events.attach(__button_title, __button_object, 'click', self.hide_win);
 return true;
 };
 this.show_win = function(title, message)
 {
 if (timer !== null)
 clearTimeout(timer);
 msgbox_object.childNodes[0].childNodes[1].innerHTML = title;
 msgbox_object.childNodes[0].childNodes[3].innerHTML = message;
 msgbox_object.style.visibility = 'visible';
 msgbox_object.classList.remove('mb_fade_out');
 msgbox_object.classList.add('mb_fade_in');
 is_open = true;
 };
 this.hide_win = function()
 {
 if (timer !== null)
 clearTimeout(timer);
 msgbox_object.style.visibility = 'visible';
 msgbox_object.classList.remove('mb_fade_in');
 msgbox_object.classList.add('mb_fade_out');
 timer = setTimeout(function() { msgbox_object.style.visibility = 'hidden'; }, 250);
 is_open = false;
 if (global_hide_callback !== null)
 {
 global_hide_callback.call(this);
 global_hide_callback = null;
 }
 };
 }
 this.show = function(title, message, hide_callback)
 {
 if (!is_init || is_open ||
 !utils.validation.alpha.is_string(title) ||
 !utils.validation.alpha.is_string(message) ||
 (!utils.validation.misc.is_invalid(hide_callback) &&
 !utils.validation.misc.is_function(hide_callback)))
 return false;
 if (utils.validation.misc.is_function(hide_callback))
 global_hide_callback = hide_callback;
 helpers.show_win(title, message);
 return true;
 };
 this.hide = function(callback)
 {
 if (!is_init || !is_open ||
 (!utils.validation.misc.is_invalid(callback) &&
 !utils.validation.misc.is_function(callback)))
 return false;
 if (utils.validation.misc.is_function(callback))
 global_hide_callback = callback;
 helpers.hide_win();
 return true;
 };
 this.is_open = function()
 {
 if (!is_init)
 return false;
 return is_open;
 };
 this.init = function(container_id)
 {
 if (is_init)
 return false;
 if (utils.validation.misc.is_invalid(container_id) || !utils.validation.alpha.is_string(container_id))
 return false;
 utils.graphics.apply_theme('/framework/extensions/js/core/msgbox', 'msgbox');
 if (!helpers.draw_screen(container_id))
 return false;
 is_init = true;
 return true;
 };
 var is_init = false,
 is_open = false,
 msgbox_object = null,
 global_hide_callback = null,
 timer = null,
 helpers = new general_helpers(),
 local_labels = new yoda(),
 utils = new vulcan();
}
function pythia()
{
 function loop(rnd_num)
 {
 var __results_length = results.length,
 __index = 0;
 if (__results_length === 0 || rnd_num >= results[__results_length - 1])
 {
 if (rnd_num === max_random_num)
 return rnd_num;
 else
 {
 if (rnd_num === results[__results_length - 1])
 rnd_num++;
 results.push(rnd_num);
 return rnd_num;
 }
 }
 for (__index = 0; __index < __results_length; __index++)
 {
 if (rnd_num === results[__index])
 rnd_num++;
 else
 {
 if (rnd_num < results[__index])
 {
 results.splice(__index, 0, rnd_num);
 break;
 }
 }
 }
 return rnd_num;
 }
 this.generate = function()
 {
 var __this_rnd_num = Math.floor((Math.random() * max_random_num) + 1);
 return loop(__this_rnd_num);
 };
 this.load = function(values_array)
 {
 if (!utils.validation.misc.is_array(values_array) || values_array.length === 0)
 return false;
 var __index = 0,
 __values_length = values_array.length;
 for (__index = 0; __index++; __index < __values_length)
 {
 if (!utils.validation.numerics.is_integer(values_array[__index]))
 {
 results = [];
 return false;
 }
 results.push(values_array[__index]);
 }
 return true;
 };
 this.reset = function()
 {
 results = [];
 return null;
 };
 var max_random_num = Number.MAX_SAFE_INTEGER,
 results = [],
 utils = new vulcan();
}
function sensei(title, message)
{
 var __index = 0,
 __stars = '',
 utils = new vulcan();
 if ((!utils.validation.misc.is_invalid(title) && !utils.validation.alpha.is_string(title)) ||
 (!utils.validation.misc.is_invalid(message) && !utils.validation.alpha.is_string(message)))
 return false;
 for (__index = 0; __index < title.length - 2; __index++)
 __stars += '*';
 console.log('-------------------------- ' + title + ' --------------------------');
 console.log(message);
 console.log('-------------------------- ' + __stars + ' --------------------------');
 console.log('');
 return true;
}
function stopwatch()
{
 function instance(interval, callback)
 {
 if (!is_on)
 return;
 clearTimeout(timer_handler);
 callback.call(this, self);
 if (is_one_shot)
 {
 is_on = false;
 return;
 }
 delay += interval;
 diff = (new Date().getTime() - init_time) - delay;
 timer_handler = setTimeout(function() { instance(interval, callback); }, (interval - diff));
 }
 this.start = function(interval, callback, run_once)
 {
 if (is_on)
 return false;
 if (!utils.validation.numerics.is_integer(interval) || interval < 1 ||
 !utils.validation.misc.is_function(callback) ||
 (!utils.validation.misc.is_undefined(run_once) && !utils.validation.misc.is_bool(run_once)))
 return false;
 timer_handler = setTimeout(function() { instance(interval, callback); }, interval);
 is_on = true;
 is_one_shot = run_once;
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
 var self = this,
 is_on = false,
 is_one_shot = false,
 init_time = new Date().getTime(),
 delay = 0,
 diff = 0,
 timer_handler = null,
 utils = new vulcan();
}
function vulcan()
{
 function validation()
 {
 function alpha()
 {
 var __self = this;
 this.is_string = function(val)
 {
 if (typeof val !== 'string')
 return false;
 return true;
 };
 this.is_symbol = function(val)
 {
 if (!__self.is_string(val))
 return false;
 if (val.match(/[!$%^&*()+\-|~=`{}\[\]:";'<>?,\/]/))
 return true;
 return false;
 };
 this.is_blank = function(val)
 {
 if (!__self.is_string(val))
 return false;
 if (!val.trim())
 return true;
 return false;
 };
 }
 function numerics()
 {
 var __self = this;
 this.is_number = function(val)
 {
 if (self.validation.misc.is_array(val) && val.length === 0)
 return false;
 if (!isNaN(val - parseFloat(val)))
 return true;
 return false;
 };
 this.is_integer = function(val)
 {
 if (__self.is_number(val) && (val % 1 === 0) && !self.misc.contains('.', val.toString()))
 return true;
 return false;
 };
 this.is_float = function(val)
 {
 if (val === 0.0)
 return true;
 if (__self.is_number(val) && (val % 1 !== 0))
 return true;
 return false;
 };
 }
 function misc()
 {
 var __self = this;
 this.is_undefined = function(val)
 {
 if (val === undefined)
 return true;
 return false;
 };
 this.is_nothing = function(val)
 {
 if (val === null || val === '')
 return true;
 return false;
 };
 this.is_bool = function(val)
 {
 if (typeof val === 'boolean')
 return true;
 return false;
 };
 this.is_array = function(val)
 {
 if (Array.isArray(val))
 return true;
 return false;
 };
 this.is_function = function(val)
 {
 if (typeof val === 'function')
 return true;
 return false;
 };
 this.is_object = function(val)
 {
 if (typeof val === 'object')
 return true;
 return false;
 };
 this.is_invalid = function(val)
 {
 if (__self.is_undefined(val) || __self.is_nothing(val))
 return true;
 return false;
 };
 }
 function utilities()
 {
 this.is_email = function(val)
 {
 var __pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
 return __pattern.test(String(val).toLowerCase());
 };
 this.is_phone = function(val)
 {
 var __pattern = /^\+?\d{2}[- ]?\d{3}[- ]?\d{5}$/;
 return __pattern.test(String(val).toLowerCase());
 };
 this.reg_exp = function(pattern, expression)
 {
 return pattern.test(String(expression)).toLowerCase();
 };
 }
 this.alpha = new alpha();
 this.numerics = new numerics();
 this.misc = new misc();
 this.utilities = new utilities();
 }
 function events()
 {
 function controller()
 {
 var __controlling_list = [];
 function caller_model()
 {
 this.caller_id = null;
 this.object_events = [];
 }
 function object_events_model()
 {
 this.object = null;
 this.events = [];
 }
 function final_event(caller_index, object_index, event_index, func)
 {
 var __result = __controlling_list[caller_index].object_events[object_index].events[event_index][func];
 __controlling_list[caller_index].object_events[object_index].events.splice(event_index, 1);
 return __result;
 }
 this.insert = function(caller_id, object, func, handler)
 {
 var __counter_i = 0,
 __counter_j = 0,
 __callers = __controlling_list.length,
 __this_control_list = null,
 __objects_num = 0,
 __func_handler = [];
 for (__counter_i = 0; __counter_i < __callers; __counter_i++)
 {
 __this_control_list = __controlling_list[__counter_i];
 if (__this_control_list.caller_id === caller_id)
 {
 __objects_num = __this_control_list.object_events.length;
 for (__counter_j = 0; __counter_j < __objects_num; __counter_j++)
 {
 if (__this_control_list.object_events[__counter_j].object === object)
 {
 __func_handler[func] = handler;
 __this_control_list.object_events[__counter_j].events.push(__func_handler);
 return true;
 }
 }
 }
 }
 var __new_caller_model = new caller_model(),
 __new_object_events_model = new object_events_model();
 __func_handler[func] = handler;
 __new_object_events_model.object = object;
 __new_object_events_model.events.push(__func_handler);
 __new_caller_model.caller_id = caller_id;
 __new_caller_model.object_events.push(__new_object_events_model);
 __controlling_list.push(__new_caller_model);
 return true;
 };
 this.fetch = function(caller_id, object, func, handler)
 {
 var __counter_i = 0,
 __counter_j = 0,
 __counter_k = 0,
 __callers = __controlling_list.length,
 __objects_num = 0,
 __control_list_i = null,
 __control_list_j = null,
 __control_list_k = null;
 for (__counter_i = 0; __counter_i < __callers; __counter_i++)
 {
 __control_list_i = __controlling_list[__counter_i];
 if (__control_list_i.caller_id === caller_id)
 {
 __objects_num = __control_list_i.object_events.length;
 for (__counter_j = 0; __counter_j < __objects_num; __counter_j++)
 {
 __control_list_j = __control_list_i.object_events[__counter_j];
 if (__control_list_j.object === object)
 {
 var __events = __control_list_j.events.length;
 for (__counter_k = 0; __counter_k < __events; __counter_k++)
 {
 __control_list_k = __control_list_j.events[__counter_k];
 if (self.validation.misc.is_invalid(handler))
 {
 if (self.validation.misc.is_undefined(__control_list_k[func]))
 continue;
 return final_event(__counter_i, __counter_j, __counter_k, func);
 }
 else
 {
 if (self.validation.misc.is_undefined(__control_list_k[func]))
 continue;
 if (!self.validation.misc.is_function(handler))
 return false;
 var __this_handler = __control_list_k[func];
 if (__this_handler.toString() === handler.toString())
 return final_event(__counter_i, __counter_j, __counter_k, func);
 }
 }
 }
 }
 }
 }
 return false;
 };
 }
 this.attach = function(caller_id, object, func, handler)
 {
 if (self.validation.alpha.is_symbol(caller_id) ||
 self.validation.misc.is_invalid(object) || !self.validation.misc.is_object(object) ||
 self.validation.alpha.is_symbol(func) || !self.validation.misc.is_function(handler))
 return false;
 if (object.tagName === 'SELECT' ||
 self.validation.misc.is_undefined(object.length) ||
 self.validation.misc.is_undefined(object.item)) // Single element
 {
 if (!__controller.insert(caller_id, object, func, handler))
 return false;
 object.addEventListener(func, handler, false);
 }
 else // Multiple elements
 {
 var __counter_i = 0,
 __object_length = object.length;
 for (__counter_i = 0; __counter_i < __object_length; __counter_i++)
 {
 if (!__controller.insert(caller_id, object[__counter_i], func, handler))
 return false;
 object[__counter_i].addEventListener(func, handler, false);
 }
 }
 return true;
 };
 this.detach = function(caller_id, object, func, handler)
 {
 if (self.validation.alpha.is_symbol(caller_id) ||
 self.validation.misc.is_invalid(object) || !self.validation.misc.is_object(object) ||
 self.validation.alpha.is_symbol(func))
 return false;
 var __handler = null;
 if (object.tagName === 'SELECT' ||
 self.validation.misc.is_undefined(object.length) ||
 self.validation.misc.is_undefined(object.item)) // Single element
 {
 __handler = __controller.fetch(caller_id, object, func, handler);
 if (!__handler)
 return false;
 object.removeEventListener(func, __handler, false);
 }
 else // Multiple elements
 {
 var __counter_i = 0,
 __object_length = object.length;
 for (__counter_i = 0; __counter_i < __object_length; __counter_i++)
 {
 __handler = __controller.fetch(caller_id, object[__counter_i], func, handler);
 if (!__handler)
 return false;
 object[__counter_i].removeEventListener(func, __handler, false);
 }
 }
 return true;
 };
 var __controller = new controller();
 }
 function conversions()
 {
 this.object_to_array = function(conversion_mode, model)
 {
 return Object.keys(model).map(function(key)
 {
 if (conversion_mode === true)
 return [key, model[key]];
 else
 return model[key];
 });
 };
 this.replace_link = function(mode, text, attributes, url_info)
 {
 if (!self.validation.numerics.is_integer(mode) || mode < 0 || mode > 2 || !self.validation.alpha.is_string(text))
 return false;
 if (!self.validation.misc.is_undefined(attributes))
 {
 if (attributes !== null)
 {
 if (!self.validation.misc.is_object(attributes))
 return false;
 var __this_attribute = null,
 __final_attributes = null,
 __valid_attributes = ['id', 'class', 'style', 'title', 'dir', 'lang', 'accesskey', 'tabindex',
 'contenteditable', 'draggable', 'spellcheck', 'target', 'rel'];
 for (__this_attribute in attributes)
 {
 if (!self.misc.contains(__this_attribute, __valid_attributes) && __this_attribute.indexOf('data-') !== 0)
 return false;
 __final_attributes += __this_attribute + '="' + attributes[__this_attribute] + '" ';
 }
 }
 }
 if (mode === 1)
 {
 var __match = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
 if (self.validation.misc.is_undefined(__final_attributes))
 return text.replace(__match, "<a href='$1'>$1</a>");
 else
 return text.replace(__match, "<a " + __final_attributes + "href='$1'>$1</a>");
 }
 else if (mode === 2)
 {
 if (self.validation.misc.is_undefined(url_info) || !self.validation.misc.is_object(url_info))
 return false;
 var __counter_i = 0,
 __url_info_length = url_info.length;
 for (__counter_i = 0; __counter_i < __url_info_length; __counter_i++ )
 {
 if (!self.validation.misc.is_object(url_info[__counter_i]))
 return false;
 if (self.validation.misc.is_undefined(__final_attributes))
 {
 text = text.replace(url_info[__counter_i].expanded_url,
 '<a href="' + url_info[__counter_i].expanded_url + '">' +
 url_info[__counter_i].display_url + '</a>');
 }
 else
 {
 text = text.replace(url_info[__counter_i].expanded_url,
 '<a ' + __final_attributes + 'href="' +
 url_info[__counter_i].expanded_url + '">' +
 url_info[__counter_i].display_url + '</a>');
 }
 }
 return text;
 }
 else
 return false;
 };
 }
 function graphics()
 {
 this.pixels_value = function(pixels)
 {
 var __result = null;
 __result = parseInt(pixels.substring(0, pixels.length - 2), 10);
 if (!self.validation.numerics.is_integer(__result))
 return false;
 return __result;
 };
 this.apply_theme = function(directory, theme, clear_cache = true)
 {
 if (self.validation.misc.is_invalid(directory) || self.validation.alpha.is_symbol(theme) || !self.validation.misc.is_bool(clear_cache))
 return false;
 if (self.validation.misc.is_undefined(theme))
 theme = 'default';
 if (self.system.source_exists(theme, 'link', 'href'))
 return false;
 var __dynamic_object = null,
 __cache_reset = '';
 if (clear_cache)
 __cache_reset = '?version=' + Date.now();
 __dynamic_object = document.createElement('link');
 __dynamic_object.setAttribute('rel', 'stylesheet');
 __dynamic_object.setAttribute('type', 'text/css');
 __dynamic_object.setAttribute('media', 'screen');
 __dynamic_object.setAttribute('href', directory + '/' + theme + '.css' + __cache_reset);
 self.objects.by_tag('head')[0].appendChild(__dynamic_object);
 return true;
 };
 }
 function misc()
 {
 var __self = this;
 this.active_language = function()
 {
 return location.pathname.substring(1, 3);
 };
 this.contains = function(subject, list)
 {
 if (list.indexOf(subject) === -1)
 return false;
 return true;
 };
 this.sort = function(array, mode, by_property)
 {
 var __modes = ['asc', 'desc'],
 __order = null,
 __result = null;
 if (!self.validation.misc.is_array(array) || !__self.contains(mode, __modes) ||
 (!self.validation.misc.is_invalid(by_property) && !self.validation.alpha.is_string(by_property)))
 return false;
 if (mode === 'asc')
 __order = 1;
 else
 __order = -1;
 if (self.validation.misc.is_invalid(by_property))
 __result = array.sort(function(a, b) { return __order * (a - b); });
 else
 __result = array.sort(function(a, b) { return __order * (a[by_property] - b[by_property]); });
 return __result;
 };
 }
 function objects()
 {
 this.by_tag = function(html_tag)
 {
 if (self.validation.misc.is_invalid(html_tag))
 return false;
 return document.getElementsByTagName(html_tag);
 };
 this.by_id = function(id)
 {
 if (self.validation.misc.is_invalid(id))
 return false;
 return document.getElementById(id);
 };
 this.by_class = function(class_name)
 {
 if (self.validation.misc.is_invalid(class_name))
 return false;
 return document.getElementsByClassName(class_name);
 };
 function selectors()
 {
 this.first = function(query)
 {
 if (self.validation.misc.is_invalid(query))
 return false;
 return document.querySelector(query);
 };
 this.all = function(query)
 {
 if (self.validation.misc.is_invalid(query))
 return false;
 return document.querySelectorAll(query);
 };
 }
 this.selectors = new selectors();
 }
 function system()
 {
 var __self = this;
 this.require = function(js_file_path, js_file_name, clear_cache = true)
 {
 if (self.validation.misc.is_invalid(js_file_path) ||
 self.validation.misc.is_invalid(js_file_name) || self.validation.alpha.is_symbol(js_file_name) ||
 !self.validation.misc.is_bool(clear_cache))
 return false;
 if (__self.source_exists(js_file_name, 'script', 'src'))
 return false;
 var __dynamic_object = null,
 __cache_reset = '';
 if (clear_cache)
 __cache_reset = '?version=' + Date.now();
 __dynamic_object = document.createElement('script');
 __dynamic_object.setAttribute('src', js_file_path + '/' + js_file_name + '.js' + __cache_reset);
 self.objects.by_tag('head')[0].appendChild(__dynamic_object);
 return true;
 };
 this.source_exists = function(file_name, tag_type, attribute)
 {
 if (self.validation.misc.is_invalid(file_name) || self.validation.alpha.is_symbol(file_name) ||
 self.validation.misc.is_invalid(tag_type) || self.validation.alpha.is_symbol(tag_type) ||
 self.validation.misc.is_invalid(attribute) || self.validation.alpha.is_symbol(attribute))
 return false;
 var __counter_i = 0,
 __sources = document.head.getElementsByTagName(tag_type);
 for (__counter_i = 0; __counter_i < __sources.length; __counter_i++)
 {
 if (__sources[__counter_i].attributes[attribute].value.indexOf(file_name) > -1)
 return true;
 }
 return false;
 };
 }
 function init()
 {
 self.validation = new validation();
 self.events = new events();
 self.conversions = new conversions();
 self.graphics = new graphics();
 self.misc = new misc();
 self.objects = new objects();
 self.system = new system();
 }
 var self = this;
 init();
}
function taurus()
{
 function init_config()
 {
 config_definition_model = { "arguments" : [
 {
 "key" : { "name" : "type", "optional" : false },
 "value" : {
 "type" : "string",
 "choices" : ["data", "request"]
 }
 },
 {
 "key" : { "name" : "url", "optional" : false },
 "value" : { "type" : "string" }
 },
 {
 "key" : { "name" : "data", "optional" : true },
 "value" : { "type" : "*" }
 },
 {
 "key" : { "name" : "element_id", "optional" : true },
 "value" : { "type" : "string" }
 },
 {
 "key" : { "name" : "method", "optional" : true },
 "value" : {
 "type" : "string",
 "choices" : ["get", "post"]
 }
 },
 {
 "key" : { "name" : "ajax_mode", "optional" : true },
 "value" : {
 "type" : "string",
 "choices" : ["asynchronous", "synchronous"]
 }
 },
 {
 "key" : { "name" : "content_fill_mode", "optional" : true },
 "value" : {
 "type" : "string",
 "choices" : ["replace", "append"]
 }
 },
 {
 "key" : { "name" : "response_timeout", "optional" : true },
 "value" : { "type" : "number" }
 },
 {
 "key" : { "name" : "on_success", "optional" : true },
 "value" : { "type" : "function" }
 },
 {
 "key" : { "name" : "on_fail", "optional" : true },
 "value" : { "type" : "function" }
 },
 {
 "key" : { "name" : "on_timeout", "optional" : true },
 "value" : { "type" : "function" }
 }
 ]
 };
 }
 function ajax_core()
 {
 var __data_div_id = null,
 __content_fill_mode = null,
 __success_callback = null,
 __timeout_callback = null,
 __fail_callback = null,
 __timer_handler = null,
 __ajax_response = null,
 __content_type = null,
 __is_timeout = false;
 function set_callbacks(success_callback, fail_callback, timeout_callback)
 {
 __success_callback = success_callback;
 __fail_callback = fail_callback;
 __timeout_callback = timeout_callback;
 }
 function run_bad_callbacks()
 {
 if (__is_timeout === true)
 {
 if (utils.validation.misc.is_function(__timeout_callback))
 __timeout_callback.call(this);
 else
 {
 if (utils.validation.misc.is_function(__fail_callback))
 __fail_callback.call(this);
 }
 }
 else
 {
 if (utils.validation.misc.is_function(__fail_callback))
 __fail_callback.call(this);
 }
 }
 function run_timer(response_timeout)
 {
 if (utils.validation.numerics.is_integer(response_timeout))
 __timer_handler = setTimeout(function() { __is_timeout = true; }, response_timeout);
 }
 function stop_timer(timer_handler)
 {
 if (!utils.validation.misc.is_invalid(timer_handler))
 clearTimeout(timer_handler);
 }
 this.data = function(url, data, element_id, content_fill_mode, success_callback, fail_callback, response_timeout, timeout_callback)
 {
 __data_div_id = element_id;
 __content_fill_mode = content_fill_mode;
 set_callbacks(success_callback, fail_callback, timeout_callback);
 run_timer(response_timeout);
 if (!utils.validation.misc.is_object(data))
 __content_type = { 'Content-Type': 'application/x-www-form-urlencoded' };
 else
 __content_type = {};
 fetch(url, {
 method: 'POST',
 mode: 'cors',
 cache: 'no-cache',
 credentials: 'same-origin',
 headers: __content_type,
 redirect: 'error',
 referrerPolicy: 'no-referrer',
 body: data
 }).then((response) => {
 stop_timer(__timer_handler);
 if (response.ok)
 {
 var __container = utils.objects.by_id(__data_div_id);
 if (utils.validation.misc.is_invalid(__container))
 return false;
 response.text().then((data) =>
 {
 if (__content_fill_mode === 'replace')
 __container.innerHTML = data;
 else
 __container.innerHTML += data;
 if (utils.validation.misc.is_function(__success_callback))
 __success_callback.call(this, data);
 });
 }
 else
 run_bad_callbacks();
 });
 return null;
 };
 this.request = async function(url, data, method, success_callback, fail_callback, response_timeout, timeout_callback)
 {
 set_callbacks(success_callback, fail_callback, timeout_callback);
 run_timer(response_timeout);
 if (method === 'post' && !utils.validation.misc.is_object(data))
 __content_type = { 'Content-Type': 'application/x-www-form-urlencoded' };
 else
 __content_type = {};
 __ajax_response = await fetch(url, {
 method: method.toUpperCase(),
 mode: 'cors',
 cache: 'no-cache',
 credentials: 'same-origin',
 headers: __content_type,
 redirect: 'error',
 referrerPolicy: 'no-referrer',
 body: data
 });
 stop_timer(__timer_handler);
 if (__ajax_response.ok)
 {
 __ajax_response.text().then((data) =>
 {
 if (utils.validation.misc.is_function(__success_callback))
 __success_callback.call(this, data);
 });
 }
 else
 run_bad_callbacks();
 return null;
 };
 }
 this.run = function(user_config)
 {
 if (!config_parser.verify(config_definition_model, user_config))
 return false;
 if (utils.validation.misc.is_nothing(user_config.url) ||
 !utils.validation.misc.is_invalid(user_config.response_timeout) &&
 (!utils.validation.numerics.is_integer(user_config.response_timeout) ||
 user_config.response_timeout < 1 || user_config.response_timeout > 60000))
 return false;
 if (utils.validation.misc.is_invalid(user_config.data))
 user_config.data = null;
 if (window.fetch)
 {
 if (user_config.type === 'data') // [AJAX Data] => Modes: Asynchronous / Methods: POST
 {
 if (utils.validation.misc.is_invalid(user_config.data) ||
 !utils.validation.misc.is_invalid(user_config.method) || !utils.validation.misc.is_invalid(user_config.ajax_mode) ||
 !utils.objects.by_id(user_config.element_id) || utils.validation.misc.is_invalid(user_config.content_fill_mode))
 return false;
 return new ajax_core().data(user_config.url, user_config.data, user_config.element_id, user_config.content_fill_mode,
 user_config.on_success, user_config.on_fail,
 user_config.response_timeout, user_config.on_timeout);
 }
 else // [AJAX Request] => Modes: Asynchronous, Synchronous / Methods: GET, POST
 {
 if (user_config.ajax_mode === 'asynchronous') // Fetch => Asynchronous mode
 {
 if (utils.validation.misc.is_invalid(user_config.ajax_mode))
 return false;
 if (utils.validation.misc.is_invalid(user_config.method))
 user_config.method = 'get';
 else
 user_config.method = user_config.method.toLowerCase();
 return new ajax_core().request(user_config.url, user_config.data, user_config.method,
 user_config.on_success, user_config.on_fail,
 user_config.response_timeout, user_config.on_timeout);
 }
 else // BULL => Synchronous mode
 return new bull().run(user_config);
 }
 }
 else
 return new bull().run(user_config);
 };
 var config_definition_model = null,
 utils = new vulcan(),
 config_parser = new jap();
 init_config();
}
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
 function http_method_model()
 {
 this.GET = 'get';
 this.POST = 'post';
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
 this.http_method = new http_method_model();
 this.ajax_mode = new ajax_mode_model();
 this.content_fill_mode = new content_fill_mode_model();
 this.repeat = new repeat_model();
 }
 function misc_group()
 {
 this.IGNORE = -1;
 this.MAX_PRIORITY = Number.MAX_SAFE_INTEGER;
 this.MAX_LATENCY = 60000;
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
 this.priority = -1;
 this.qos = null;
 this.repeat = null;
 this.delay = -1;
 this.canceled = false;
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
 'priority', 'qos', 'repeat', 'delay'];
 }
 function callbacks_group()
 {
 return ['success', 'fail', 'timeout'];
 }
 function qos_group()
 {
 return ['latency', 'bandwidth'];
 }
 function range_group()
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
 this.range = new range_group();
 this.repeat = new repeat_group();
 }
 function sys_tools_class()
 {
 var __index = 0,
 __entry = null;
 function factory_model()
 {
 this.test_init = function()
 {
 if (is_init === false)
 {
 sensei('Aether', 'The scheduler is not running!');
 return false;
 }
 return true;
 };
 this.check_task_id = function(func, task_id)
 {
 if (!utils.validation.misc.is_undefined(task_id))
 {
 if (utils.validation.numerics.is_number(task_id) && task_id > 0)
 {
 var __entry = null;
 for (__entry in system_models.tasks.list)
 {
 if (system_models.tasks.list[__entry].id === task_id)
 {
 if (func === 'cancel')
 {
 system_models.tasks.list[__entry].canceled = true;
 return true;
 }
 else
 return system_models.tasks.list[__entry];
 }
 }
 return false;
 }
 else
 {
 sensei('Aether', 'Invalid task ID!');
 return false;
 }
 }
 else
 {
 if (func === 'cancel')
 {
 is_init = false;
 scheduler.stop();
 repetitive_scheduler.stop();
 return true;
 }
 else
 return system_models.tasks.list;
 }
 };
 this.config_verification = function(main_config)
 {
 var __factory_map = [];
 __factory_map.push(['main', config_definition_models['main'], main_config]);
 __factory_map.push(['settings', config_definition_models['settings'], main_config.settings]);
 __factory_map.push(['tasks', config_definition_models['tasks'], main_config.tasks]);
 for (__index = 0; __index < __factory_map.length; __index++)
 {
 if (!config_parser.verify(__factory_map[__index][1], __factory_map[__index][2]))
 return false;
 if (__index === 2)
 {
 var __record = 0,
 __option = 0,
 __object_options = ['callbacks', 'qos', 'latency', 'bandwidth', 'repeat'],
 __object_exceptions = ['latency', 'bandwidth'],
 __task_option_config = null;
 for (__record = 0; __record < __factory_map[__index][2].length; __record++)
 {
 for (__entry in __factory_map[__index][2][__record])
 {
 for (__option in __object_options)
 {
 if (!utils.validation.misc.is_undefined(main_config.tasks[__record]['qos']) &&
 utils.misc.contains(__object_options[__option], __object_exceptions))
 {
 __task_option_config = main_config.tasks[__record]['qos'][__object_options[__option]];
 if (utils.validation.misc.is_undefined(__task_option_config))
 continue;
 }
 else
 {
 if (utils.validation.misc.is_undefined(main_config.tasks[__record][__object_options[__option]]))
 continue;
 __task_option_config = main_config.tasks[__record][__object_options[__option]];
 }
 __factory_map.push([__object_options[__option],
 config_definition_models[__object_options[__option]],
 __task_option_config]);
 if (!config_parser.verify(__factory_map[3][1], __factory_map[3][2]))
 return false;
 __factory_map.pop();
 }
 }
 }
 }
 }
 __factory_map = [];
 return true;
 };
 this.range_validator = function(range_values, check)
 {
 if ((range_values[0] === system_constants.misc.IGNORE && range_values[1] === system_constants.misc.IGNORE) ||
 (range_values[0] !== system_constants.misc.IGNORE && range_values[0] < 1) ||
 (range_values[1] !== system_constants.misc.IGNORE && (range_values[1] > system_constants.misc[check] || range_values[1] <= range_values[0])))
 {
 system_tools.reset();
 sensei('Aether', 'Range validation error!');
 return false;
 }
 return true;
 };
 this.ajax_task_set = function(task)
 {
 var __this_task = task.args,
 __task_type = task.type,
 __task_repeat = task.repeat,
 __task_qos = task.qos,
 __task_latency = null,
 __task_bandwidth = null,
 __index = 0,
 __ajax_config = {
 "type" : __task_type,
 "url" : __this_task.url,
 "data" : __this_task.data,
 "response_timeout" : __this_task.response_timeout
 },
 __ajax = new bull();
 function ajax_call()
 {
 if (__task_type === 'data')
 {
 __ajax_config.element_id = __this_task.element_id;
 __ajax_config.content_fill_mode = __this_task.content_fill_mode;
 __ajax_config.on_success = __this_task.success_callback;
 __ajax_config.on_fail = __this_task.fail_callback;
 __ajax_config.on_timeout = __this_task.timeout_callback;
 }
 else
 {
 __ajax_config.method = __this_task.method;
 __ajax_config.ajax_mode = __this_task.ajax_mode;
 __ajax_config.on_success = __this_task.success_callback;
 __ajax_config.on_fail = __this_task.fail_callback;
 __ajax_config.on_timeout = __this_task.timeout_callback;
 }
 __ajax.run(__ajax_config);
 }
 function ajax_prepare_delegate()
 {
 if (!utils.validation.misc.is_invalid(__task_repeat))
 {
 if (__task_repeat.mode === system_constants.tasks.repeat.SERIAL)
 {
 if (__task_repeat.times === -1)
 setInterval(function() { ajax_call(); }, __this_task.response_timeout);
 else
 {
 for (__index = 0; __index < (__task_repeat.times + 1); __index++)
 setTimeout(function() { ajax_call(); }, __this_task.response_timeout);
 }
 }
 else
 {
 if (__task_repeat.times === -1)
 setInterval(function() { ajax_call(); }, 1);
 else
 {
 for (__index = 0; __index < (__task_repeat.times + 1); __index++)
 ajax_call();
 }
 }
 }
 else
 ajax_call();
 }
 if (task.canceled)
 return;
 if (!utils.validation.misc.is_invalid(__task_qos))
 {
 __task_latency = __task_qos.latency;
 __task_bandwidth = __task_qos.bandwidth;
 if (!utils.validation.misc.is_invalid(__task_bandwidth))
 {
 var __ajax_bandwidth = 0;
 if (!utils.validation.misc.is_nothing(__this_task.data))
 __ajax_bandwidth = __this_task.data.length;
 else
 __ajax_bandwidth = __task_bandwidth.min;
 if ((__task_bandwidth.min !== system_constants.misc.IGNORE && __ajax_bandwidth < __task_bandwidth.min) ||
 (__task_bandwidth.max !== system_constants.misc.IGNORE && __ajax_bandwidth > __task_bandwidth.max))
 {
 sensei('Aether', 'Task ID: ' + task.id + '\nOff-range bandwidth: ' + __ajax_bandwidth + ' bytes');
 return;
 }
 }
 if (!utils.validation.misc.is_invalid(__task_latency))
 {
 var __qos_ajax_config = {
 "type" : "request",
 "url" : __this_task.url,
 "data" : __this_task.data,
 "method" : __this_task.method,
 "ajax_mode" : "asynchronous"
 },
 __ping_tester = new centurion();
 __qos_ajax_config.on_success = function()
 {
 __ping_tester.benchmark.end();
 var __ajax_latency = __ping_tester.benchmark.latency();
 if (((__task_latency.min !== system_constants.misc.IGNORE && __ajax_latency >= __task_latency.min) &&
 (__task_latency.max !== system_constants.misc.IGNORE && __ajax_latency <= __task_latency.max)) ||
 (__task_latency.max === system_constants.misc.IGNORE && __ajax_latency >= __task_latency.min) ||
 (__task_latency.min === system_constants.misc.IGNORE && __ajax_latency <= __task_latency.max))
 ajax_prepare_delegate();
 else
 {
 sensei('Aether', 'Task ID: ' + task.id + '\nOff-range latency: ' + __ajax_latency + ' ms');
 return;
 }
 };
 __ping_tester.benchmark.start();
 __ajax.run(__qos_ajax_config);
 }
 else
 ajax_prepare_delegate();
 }
 else
 ajax_prepare_delegate();
 };
 }
 this.init_config_definition_models = function()
 {
 config_definition_models['main'] = { "arguments" : [
 {
 "key" : { "name" : "settings", "optional" : false },
 "value" : { "type" : "object" }
 },
 {
 "key" : { "name" : "tasks", "optional" : false },
 "value" : { "type" : "array" }
 }
 ]
 };
 config_definition_models['settings'] = { "arguments" : [
 {
 "key" : { "name" : "chain_mode", "optional" : false },
 "value" : {
 "type" : "string",
 "choices" : [
 system_constants.settings.chain_mode.SERIAL,
 system_constants.settings.chain_mode.PARALLEL,
 system_constants.settings.chain_mode.DELAY,
 system_constants.settings.chain_mode.CALLBACK
 ]
 }
 },
 {
 "key" : { "name" : "init_delay", "optional" : true },
 "value" : { "type" : "number" }
 },
 {
 "key" : { "name" : "interval", "optional" : true },
 "value" : { "type" : "number" }
 },
 {
 "key" : { "name" : "optional_task_callbacks", "optional" : true },
 "value" : { "type" : "boolean" }
 },
 {
 "key" : { "name" : "scheduler_callback", "optional" : true },
 "value" : { "type" : "function" }
 }
 ]
 };
 config_definition_models['tasks'] = { "arguments" : [
 {
 "key" : { "name" : "type", "optional" : false },
 "value" : {
 "type" : "string",
 "choices" : [
 system_constants.tasks.type.DATA,
 system_constants.tasks.type.REQUEST
 ]
 }
 },
 {
 "key" : { "name" : "url", "optional" : false },
 "value" : { "type" : "string" }
 },
 {
 "key" : { "name" : "data", "optional" : true },
 "value" : { "type" : "string" }
 },
 {
 "key" : { "name" : "callbacks", "optional" : false },
 "value" : { "type" : "object" }
 },
 {
 "key" : { "name" : "response_timeout", "optional" : false },
 "value" : { "type" : "number" }
 },
 {
 "key" : { "name" : "method", "optional" : true },
 "value" : {
 "type" : "string",
 "choices" : [
 system_constants.tasks.http_method.GET,
 system_constants.tasks.http_method.POST
 ]
 }
 },
 {
 "key" : { "name" : "ajax_mode", "optional" : true },
 "value" : {
 "type" : "string",
 "choices" : [
 system_constants.tasks.ajax_mode.ASYNCHRONOUS,
 system_constants.tasks.ajax_mode.SYNCHRONOUS
 ]
 }
 },
 {
 "key" : { "name" : "element_id", "optional" : true },
 "value" : { "type" : "string" }
 },
 {
 "key" : { "name" : "content_fill_mode", "optional" : true },
 "value" : {
 "type" : "string",
 "choices" : [
 system_constants.tasks.content_fill_mode.REPLACE,
 system_constants.tasks.content_fill_mode.APPEND
 ]
 }
 },
 {
 "key" : { "name" : "priority", "optional" : true },
 "value" : { "type" : "number" }
 },
 {
 "key" : { "name" : "qos", "optional" : true },
 "value" : { "type" : "object" }
 },
 {
 "key" : { "name" : "repeat", "optional" : true },
 "value" : { "type" : "object" }
 },
 {
 "key" : { "name" : "delay", "optional" : true },
 "value" : { "type" : "number" }
 }
 ]
 };
 config_definition_models['callbacks'] = { "arguments" : [
 {
 "key" : { "name" : "success", "optional" : false },
 "value" : { "type" : "function" }
 },
 {
 "key" : { "name" : "fail", "optional" : true },
 "value" : { "type" : "function" }
 },
 {
 "key" : { "name" : "timeout", "optional" : true },
 "value" : { "type" : "function" }
 }
 ]
 };
 config_definition_models['qos'] = { "arguments" : [
 {
 "key" : { "name" : "latency", "optional" : true },
 "value" : { "type" : "object" }
 },
 {
 "key" : { "name" : "bandwidth", "optional" : true },
 "value" : { "type" : "object" }
 }
 ]
 };
 config_definition_models['latency'] = { "arguments" : [
 {
 "key" : { "name" : "min", "optional" : false },
 "value" : { "type" : "number" }
 },
 {
 "key" : { "name" : "max", "optional" : false },
 "value" : { "type" : "number" }
 }
 ]
 };
 config_definition_models['bandwidth'] = { "arguments" : [
 {
 "key" : { "name" : "min", "optional" : false },
 "value" : { "type" : "number" }
 },
 {
 "key" : { "name" : "max", "optional" : false },
 "value" : { "type" : "number" }
 }
 ]
 };
 config_definition_models['repeat'] = { "arguments" : [
 {
 "key" : { "name" : "times", "optional" : false },
 "value" : { "type" : "number" }
 },
 {
 "key" : { "name" : "mode", "optional" : false },
 "value" : {
 "type" : "string",
 "choices" : [
 system_constants.tasks.repeat.SERIAL,
 system_constants.tasks.repeat.PARALLEL
 ]
 }
 }
 ]
 };
 };
 this.verify_config = function(main_config)
 {
 if (!utils.validation.misc.is_object(main_config)||
 !main_config.hasOwnProperty('settings') || !main_config.hasOwnProperty('tasks') ||
 !utils.validation.misc.is_object(main_config.settings) || !utils.validation.misc.is_object(main_config.tasks))
 {
 sensei('Aether', 'Invalid configuration!');
 return false;
 }
 return system_tools.factory.config_verification(main_config);
 };
 this.load_settings = function(settings_config)
 {
 var __options_map = system_config_keywords.settings;
 for (__entry in __options_map)
 {
 if (settings_config.hasOwnProperty(__options_map[__entry]))
 {
 if (__options_map[__entry] === 'init_delay' || __options_map[__entry] === 'interval')
 {
 if (settings_config[__options_map[__entry]] < 1 ||
 settings_config[__options_map[__entry]] > system_constants.misc.MAX_DELAY)
 {
 __options_map = [];
 sensei('Aether', 'Invalid range for "' + __options_map[__entry] + '" option!');
 return false;
 }
 }
 system_models.settings[__options_map[__entry]] = settings_config[__options_map[__entry]];
 }
 }
 if (settings_config.chain_mode === system_constants.settings.chain_mode.SERIAL)
 is_serial_chain_mode = true;
 if (settings_config.chain_mode === system_constants.settings.chain_mode.DELAY)
 is_delay_chain_mode = true;
 is_optional_task_callbacks = settings_config.optional_task_callbacks;
 __options_map = [];
 return true;
 };
 this.load_tasks = function(tasks_config)
 {
 var __this_config_task = null,
 __new_task = null,
 __option = null,
 __tasks_response_timeout_sum = 0,
 __tasks_delay_sum = 0,
 __same_priorities_num = 0,
 __is_async_warning_set = false,
 __task_id_gen = new pythia(),
 __task_priority_gen = new pythia();
 for (__index = 0; __index < tasks_config.length; __index++)
 {
 __this_config_task = tasks_config[__index];
 __new_task = system_models.generate_task();
 __new_task.id = __task_id_gen.generate();
 __new_task.type = __this_config_task.type;
 if (__this_config_task.type === system_constants.tasks.type.DATA)
 {
 if (!__this_config_task.hasOwnProperty('data') ||
 !__this_config_task.hasOwnProperty('element_id') || !__this_config_task.hasOwnProperty('content_fill_mode') ||
 __this_config_task.hasOwnProperty('method')|| __this_config_task.hasOwnProperty('ajax_mode'))
 {
 system_tools.reset();
 sensei('Aether', 'Task type: "data" requires fields: "data", "element_id" and\n"content_fill_mode" to operate!');
 return false;
 }
 }
 else
 {
 if (!__this_config_task.hasOwnProperty('method') || !__this_config_task.hasOwnProperty('ajax_mode') ||
 __this_config_task.hasOwnProperty('element_id') || __this_config_task.hasOwnProperty('content_fill_mode'))
 {
 system_tools.reset();
 sensei('Aether', 'Task type: "request" requires fields: "method" and\n"ajax_mode" to operate!');
 return false;
 }
 }
 if (utils.validation.misc.is_nothing(__this_config_task.url))
 {
 system_tools.reset();
 sensei('Aether', 'Field: "url" can\'t be empty!');
 return false;
 }
 __new_task.url = __this_config_task.url;
 if (!__this_config_task.hasOwnProperty('data'))
 __new_task.data = '1';
 else
 {
 if (!utils.validation.misc.is_nothing(__this_config_task.data))
 __new_task.data = __this_config_task.data;
 else
 __new_task.data = '1';
 }
 if (__this_config_task.response_timeout < 1 || __this_config_task.response_timeout > system_constants.misc.MAX_DELAY)
 {
 system_tools.reset();
 sensei('Aether', 'Invalid range for "response_timeout" option!');
 return false;
 }
 __new_task.response_timeout = __this_config_task.response_timeout;
 __tasks_response_timeout_sum += __new_task.response_timeout;
 var __callbacks_found = 0;
 for (__option in tasks_config[__index].callbacks)
 __callbacks_found++;
 if (!is_optional_task_callbacks && __callbacks_found < system_config_keywords.callbacks.length)
 {
 system_tools.reset();
 sensei('Aether', 'When "optional_task_callbacks" is set to false all task\ncallbacks have to be present!');
 return false;
 }
 __new_task.callbacks = __this_config_task.callbacks;
 if (__this_config_task.hasOwnProperty('method'))
 __new_task.method = __this_config_task.method;
 if (__this_config_task.hasOwnProperty('ajax_mode'))
 {
 __new_task.ajax_mode = __this_config_task.ajax_mode;
 if (__this_config_task.ajax_mode === system_constants.tasks.ajax_mode.SYNCHRONOUS)
 {
 if (!__is_async_warning_set)
 {
 __is_async_warning_set = true;
 sensei('Aether', 'Warning: Use of synchronous AJAX causes unexpected\nscheduling in various cases!');
 }
 }
 }
 if (__this_config_task.hasOwnProperty('element_id'))
 {
 if (!utils.objects.by_id(__this_config_task.element_id))
 {
 system_tools.reset();
 sensei('Aether', 'Field: "element_id" does not point to an existing element!');
 return false;
 }
 __new_task.element_id = __this_config_task.element_id;
 }
 if (__this_config_task.hasOwnProperty('content_fill_mode'))
 __new_task.content_fill_mode = __this_config_task.content_fill_mode;
 if (__this_config_task.hasOwnProperty('priority'))
 {
 if (__this_config_task.priority < 1 || __this_config_task.priority > system_constants.misc.MAX_PRIORITY)
 {
 system_tools.reset();
 sensei('Aether', 'Unsupported value for "priority" option!');
 return false;
 }
 __new_task.priority = __this_config_task.priority;
 }
 else
 __new_task.priority = __task_priority_gen.generate();
 if (__this_config_task.hasOwnProperty('qos'))
 {
 var __qos = __this_config_task.qos,
 __range_values = [],
 __check = null;
 for (__option in __qos)
 {
 if (utils.misc.contains(__option, system_config_keywords.qos))
 {
 __range_values = [__qos[__option].min, __qos[__option].max];
 if (__option === 'latency')
 __check = 'MAX_LATENCY';
 else
 __check = 'MAX_BANDWIDTH';
 if (!system_tools.factory.range_validator(__range_values, __check))
 {
 system_tools.reset();
 sensei('Aether', 'Invalid range for "' + __option + '" option!');
 return false;
 }
 }
 }
 __new_task.qos = __qos;
 }
 if (__this_config_task.hasOwnProperty('repeat'))
 {
 for (__entry in __this_config_task.repeat)
 {
 if (__entry === 'times' && __this_config_task.repeat[__entry] < 1 &&
 __this_config_task.repeat[__entry] !== system_constants.misc.IGNORE)
 {
 system_tools.reset();
 sensei('Aether', 'Unsupported value for "' + __entry + '" option!');
 return false;
 }
 }
 __new_task.repeat = __this_config_task.repeat;
 }
 if (is_delay_chain_mode && !__this_config_task.hasOwnProperty('delay'))
 {
 system_tools.reset();
 sensei('Aether', 'When "chain_mode" is set to delay all tasks must have the\n"delay" option!');
 return false;
 }
 if (__this_config_task.hasOwnProperty('delay'))
 {
 if (is_serial_chain_mode || __this_config_task.delay < 1 || __this_config_task.delay > system_constants.misc.MAX_DELAY)
 {
 system_tools.reset();
 if (is_serial_chain_mode)
 sensei('Aether', 'Invalid use of the "delay" option when "chain_mode"\nis set to serial!');
 else
 sensei('Aether', 'Invalid range for "delay" option!');
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
 sensei('Aether', 'Unable to sort tasks!');
 return false;
 }
 if (system_models.settings.interval !== -1 &&
 ((system_models.settings.chain_mode === system_constants.settings.chain_mode.DELAY ||
 system_models.settings.chain_mode === system_constants.settings.chain_mode.CALLBACK) &&
 __tasks_delay_sum > system_models.settings.interval))
 {
 sensei('Aether', 'Warning: Scheduler loop interval is lower than the sum\nof delay in tasks. ' +
 'This may lead to strange\nbehaviour due to the asynchronous nature of AJAX!');
 }
 if (system_models.settings.interval !== -1 &&
 ((system_models.settings.chain_mode === system_constants.settings.chain_mode.SERIAL ||
 system_models.settings.chain_mode === system_constants.settings.chain_mode.CALLBACK) &&
 __tasks_response_timeout_sum > system_models.settings.interval))
 {
 sensei('Aether', 'Warning: Scheduler loop interval is lower than the sum\nof response time outs in tasks. ' +
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
 'Please consider providing distinct priorities for\nbetter scheduling!');
 }
 return true;
 };
 this.process_tasks = function(process_callback)
 {
 var __index = 0,
 __this_task = null,
 __all_tasks = system_models.tasks.list,
 __modes_list = system_constants.settings.chain_mode,
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
 system_tools.factory.ajax_task_set(__task_entry);
 if (mode === __modes_list.SERIAL || mode === __modes_list.DELAY)
 repeater_delegate(mode, index);
 }
 else
 {
 setTimeout(function()
 {
 system_tools.factory.ajax_task_set(__task_entry);
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
 repeater(mode);
 }
 for (__index in __all_tasks)
 {
 __this_task = __all_tasks[__index];
 __task_config_map = {
 "id" : __this_task.id,
 "type" : __this_task.type,
 "priority" : __this_task.priority,
 "args" : {
 "url" : __this_task.url,
 "data" : __this_task.data,
 "success_callback" : __this_task.callbacks.success,
 "fail_callback" : __this_task.callbacks.fail,
 "response_timeout" : __this_task.response_timeout,
 "timeout_callback" : __this_task.callbacks.timeout
 },
 "repeat" : __this_task.repeat,
 "qos" : __this_task.qos,
 "canceled" : __this_task.canceled
 };
 if (__this_task.type === system_constants.tasks.type.DATA)
 {
 __task_config_map.args.element_id = __this_task.element_id;
 __task_config_map.args.content_fill_mode = __this_task.content_fill_mode;
 }
 else
 __task_config_map.args.ajax_mode = __this_task.ajax_mode;
 __scheduled_tasks_list.push([__task_config_map, __this_task.delay]);
 }
 go(system_models.settings.chain_mode, __scheduled_tasks_list);
 };
 this.run = function()
 {
 function do_tasks()
 {
 if (system_models.settings.interval === -1)
 system_tools.process_tasks();
 else
 {
 system_tools.process_tasks(function()
 {
 repetitive_scheduler.start(system_models.settings.interval,
 system_tools.process_tasks, false);
 });
 }
 }
 if (system_models.settings.init_delay === -1)
 do_tasks();
 else
 scheduler.start(system_models.settings.init_delay, do_tasks, true);
 return true;
 };
 this.reset = function()
 {
 is_init = false;
 config_definition_models = [];
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
 if (is_init === true ||
 !system_tools.verify_config(json_config) ||
 !system_tools.load_settings(json_config.settings) ||
 !system_tools.load_tasks(json_config.tasks) ||
 !system_tools.run())
 return false;
 is_init = true;
 config_definition_models = [];
 return true;
 };
 this.cancel = function(task_id)
 {
 if (!system_tools.factory.test_init())
 return false;
 return system_tools.factory.check_task_id('cancel', task_id);
 };
 this.status = function(task_id)
 {
 if (!system_tools.factory.test_init())
 return false;
 return system_tools.factory.check_task_id('status', task_id);
 };
 this.constants = function()
 {
 return system_constants;
 };
 var is_init = false,
 is_serial_chain_mode = false,
 is_delay_chain_mode = false,
 is_optional_task_callbacks = false,
 config_definition_models = [],
 system_constants = new sys_constants_class(),
 system_models = new sys_models_class(),
 system_config_keywords = new config_keywords_class(),
 system_tools = new sys_tools_class(),
 config_parser = new jap(),
 scheduler = new stopwatch(),
 repetitive_scheduler = new stopwatch(),
 utils = new vulcan();
 init();
}
function armadillo()
{
 function data_repo_model()
 {
 this.db_container = []; // DB container
 this.selected_db = null; // Selected DB
 this.selected_record = null; // Selected record
 }
 function helpers_model()
 {
 this.init_storage = function()
 {
 var __container = localStorage.getItem('armadillo');
 if (!__container)
 localStorage.setItem('armadillo', JSON.stringify([]));
 data_repo.db_container = JSON.parse(__container);
 if (self.log_enabled)
 sensei('Armadillo', 'Storage has been initialized!');
 return null;
 };
 this.empty_storage = function()
 {
 data_repo.db_container = [];
 data_repo.selected_db = null;
 data_repo.selected_record = null;
 localStorage.clear();
 if (self.log_enabled)
 sensei('Armadillo', 'Storage is now empty!');
 return null;
 };
 this.db_name_exists = function(name, db_array)
 {
 var __this_name = null;
 for (__this_name in db_array)
 {
 if (__this_name == name)
 return true;
 }
 return false;
 };
 this.duplicates_exist = function(mode, attribute)
 {
 if (mode === 'db')
 {
 if (helpers.db_name_exists(attribute, data_repo.db_container))
 {
 if (self.log_enabled)
 sensei('Armadillo', 'A DB with the same name exists!');
 return true;
 }
 }
 else if (mode === 'record')
 {
 return helpers.super_iterator([attribute], function()
 {
 if (self.log_enabled)
 sensei('Armadillo', 'A record with the same ID exists!');
 return true;
 });
 }
 return false;
 };
 this.generate_record_uid = function()
 {
 var __uid = rnd_gen.generate();
 if (helpers.duplicates_exist('record', __uid))
 {
 var __index = 0,
 __this_db = data_repo.db_container[data_repo.selected_db],
 __records_length = __this_db.length;
 __existing_id_array = [];
 for (__index = 0; __index < __records_length; __index++)
 __existing_id_array.push(__this_db[__index].id);
 rnd_gen.load(__existing_id_array);
 __uid = rnd_gen.generate();
 }
 return __uid;
 };
 this.db_exists = function(db_name)
 {
 if (!utils.validation.alpha.is_string(db_name))
 return false;
 if (helpers.db_name_exists(db_name, data_repo.db_container))
 return true;
 if (self.log_enabled)
 sensei('Armadillo', 'DB does not exist!');
 return false;
 };
 this.super_iterator = function(values, exec_code)
 {
 var __index = 0,
 __this_db = data_repo.db_container[data_repo.selected_db],
 __records_length = __this_db.length;
 for (__index = 0; __index < __records_length; __index++)
 {
 if (__this_db[__index].id == values[0])
 return exec_code.call(this, [__index, __this_db, values[1]]);
 }
 return false;
 };
 }
 function db_context()
 {
 this.set = function(db_name)
 {
 if (helpers.db_exists(db_name))
 return false;
 data_repo.db_container[db_name] = [];
 data_repo.selected_db = db_name;
 data_repo.selected_record = null;
 localStorage.setItem('armadillo', JSON.stringify(data_repo.db_container));
 return true;
 };
 this.get = function(db_name)
 {
 if (!utils.validation.misc.is_invalid(db_name) && !helpers.db_exists(db_name))
 return false;
 data_repo.selected_record = null;
 if (utils.validation.misc.is_invalid(db_name))
 {
 if (data_repo.selected_db === null)
 return false;
 return data_repo.db_container[data_repo.selected_db];
 }
 else
 return data_repo.db_container[db_name];
 };
 this.remove = function(db_name)
 {
 if (!helpers.db_exists(db_name))
 return false;
 var __db_name = null,
 __new_db_container = null;
 for (__db_name in data_repo.db_container)
 {
 if (__db_name != db_name)
 __new_db_container[__db_name] = data_repo.db_container[db_name];
 }
 data_repo.db_container = __new_db_container;
 data_repo.selected_db = null;
 data_repo.selected_record = null;
 localStorage.setItem('armadillo', JSON.stringify(data_repo.db_container));
 return true;
 };
 this.use = function(db_name)
 {
 if (!helpers.db_exists(db_name))
 return false;
 data_repo.selected_db = db_name;
 data_repo.selected_record = null;
 return true;
 };
 }
 function records_context()
 {
 this.insert = function(record)
 {
 if (data_repo.selected_db === null || !utils.validation.misc.is_object(record) || record.hasOwnProperty('id'))
 return false;
 record.id = helpers.generate_record_uid();
 data_repo.db_container[data_repo.selected_db].push(record);
 data_repo.selected_record = record;
 localStorage.setItem('armadillo', JSON.stringify(data_repo.db_container));
 return true;
 };
 this.select = function(record_id)
 {
 if (data_repo.selected_db === null || !utils.validation.numerics.is_number(record_id))
 return false;
 return helpers.super_iterator([record_id], function(env)
 {
 data_repo.selected_record = env[1][env[0]];
 return data_repo.selected_record;
 });
 };
 this.fetch = function()
 {
 if (data_repo.selected_db === null)
 return false;
 data_repo.selected_record = null;
 return data_repo.db_container[data_repo.selected_db];
 };
 this.save = function(record)
 {
 if (data_repo.selected_db === null ||
 !utils.validation.misc.is_object(record) || !record.hasOwnProperty('id') ||
 !helpers.duplicates_exist('record', record.id))
 return false;
 return helpers.super_iterator([record.id, record], function(env)
 {
 env[1][env[0]] = env[2];
 data_repo.db_container[data_repo.selected_db] = env[1];
 data_repo.selected_record = env[1][env[0]];
 localStorage.setItem('armadillo', JSON.stringify(data_repo.db_container));
 return true;
 });
 };
 this.delete = function(record_id)
 {
 if (data_repo.selected_db === null || !utils.validation.numerics.is_number(record_id))
 return false;
 return helpers.super_iterator([record_id], function(env)
 {
 env[1].splice(env[0], 1);
 data_repo.selected_record = null;
 localStorage.setItem('armadillo', JSON.stringify(data_repo.db_container));
 return true;
 });
 };
 this.clear = function()
 {
 if (data_repo.selected_db === null)
 return false;
 data_repo.db_container[data_repo.selected_db] = [];
 data_repo.selected_record = null;
 localStorage.setItem('armadillo', JSON.stringify(data_repo.db_container));
 return true;
 };
 }
 this.reset = function()
 {
 helpers.empty_storage();
 return null;
 };
 function init()
 {
 if (typeof(Storage) === 'undefined')
 return false;
 helpers.init_storage();
 return true;
 }
 this.db = new db_context();
 this.records = new records_context();
 this.log_enabled = false;
 var self = this,
 data_repo = new data_repo_model(),
 helpers = new helpers_model(),
 utils = new vulcan(),
 rnd_gen = new pythia();
 init();
}
function fx()
{
 function element_validator(name, mode)
 {
 var __element = null;
 if (utils.validation.alpha.is_symbol(name) || !utils.validation.numerics.is_number(mode) || mode < 1 || mode > 4)
 return false;
 if (mode === 1)
 __element = utils.objects.by_id(name);
 else if (mode === 2)
 __element = utils.objects.by_class(name)[0];
 else if (mode === 3)
 __element = utils.objects.selectors.parent(name);
 else
 {
 if (utils.validation.misc.is_object(name))
 __element = name;
 }
 if (__element === null)
 return false;
 return __element;
 }
 function fade()
 {
 var __id = null,
 __step = 0.0,
 __speed = 0,
 __delay = 0;
 this.into = function(id, step, speed, delay, callback)
 {
 var __inc = 0,
 __interval_id = 0,
 __time_out = 0;
 if (utils.validation.misc.is_undefined(id) ||
 utils.validation.misc.is_undefined(step) ||
 utils.validation.misc.is_undefined(speed) ||
 utils.validation.misc.is_undefined(delay))
 return false;
 if (utils.validation.alpha.is_symbol(id) ||
 (!utils.validation.numerics.is_float(step) || step < 0.0 || step > 1.0) ||
 (!utils.validation.numerics.is_integer(speed) || speed < 0) ||
 (!utils.validation.numerics.is_integer(delay) || delay < 0))
 return false;
 __id = id;
 __step = step;
 __speed = speed;
 __delay = delay;
 function do_fade()
 {
 if (__inc === 0)
 {
 utils.objects.by_id(id).style.display = 'block';
 self.opacity.apply(id, 0.0);
 }
 if (__inc <= 1)
 {
 __inc += step;
 self.opacity.apply(id, __inc);
 }
 else
 {
 clearInterval(__interval_id);
 clearTimeout(__time_out);
 self.opacity.reset(id);
 if (utils.validation.misc.is_function(callback))
 callback.call();
 }
 return true;
 }
 function start_interval()
 {
 __interval_id = setInterval(function() { do_fade(); }, speed);
 return true;
 }
 function fire_timeout()
 {
 return setTimeout(function() { start_interval(); }, delay);
 }
 __time_out = fire_timeout();
 return true;
 };
 this.out = function(id, step, speed, delay, callback)
 {
 var __dec = 1,
 __interval_id = 0,
 __time_out = 0;
 if (utils.validation.misc.is_undefined(id) ||
 utils.validation.misc.is_undefined(step) ||
 utils.validation.misc.is_undefined(speed) ||
 utils.validation.misc.is_undefined(delay))
 return false;
 if (utils.validation.alpha.is_symbol(id) ||
 (!utils.validation.numerics.is_float(step) || step < 0.0 || step > 1.0) ||
 (!utils.validation.numerics.is_integer(speed) || speed < 0) ||
 (!utils.validation.numerics.is_integer(delay) || delay < 0))
 return false;
 __id = id;
 __step = step;
 __speed = speed;
 __delay = delay;
 function do_fade()
 {
 if (__dec === 1)
 self.opacity.reset(id);
 if (__dec >= 0)
 {
 __dec -= step;
 if (utils.objects.by_id(id) !== null)
 self.opacity.apply(id, __dec);
 }
 else
 {
 clearInterval(__interval_id);
 clearTimeout(__time_out);
 if (utils.objects.by_id(id) !== null)
 {
 utils.objects.by_id(id).style.display = 'none';
 self.opacity.apply(id, 0.0);
 }
 if (utils.validation.misc.is_function(callback))
 callback.call();
 }
 return true;
 }
 function start_interval()
 {
 __interval_id = setInterval(function() { do_fade(); }, speed);
 return true;
 }
 function fire_timeout()
 {
 return setTimeout(function() { start_interval(); }, delay);
 }
 __time_out = fire_timeout();
 return true;
 };
 this.reset = function()
 {
 __id = null;
 __step = 0.0;
 __speed = 0;
 __delay = 0;
 return true;
 };
 this.get = function(type)
 {
 if (type === 'id')
 return __id;
 else if (type === 'step')
 return __step;
 else if (type === 'speed')
 return __speed;
 else if (type === 'delay')
 return __delay;
 else
 return false;
 };
 }
 function opacity()
 {
 var __opacity = 1.0;
 this.apply = function(id, val)
 {
 if (utils.validation.alpha.is_symbol(id) || !utils.validation.numerics.is_float(val) || val < 0.0 || val > 1.0)
 return false;
 utils.objects.by_id(id).style.opacity = val;
 __opacity = val;
 return true;
 };
 this.reset = function(id)
 {
 if (utils.validation.alpha.is_symbol(id))
 return false;
 utils.objects.by_id(id).style.opacity = 1.0;
 __opacity = 1.0;
 return true;
 };
 this.get = function()
 {
 return __opacity;
 };
 }
 function animation()
 {
 this.swipe = function(name, mode, direction, distance, speed, step, callback)
 {
 var __element = element_validator(name, mode),
 __distance = 0,
 __last_step = 0,
 __interval = null,
 __interval_utility = new interval_model();
 if (__element === false)
 return false;
 if (!utils.validation.alpha.is_string(direction) ||
 !utils.validation.numerics.is_integer(distance) ||
 !utils.validation.numerics.is_integer(speed) ||
 !utils.validation.numerics.is_integer(step))
 return false;
 if (!utils.validation.misc.is_undefined(callback) && !utils.validation.misc.is_function(callback))
 return false;
 if (step >= distance)
 return false;
 function reverse_parameters()
 {
 distance = -distance;
 step = -step;
 return true;
 }
 function dynamic_logic(distance, direction, mode)
 {
 if (direction === 'up' || direction === 'left')
 {
 if (mode === 1)
 {
 if (__distance <= distance)
 return true;
 return false;
 }
 else if (mode === 2)
 {
 if (__distance < distance)
 return true;
 return false;
 }
 else
 return null;
 }
 else if (direction === 'down' || direction === 'right')
 {
 if (mode === 1)
 {
 if (__distance >= distance)
 return true;
 return false;
 }
 else if (mode === 2)
 {
 if (__distance > distance)
 return true;
 return false;
 }
 else
 return null;
 }
 return null;
 }
 function interval_model()
 {
 this.run = function(func, speed)
 {
 __interval = setInterval(function() { func.call(); }, speed);
 return true;
 };
 this.stop = function(interval_handler)
 {
 clearInterval(interval_handler);
 return true;
 };
 }
 function do_swipe(direction)
 {
 if (direction === 'up' || direction === 'down' || direction === 'left' || direction === 'right')
 {
 var __pos = null,
 __pos_val = 0;
 if (direction === 'up' || direction === 'down')
 {
 __pos = 'top';
 __pos_val = utils.graphics.pixels_value(__element.style.top);
 }
 else
 {
 __pos = 'left';
 __pos_val = utils.graphics.pixels_value(__element.style.left);
 }
 if (direction === 'up' || direction === 'left')
 reverse_parameters();
 __interval_utility.run(function()
 {
 __distance = __distance + step;
 if (dynamic_logic(distance, direction, 1))
 {
 if (dynamic_logic(distance, direction, 2))
 {
 __last_step = distance - (__distance - step);
 __element.style[__pos] = __pos_val + (__distance - step) + __last_step + 'px';
 }
 else
 __element.style[__pos] = __pos_val + __distance + 'px';
 __interval_utility.stop(__interval);
 if (!utils.validation.misc.is_undefined(callback))
 callback.call();
 }
 else
 __element.style[__pos] = __pos_val + __distance + 'px';
 }, speed);
 }
 else
 return false;
 }
 return do_swipe(direction);
 };
 this.slider = function(options)
 {
 if (!utils.validation.alpha.is_string(options.name) ||
 !utils.validation.numerics.is_integer(options.mode) ||
 !utils.validation.numerics.is_integer(options.step) ||
 !utils.validation.numerics.is_integer(options.speed) ||
 !utils.validation.misc.is_object(options.previous) ||
 !utils.validation.alpha.is_string(options.previous.name) ||
 !utils.validation.numerics.is_integer(options.previous.mode) ||
 !utils.validation.misc.is_object(options.next) ||
 !utils.validation.alpha.is_string(options.next.name) ||
 !utils.validation.numerics.is_integer(options.next.mode))
 return false;
 var __slider = element_validator(options.name, options.mode),
 __next = element_validator(options.next.name, options.next.mode),
 __previous = element_validator(options.previous.name, options.previous.mode),
 __first_child = __slider.firstChild,
 __last_child = __slider.lastChild,
 __slider_elements_count = __slider.childElementCount,
 __slider_wrapper = document.createElement('div'),
 __pos = null,
 __width = null,
 __height = null;
 if (!utils.validation.misc.is_undefined(options.circular) && !utils.validation.misc.is_bool(options.circular))
 return false;
 else
 options.circular = false;
 if (!utils.validation.misc.is_undefined(options.width))
 {
 if (!utils.validation.numerics.is_integer(options.width))
 return false;
 __width = options.width;
 }
 else
 __width = __slider.offsetWidth;
 if (!utils.validation.misc.is_undefined(options.height))
 {
 if (!utils.validation.numerics.is_integer(options.height))
 return false;
 __height = options.height;
 }
 else
 __height = __slider.offsetHeight;
 if (!utils.validation.misc.is_undefined(options.previous.callback) &&
 !utils.validation.misc.is_function(options.previous.callback))
 return false;
 if (!utils.validation.misc.is_undefined(options.next.callback) &&
 !utils.validation.misc.is_function(options.next.callback))
 return false;
 __slider_wrapper.className = 'slider_wrapper';
 __slider_wrapper.style.left = 'auto';
 __slider_wrapper.style.right = 'auto';
 __slider_wrapper.style.top = 'auto';
 __slider_wrapper.style.bottom = 'auto';
 __slider_wrapper.style.width = __width + 'px';
 __slider_wrapper.style.height = __height + 'px';
 __slider_wrapper.style.cssFloat = 'left';
 __slider_wrapper.style.overflow = 'hidden';
 __slider_wrapper.style.position = 'relative';
 __slider_wrapper.style.textAlign = 'start';
 __slider.style.top = '0px';
 __slider.style.left = '0px';
 __slider.style.right = 'auto';
 __slider.style.bottom = 'auto';
 __slider.style.width = (__width * __slider_elements_count) + 'px';
 __slider.style.height = __height + 'px';
 __slider.style.textAlign = 'left';
 __slider.style.cssFloat = 'left';
 __slider.style.margin = '0px';
 __slider.style.position = 'absolute';
 __slider.parentNode.insertBefore(__slider_wrapper, __slider);
 __slider_wrapper.appendChild(__slider);
 for (var i = 0; i < __slider_elements_count; i++)
 __slider.children[i].style.cssFloat = 'left';
 utils.events.attach(options.name, __previous, 'click',
 function()
 {
 var __last_element = __slider.children[__slider_elements_count - 1],
 __first_element = __slider.children[0];
 if (!options.circular && (__first_element === __first_child))
 return true;
 __slider.removeChild(__slider.children[__slider_elements_count - 1]);
 __slider.insertBefore(__last_element, __slider.children[0]);
 __slider.style.left = '-' + __width + 'px';
 var __interval = setInterval(function()
 {
 __pos = utils.graphics.pixels_value(__slider.style.left);
 if (__pos < -options.step)
 __slider.style.left = __pos + options.step + 'px';
 else
 {
 if (__pos === 0)
 {
 clearInterval(__interval);
 if (!utils.validation.misc.is_undefined(options.previous.callback))
 options.previous.callback.call();
 }
 else
 __slider.style.left = '0px';
 }
 }, options.speed);
 });
 utils.events.attach(options.name, __next, 'click',
 function()
 {
 var __first_element = __slider.children[0],
 __negative_width = -__width;
 if (!options.circular && (__first_element === __last_child))
 return true;
 __slider.style.left = '0px';
 var __interval = setInterval(function()
 {
 var __pos = utils.graphics.pixels_value(__slider.style.left);
 if (__negative_width + options.step < __pos)
 __slider.style.left = __pos - options.step + 'px';
 else
 {
 if (__pos === __negative_width)
 {
 __slider.removeChild(__slider.children[0]);
 __slider.insertBefore(__first_element,
 __slider.children[__slider_elements_count - 2].nextSibling);
 __slider.style.left = '0px';
 clearInterval(__interval);
 if (!utils.validation.misc.is_undefined(options.next.callback))
 options.next.callback.call();
 }
 else
 __slider.style.left = __negative_width + 'px';
 }
 }, options.speed);
 });
 };
 }
 function visibility()
 {
 this.is_visible = function(name, mode)
 {
 var __element = element_validator(name, mode);
 if (__element === false)
 return false;
 if (__element.style.display === 'none' || __element.style.display === '')
 return false;
 return true;
 };
 this.show = function(name, mode)
 {
 var __element = element_validator(name, mode);
 if (__element === false)
 return false;
 __element.style.display = 'block';
 return true;
 };
 this.hide = function(name, mode)
 {
 var __element = element_validator(name, mode);
 if (__element === false)
 return false;
 __element.style.display = 'none';
 return true;
 };
 this.toggle = function(name, mode)
 {
 var __element = element_validator(name, mode);
 if (__element === false)
 return false;
 if (__element.style.display === 'none' || __element.style.display === '')
 __element.style.display = 'block';
 else
 __element.style.display = 'none';
 return true;
 };
 }
 this.fade = new fade();
 this.opacity = new opacity();
 this.animation = new animation();
 this.visibility = new visibility();
 var self = this,
 utils = new vulcan();
}
function lava()
{
 function has_unknown_keywords(definition_model)
 {
 var __index = null,
 __attribute = null,
 __option = null;
 for (__index in definition_model)
 {
 __attribute = definition_model[__index];
 if (!utils.validation.misc.is_object(__attribute))
 {
 if (!utils.misc.contains(__index, def_keywords))
 return true;
 continue;
 }
 if ((utils.validation.misc.is_object(__attribute) && Object.getOwnPropertyNames(__attribute).length === 0) ||
 (utils.validation.misc.is_array(__attribute) && __attribute.length === 0))
 return true;
 for (__option in __attribute)
 {
 if (utils.validation.numerics.is_number(__option))
 continue;
 if (!utils.misc.contains(__option, def_keywords))
 return true;
 if (has_unknown_keywords(__attribute[__option]))
 return true;
 }
 }
 return false;
 }
 this.define = function(definition_model)
 {
 if (!utils.validation.misc.is_array(definition_model))
 {
 sensei('L.A.Va', 'Invalid definition model!');
 return false;
 }
 if (definition_model.length === 0)
 {
 sensei('L.A.Va', 'The definition model is null!');
 return false;
 }
 if (has_unknown_keywords(definition_model))
 {
 sensei('L.A.Va', 'The definition model contains unknown keywords\nor invalid values!');
 return false;
 }
 var __this_key = null,
 __this_value = null;
 is_model_defined = false;
 for (counter = 0; counter < definition_model.length; counter++)
 {
 if (!utils.validation.misc.is_object(definition_model[counter]))
 {
 sensei('L.A.Va', 'Invalid JSON object in the model!');
 return false;
 }
 if (!definition_model[counter].hasOwnProperty('key') || !definition_model[counter].hasOwnProperty('value'))
 {
 sensei('L.A.Va', 'Missing "key" or "value" mandatory attributes!');
 return false;
 }
 __this_key = definition_model[counter].key;
 __this_value = definition_model[counter].value;
 if (!utils.validation.misc.is_object(__this_key) || !utils.validation.misc.is_object(__this_value))
 {
 sensei('L.A.Va', 'A "key" or "value" attribute does not point to a JSON object!');
 return false;
 }
 if (!__this_key.hasOwnProperty('id') || !__this_key.hasOwnProperty('optional'))
 {
 sensei('L.A.Va', 'Missing "id" or "optional" mandatory properties!');
 return false;
 }
 if (!utils.validation.alpha.is_string(__this_key.id) || !utils.validation.misc.is_bool(__this_key.optional))
 {
 sensei('L.A.Va', 'Invalid specification for "id" or "optional" property!');
 return false;
 }
 if (utils.validation.misc.is_invalid(__this_key.id) || utils.objects.by_id(__this_key.id) === null)
 {
 sensei('L.A.Va', 'The "id" points to no HTML element!');
 return false;
 }
 if (!__this_value.hasOwnProperty('type'))
 {
 sensei('L.A.Va', 'Missing "type" mandatory property!');
 return false;
 }
 if (!utils.validation.alpha.is_string(__this_value.type) || !utils.misc.contains(__this_value.type, all_value_types))
 {
 sensei('L.A.Va', 'Invalid specification for "type" property!');
 return false;
 }
 if (__this_value.hasOwnProperty('choices'))
 {
 if (!utils.misc.contains(__this_value.type, types_with_choices))
 {
 sensei('L.A.Va', 'This type does not support the "choices" option!');
 return false;
 }
 if (!utils.validation.misc.is_array(__this_value.choices))
 {
 sensei('L.A.Va', 'The "choices" option has to be an array with at least\none element!');
 return false;
 }
 }
 if (__this_value.hasOwnProperty('length'))
 {
 if (utils.misc.contains(__this_value.type, uncountable_value_types))
 {
 sensei('L.A.Va', 'This type does not support the "length" option!');
 return false;
 }
 if (!utils.validation.numerics.is_integer(__this_value.length) || __this_value.length < 1)
 {
 sensei('L.A.Va', 'The "length" option has to be a positive integer!');
 return false;
 }
 }
 if (__this_value.hasOwnProperty('regex'))
 {
 if (utils.misc.contains(__this_value.type, uncountable_value_types) || __this_value.type === 'array')
 {
 sensei('L.A.Va', 'This type does not support the "regex" option!');
 return false;
 }
 if (utils.validation.misc.is_invalid(__this_value.regex))
 {
 sensei('L.A.Va', 'Invalid "regex" option!');
 return false;
 }
 }
 }
 is_model_defined = true;
 json_def_model = definition_model;
 return true;
 };
 this.validate = function()
 {
 if (!is_model_defined)
 {
 sensei('L.A.Va', 'No definition model was specified!');
 return false;
 }
 var __this_key = null,
 __this_value = null,
 __this_field = null,
 __keys_found = 0,
 __keys_optional = false;
 for (counter = 0; counter < json_def_model.length; counter++)
 {
 __this_key = json_def_model[counter].key;
 __this_field = utils.objects.by_id(__this_key.id);
 if (__this_field === null)
 {
 sensei('L.A.Va', 'Element: "' + __this_key.id + '" does not exist!');
 return false;
 }
 if (__this_key.optional === true)
 __keys_optional = true;
 __keys_found++;
 }
 if (__keys_found < json_def_model.length && __keys_optional === false)
 {
 sensei('L.A.Va', 'Defined non-optional elements differ from that on the page!');
 return false;
 }
 for (counter = 0; counter < json_def_model.length; counter++)
 {
 __this_key = json_def_model[counter].key;
 __this_value = json_def_model[counter].value;
 __this_field = utils.objects.by_id(__this_key.id);
 if (__this_field === null && __keys_optional === true)
 continue;
 if (__this_value.type !== '*')
 {
 if (__this_value.type === 'null')
 {
 if (__this_field.value !== null)
 {
 sensei('L.A.Va', 'Field: "' + __this_field.id + '" accepts only "null" values!');
 return false;
 }
 }
 else if (__this_value.type === 'number')
 {
 if (utils.validation.misc.is_nothing(__this_field.value.trim()) ||
 !utils.validation.numerics.is_number(Number(__this_field.value)))
 {
 sensei('L.A.Va', 'Field: "' + __this_field.id + '" accepts only numbers!');
 return false;
 }
 }
 else if (__this_value.type === 'array')
 {
 if (!utils.validation.misc.is_array(__this_field.value))
 {
 sensei('L.A.Va', 'Field: "' + __this_field.id + '" accepts only "array" values!');
 return false;
 }
 }
 else
 {
 if (typeof __this_field.value !== __this_value.type)
 {
 sensei('L.A.Va', 'Field: "' + __this_field.id + '" has a type mismatch!');
 return false;
 }
 }
 }
 if (__this_value.hasOwnProperty('choices'))
 {
 if (!utils.misc.contains(__this_field.value, __this_value.choices))
 {
 sensei('L.A.Va', 'Field: "' + __this_field.id + '" does not contain any defined choices!');
 return false;
 }
 }
 if (__this_value.hasOwnProperty('length'))
 {
 if ((__this_value.type === 'array' && __this_field.value.length > __this_value.length) ||
 (__this_value.type !== 'array' && __this_field.value.toString().length > __this_value.length))
 {
 sensei('L.A.Va', 'Field: "' + __this_field.id + '" exceeds the defined length!');
 return false;
 }
 }
 if (__this_value.hasOwnProperty('regex'))
 {
 if (!utils.validation.utilities.reg_exp(__this_value.regex, __this_field.value))
 {
 sensei('L.A.Va', 'Field: "' + __this_field.id + '" has not matched the specified regex!');
 return false;
 }
 }
 }
 return true;
 };
 this.verify = function(definition_model)
 {
 if (self.define(definition_model))
 return self.validate();
 return false;
 };
 var self = this,
 is_model_defined = false,
 counter = 0,
 json_def_model = null,
 def_keywords = ['key', 'value', 'id', 'optional', 'type', 'choices', 'length', 'regex'],
 all_value_types = ['number', 'string', 'boolean', 'array', 'object', 'function', 'null', '*'],
 uncountable_value_types = ['boolean', 'object', 'function', 'null', '*'],
 types_with_choices = ['number', 'string', 'array'],
 utils = new vulcan();
}
function task()
{
 var self = this;
 function task_model()
 {
 this.id = null;
 this.file = null;
 this.worker = null;
 }
 function task_manager_model()
 {
 this.create = function(worker_file)
 {
 var __new_worker = new Worker(worker_file);
 task.id = rnd_gen.generate(),
 task.file = worker_file;
 task.worker = __new_worker;
 is_task_created = true;
 return task.id;
 };
 this.destroy = function()
 {
 task.worker.terminate();
 is_task_created = false;
 return true;
 };
 this.message = function(any)
 {
 if (utils.validation.misc.is_function(any))
 task.worker.onmessage = function(e) { any.call(this, e); };
 else
 task.worker.postMessage(any);
 return true;
 };
 }
 function message()
 {
 this.receive = function(callback)
 {
 if (!utils.validation.misc.is_function(callback))
 return false;
 if (is_task_created === false)
 return false;
 return task_manager.message(callback);
 };
 this.send = function(data)
 {
 if (utils.validation.misc.is_invalid(data))
 return false;
 if (is_task_created === false)
 return false;
 return task_manager.message(data);
 };
 }
 this.id = function()
 {
 if (is_task_created === false)
 return false;
 return task.id;
 };
 this.create = function(worker_file)
 {
 if (utils.validation.misc.is_invalid(worker_file) || !utils.validation.alpha.is_string(worker_file))
 return false;
 if (is_task_created === true)
 return false;
 return task_manager.create(worker_file);
 };
 this.destroy = function()
 {
 if (is_task_created === false)
 return false;
 return task_manager.destroy();
 };
 function init()
 {
 if (utils.validation.misc.is_undefined(Worker))
 return false;
 return this;
 }
 var is_task_created = false,
 task = new task_model(),
 task_manager = new task_manager_model(),
 rnd_gen = new pythia(),
 utils = new vulcan();
 this.message = new message();
 init();
}
function parallel()
{
 var self = this;
 function tasks_manager_model()
 {
 function tasks_list_model()
 {
 this.num = 0;
 this.tasks = [];
 }
 function tasks_info()
 {
 this.num = function()
 {
 return tasks_list.num;
 };
 this.list = function(index)
 {
 if (utils.validation.misc.is_undefined(index))
 return tasks_list.tasks;
 else
 return tasks_list.tasks[index];
 };
 }
 this.create = function(worker_file)
 {
 var __new_task = new task(),
 __new_task_id = __new_task.create(worker_file);
 if (__new_task_id === false)
 return false;
 tasks_list.tasks.push(__new_task);
 tasks_list.num++;
 is_task_created = true;
 return __new_task_id;
 };
 this.destroy = function(task_id)
 {
 var __task = null;
 for (__index = 0; __index < tasks_list.num; __index++)
 {
 __task = tasks_list.tasks[__index];
 if (__task.id() === task_id)
 {
 tasks_list.tasks.splice(__index, 1);
 if (tasks_list.num === 0)
 is_task_created = false;
 return __task.destroy();
 }
 }
 return false;
 };
 this.run = function(task_id, data, callback)
 {
 var __task = null;
 for (__index = 0; __index < tasks_list.num; __index++)
 {
 __task = tasks_list.tasks[__index];
 if (__task.id() === task_id)
 {
 __task.message.send(data);
 __task.message.receive(callback);
 return true;
 }
 }
 return false;
 };
 this.run_all = function(tasks_config)
 {
 if (utils.validation.misc.is_undefined(tasks_config))
 return false;
 if (!config_parser.verify(tasks_config_model, tasks_config))
 return false;
 var __task = null;
 for (__this_task_config of tasks_config)
 {
 if (!utils.validation.misc.is_undefined(__this_task_config.callback) &&
 !utils.validation.misc.is_function(__this_task_config.callback))
 return false;
 for (__index = 0; __index < tasks_list.num; __index++)
 {
 __task = tasks_list.tasks[__index];
 if (__task.id() === __this_task_config.id)
 {
 if (!utils.validation.misc.is_undefined(__this_task_config.data))
 __task.message.send(__this_task_config.data);
 if (!utils.validation.misc.is_undefined(__this_task_config.callback))
 __task.message.receive(__this_task_config.callback);
 }
 }
 }
 return true;
 };
 this.kill = function()
 {
 for (__index = 0; __index < tasks_list.num; __index++)
 tasks_list.tasks[__index].destroy();
 tasks_list = new tasks_list_model();
 is_task_created = false;
 return null;
 };
 this.tasks = new tasks_info();
 var __index = 0,
 tasks_list = new tasks_list_model();
 }
 this.num = function()
 {
 if (is_task_created === false)
 return false;
 return tasks_manager.tasks.num();
 };
 this.list = function(index)
 {
 if (is_task_created === false)
 return false;
 if (utils.validation.misc.is_undefined(index))
 return tasks_manager.tasks.list();
 if (!utils.validation.numerics.is_integer(index)
 || index < 0 || index > (tasks_manager.tasks.num() - 1))
 return false;
 return tasks_manager.tasks.list(index);
 };
 this.create = function(worker_file)
 {
 return tasks_manager.create(worker_file);
 };
 this.destroy = function(task_id)
 {
 if (!utils.validation.numerics.is_integer(task_id))
 return false;
 if (is_task_created === false)
 return false;
 return tasks_manager.destroy(task_id);
 };
 this.run = function(task_id, data = null, callback = null)
 {
 if (!utils.validation.numerics.is_integer(task_id))
 return false;
 if (is_task_created === false)
 return false;
 return tasks_manager.run(task_id, data, callback);
 };
 this.run_all = function(tasks_config)
 {
 if (is_task_created === false)
 return false;
 return tasks_manager.run_all(tasks_config);
 };
 this.kill = function()
 {
 if (is_task_created === false)
 return false;
 tasks_manager.kill();
 return true;
 };
 function init()
 {
 if (utils.validation.misc.is_undefined(Worker))
 return false;
 return this;
 }
 var is_task_created = false,
 tasks_config_model =
 { "arguments" : [
 {
 "key" : { "name" : "id", "optional" : false },
 "value" : { "type" : "number" }
 },
 {
 "key" : { "name" : "data", "optional" : false },
 "value" : { "type" : "*" }
 },
 {
 "key" : { "name" : "callback", "optional" : true },
 "value" : { "type" : "*" }
 }
 ]
 };
 tasks_manager = new tasks_manager_model(),
 config_parser = new jap(),
 utils = new vulcan();
 init();
}
function snail()
{
 this.test = function(loops)
 {
 if (!utils.validation.misc.is_undefined(loops) && (!utils.validation.numerics.is_integer(loops) || loops < 1))
 return false;
 if (utils.validation.misc.is_undefined(loops))
 loops = 100000000;
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
 var benchmark_index = -1,
 performance = new centurion(),
 utils = new vulcan();
}
function ultron(anonymous_function)
{
 var utils = new vulcan();
 if (!utils.validation.misc.is_function(anonymous_function))
 return false;
 document.addEventListener("DOMContentLoaded", function(event) { (anonymous_function)(event); });
 return true;
}
function workbox()
{
 function general_helpers()
 {
 var self = this;
 this.draw_screen = function(container_id, title, button_label)
 {
 var __title_object = null,
 __button_object = null,
 __container = utils.objects.by_id(container_id),
 __html = null;
 if (__container === false || utils.validation.misc.is_invalid(__container))
 return false;
 workbox_object = utils.objects.by_id('workbox');
 if (workbox_object !== null)
 __container.removeChild(workbox_object);
 workbox_object = document.createElement('div');
 workbox_object.id = 'workbox';
 workbox_object.className = 'wb_screen';
 var __win_title_id = workbox_object.id + '_title',
 __button_title_id = workbox_object.id + '_button';
 __html = '<div class="work_window">' +
 ' <div id="' + __win_title_id + '"></div>' +
 ' <div id="' + workbox_object.id + '_content"></div>' +
 ' <div id="' + __button_title_id + '"></div>' +
 '</div>';
 workbox_object.innerHTML = __html;
 __container.appendChild(workbox_object);
 __title_object = utils.objects.by_id(__win_title_id);
 __button_object = utils.objects.by_id(__button_title_id);
 content_fetcher(__win_title_id, null,
 function()
 {
 __title_object.innerHTML = title;
 __button_object.innerHTML = button_label;
 },
 function()
 {
 __title_object.innerHTML = 'micro-MVC';
 __button_object.innerHTML = 'Close';
 },
 function()
 {
 utils.events.attach(__button_title_id, __button_object, 'click', self.hide_win);
 });
 return true;
 };
 this.show_win = function(message)
 {
 if (timer !== null)
 clearTimeout(timer);
 workbox_object.childNodes[0].childNodes[3].innerHTML = message;
 workbox_object.style.visibility = 'visible';
 workbox_object.classList.remove('wb_fade_out');
 workbox_object.classList.add('wb_fade_in');
 is_open = true;
 if (global_show_callback !== null)
 {
 global_show_callback.call(this);
 global_show_callback = null;
 }
 };
 this.hide_win = function()
 {
 if (timer !== null)
 clearTimeout(timer);
 workbox_object.style.visibility = 'visible';
 workbox_object.classList.remove('wb_fade_in');
 workbox_object.classList.add('wb_fade_out');
 timer = setTimeout(function() { workbox_object.style.visibility = 'hidden'; }, 250);
 is_open = false;
 if (global_hide_callback !== null)
 {
 global_hide_callback.call(this);
 global_hide_callback = null;
 }
 };
 }
 this.show = function(message, show_callback, hide_callback)
 {
 if (!is_init || is_open || !utils.validation.alpha.is_string(message) ||
 (!utils.validation.misc.is_invalid(show_callback) &&
 !utils.validation.misc.is_function(show_callback)) ||
 (!utils.validation.misc.is_invalid(hide_callback) &&
 !utils.validation.misc.is_function(hide_callback)))
 return false;
 if (utils.validation.misc.is_function(show_callback))
 global_show_callback = show_callback;
 if (utils.validation.misc.is_function(hide_callback))
 global_hide_callback = hide_callback;
 helpers.show_win(message);
 return true;
 };
 this.hide = function(hide_callback)
 {
 if (!is_init || !is_open ||
 (!utils.validation.misc.is_invalid(hide_callback) &&
 !utils.validation.misc.is_function(hide_callback)))
 return false;
 if (utils.validation.misc.is_function(hide_callback))
 global_hide_callback = hide_callback;
 helpers.hide_win();
 return true;
 };
 this.is_open = function()
 {
 if (!is_init)
 return false;
 return is_open;
 };
 this.init = function(container_id, title, button_label)
 {
 if (is_init)
 return false;
 if (utils.validation.misc.is_invalid(container_id) || !utils.validation.alpha.is_string(container_id) ||
 !utils.validation.alpha.is_string(title) || !utils.validation.alpha.is_string(button_label))
 return false;
 utils.graphics.apply_theme('/framework/extensions/js/user/workbox', 'workbox');
 if (!helpers.draw_screen(container_id, title, button_label))
 return false;
 is_init = true;
 return true;
 };
 var is_init = false,
 is_open = false,
 workbox_object = null,
 global_show_callback = null,
 global_hide_callback = null,
 timer = null,
 helpers = new general_helpers(),
 utils = new vulcan();
}
