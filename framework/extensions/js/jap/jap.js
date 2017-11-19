/*

    J.A.P (JSON Argument Parser)

    File name: jap.js (Version: 1.0)
    Description: This file contains the J.A.P - JSON Argument Parser.

    Coded by George Delaportas (G0D)
    Copyright (C) 2016 - 2017
    Open Software License (OSL 3.0)

*/

// J.A.P
function jap()
{
    // Informative log for the programmer
    function info_log(message)
    {
        console.log('---------- J.A.P ----------');
        console.log(message);
        console.log('---------- ***** ----------');
        console.log('');
    }

    // Scan for unknown keywords
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
                if (__def_keywords.indexOf(__index) === -1)
                    return true;

                continue;
            }

            for (__option in __attribute)
            {
                if (utils.validation.misc.is_object(__attribute[__option]))
                {
                    for (__property in __attribute[__option])
                    {
                        if (__def_keywords.indexOf(__property) === -1)
                            return true;

                        if (has_unknown_keywords(__attribute[__option][__property]))
                            return true;
                    }
                }
                else
                {
                    if (__def_keywords.indexOf(__option) === -1)
                        return true;

                    if (has_unknown_keywords(__attribute[__option]))
                        return true;
                }
            }
        }

        return false;
    }

    // Define the JSON object
    this.define = function(definition_model)
    {
        if (!utils.validation.misc.is_object(definition_model))
        {
            info_log('Invalid definition model!');

            return false;
        }

        if (definition_model.length === 0)
        {
            info_log('The definition model is null!');

            return false;
        }

        if (has_unknown_keywords(definition_model))
        {
            info_log('The definition model contains unknown keywords!');

            return false;
        }

        var __this_key = null,
            __this_value = null;

        __is_model_defined = false;

        if (definition_model.hasOwnProperty('ignore_keys_num') && !utils.validation.misc.is_bool(definition_model.ignore_keys_num))
        {
            info_log('Missing or invalid "ignore_keys_num" attribute!');

            return false;
        }

        if (!definition_model.hasOwnProperty('arguments') || !utils.validation.misc.is_object(definition_model.arguments))
        {
            info_log('Missing or invalid "arguments" attribute!');

            return false;
        }

        __def_model_args = definition_model.arguments;

        for (__counter = 0; __counter < __def_model_args.length; __counter++)
        {
            if (!utils.validation.misc.is_object(__def_model_args[__counter]))
            {
                info_log('Invalid JSON object in "arguments" attribute!');

                return false;
            }

            if (!__def_model_args[__counter].hasOwnProperty('key') || !__def_model_args[__counter].hasOwnProperty('value'))
            {
                info_log('Missing "key" or "value" mandatory attributes!');

                return false;
            }

            __this_key = __def_model_args[__counter].key;
            __this_value = __def_model_args[__counter].value;

            if (!utils.validation.misc.is_object(__this_key) || !utils.validation.misc.is_object(__this_value))
            {
                info_log('A "key" or "value" attribute does not point to a JSON object!');

                return false;
            }

            if (!__this_key.hasOwnProperty('name') || !__this_key.hasOwnProperty('optional'))
            {
                info_log('Missing "name" or "optional" mandatory properties!');

                return false;
            }

            if (!utils.validation.alpha.is_string(__this_key.name) || !utils.validation.misc.is_bool(__this_key.optional))
            {
                info_log('Invalid specification for "name" or "optional" property!');

                return false;
            }

            if (!__this_value.hasOwnProperty('type'))
            {
                info_log('Missing "type" mandatory property!');

                return false;
            }

            if (!utils.validation.alpha.is_string(__this_value.type) || __all_value_types.indexOf(__this_value.type) === -1)
            {
                info_log('Invalid specification for "type" property!');

                return false;
            }

            if (__this_value.hasOwnProperty('length'))
            {
                if (__uncountable_value_types.indexOf(__this_value.type) !== -1)
                {
                    info_log('This type does not support the "length" option!');

                    return false;
                }

                if (!utils.validation.numerics.is_integer(__this_value.length) || 
                    __this_value.length < 1)
                {
                    info_log('The "length" option has to be a positive integer!');

                    return false;
                }
            }

            if (__this_value.hasOwnProperty('regex'))
            {
                if (__uncountable_value_types.indexOf(__this_value.type) !== -1 || __this_value.type === 'array')
                {
                    info_log('This type does not support the "regex" option!');

                    return false;
                }

                if (!utils.validation.misc.is_object(__this_value.regex) || __this_value.regex === '')
                {
                    info_log('Invalid "regex" option!');

                    return false;
                }
            }
        }

        __is_model_defined = true;
        __json_def_model = definition_model;

        return true;
    };

    // Validate the JSON object based on the definition model
    this.validate = function(json_object)
    {
        if (!__is_model_defined)
        {
            info_log('No definition model was specified!');

            return false;
        }

        if (!utils.validation.misc.is_object(json_object))
        {
            info_log('Invalid JSON object!');

            return false;
        }

        var __json_key = null,
            __this_key = null,
            __this_value = null,
            __is_multiple_keys_array = false,
            __keys_exist = 0,
            __def_keys_found = 0,
            __mandatory_keys_not_found = 0;

        __def_model_args = __json_def_model.arguments;

        for (__counter = 0; __counter < __def_model_args.length; __counter++)
        {
            if (__def_model_args[__counter].key.optional === false)
                __def_keys_found++;
        }

        if (utils.validation.misc.is_array(json_object))
            __is_multiple_keys_array = true;

        for (__json_key in json_object)
        {
            if (__is_multiple_keys_array)
                __mandatory_keys_not_found = 0;

            for (__counter = 0; __counter < __def_model_args.length; __counter++)
            {
                __this_key = __def_model_args[__counter].key;

                if (__this_key.optional === false)
                {
                    if (__is_multiple_keys_array)
                    {
                        if (!json_object[__json_key].hasOwnProperty(__this_key.name))
                            __mandatory_keys_not_found++;
                    }
                    else
                    {
                        if (!json_object.hasOwnProperty(__this_key.name))
                            __mandatory_keys_not_found++;
                    }
                }
            }

            if (__is_multiple_keys_array && __mandatory_keys_not_found > 0)
                break;

            __keys_exist++;
        }

        if ((!__json_def_model.hasOwnProperty('ignore_keys_num') || __json_def_model.ignore_keys_num === false) && 
            __mandatory_keys_not_found > 0)
        {
            info_log('Mandatory properties are missing!');

            return false;
        }

        if (__keys_exist === 0)
        {
            info_log('The JSON object is null!');

            return false;
        }

        for (__counter = 0; __counter < __def_model_args.length; __counter++)
        {
            __this_key = __def_model_args[__counter].key;
            __this_value = __def_model_args[__counter].value;
console.log(__this_key.name);
console.log(json_object[__counter]);
console.log('');
            if ((json_object[__counter] === undefined || 
                 json_object[__counter].hasOwnProperty(__this_key.name) === undefined) || 
                json_object[__this_key.name] === undefined)
                    continue;

            if (__this_value.type !== '*')
            {
                if (__this_value.type === 'null')
                {
                    if (json_object[__this_key.name] !== null)
                    {
                        info_log('Argument: "' + __this_key.name + '" accepts only "null" values!');

                        return false;
                    }
                }
                else if (__this_value.type === 'array')
                {
                    if (!utils.validation.misc.is_array(json_object[__this_key.name]))
                    {
                        info_log('Argument: "' + __this_key.name + '" accepts only "array" values!');

                        return false;
                    }
                }
                else
                {
                    if ((__is_multiple_keys_array && typeof json_object[__counter][__this_key.name] !== __this_value.type) || 
                        typeof json_object[__this_key.name] !== __this_value.type)
                    {
                        info_log('Argument: "' + __this_key.name + '" has a type mismatch!');

                        return false;
                    }
                }
            }

            if (__this_value.hasOwnProperty('length'))
            {
                if (__this_value.type === 'array')
                {
                    if (json_object[__this_key.name].length > __this_value.length)
                    {
                        info_log('Argument: "' + __this_key.name + '" has exceeded the defined length!');

                        return false;
                    }
                }
                else
                {
                    if (json_object[__this_key.name].toString().length > __this_value.length)
                    {
                        info_log('Argument: "' + __this_key.name + '" has exceeded the defined length!');

                        return false;
                    }
                }
            }

            if (__this_value.hasOwnProperty('regex'))
            {
                if (!utils.validation.utilities.reg_exp(__this_value.regex, json_object[__this_key.name]))
                {
                    info_log('Argument: "' + __this_key.name + '" has not matched the specified regex!');

                    return false;
                }
            }
        }

        return true;
    };

    // Define and validate at once
    this.verify = function(definition_model, json_object)
    {
        if (self.define(definition_model))
            return self.validate(json_object);

        return false;
    };

    var self = this,
        __is_model_defined = false,
        __counter = 0,
        __json_def_model = null,
        __def_model_args = null,
        __def_keywords = ['ignore_keys_num', 'arguments', 'key', 'value', 'name', 'optional', 'type', 'length', 'regex'],
        __all_value_types = ['number', 'string', 'boolean', 'array', 'object', 'function', 'null', '*'],
        __uncountable_value_types = ['boolean', 'object', 'function', 'null', '*'],
        utils = new vulcan();
}
