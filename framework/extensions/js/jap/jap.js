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

    // Define the JSON object
    this.define = function(definition_model)
    {
        if (!utils.validation.misc.is_object(definition_model))
        {
            info_log('Not a valid definition model!');

            return false;
        }

        __is_model_defined = false;

        if (definition_model.hasOwnProperty('ignore_keys_num') && 
            !utils.validation.misc.is_bool(definition_model.ignore_keys_num))
        {
            info_log('Missing or invalid "ignore_keys_num" attribute!');

            return false;
        }

        if (!definition_model.hasOwnProperty('arguments') || 
            !utils.validation.misc.is_object(definition_model.arguments))
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

            if (!__def_model_args[__counter].hasOwnProperty('key') || 
                !__def_model_args[__counter].hasOwnProperty('value'))
            {
                info_log('Missing "key" or "value" mandatory attributes!');

                return false;
            }

            if (!utils.validation.misc.is_object(__def_model_args[__counter].key) || 
                !utils.validation.misc.is_object(__def_model_args[__counter].value))
            {
                info_log('A "key" or "value" attribute does not point to a JSON object!');

                return false;
            }

            if (!__def_model_args[__counter].key.hasOwnProperty('name') ||
                !__def_model_args[__counter].key.hasOwnProperty('optional'))
            {
                info_log('Missing "name" or "optional" mandatory properties!');

                return false;
            }

            if (!utils.validation.alpha.is_string(__def_model_args[__counter].key.name) || 
                !utils.validation.misc.is_bool(__def_model_args[__counter].key.optional))
            {
                info_log('Invalid specification for "name" or "optional" property!');

                return false;
            }

            if (!__def_model_args[__counter].value.hasOwnProperty('type'))
            {
                info_log('Missing "type" mandatory property!');

                return false;
            }

            if (!utils.validation.alpha.is_string(__def_model_args[__counter].value.type) || 
                __all_value_types.indexOf(__def_model_args[__counter].value.type) === -1)
            {
                info_log('Invalid specification for "type" property!');

                return false;
            }

            if (__def_model_args[__counter].value.hasOwnProperty('length'))
            {
                if (__uncountable_value_types.indexOf(__def_model_args[__counter].value.type) !== -1)
                {
                    info_log('This type does not support the "length" option!');

                    return false;
                }

                if (!utils.validation.numerics.is_integer(__def_model_args[__counter].value.length) || 
                    __def_model_args[__counter].value.length < 1)
                {
                    info_log('The "length" option has to be a positive integer!');

                    return false;
                }
            }

            if (__def_model_args[__counter].value.hasOwnProperty('regex'))
            {
                if (__uncountable_value_types.indexOf(__def_model_args[__counter].value.type) !== -1 || 
                    __def_model_args[__counter].value.type === 'array')
                {
                    info_log('This type does not support the "regex" option!');

                    return false;
                }

                if (!utils.validation.misc.is_object(__def_model_args[__counter].value.regex) || 
                    __def_model_args[__counter].value.regex === '')
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
            info_log('Not a valid JSON object!');

            return false;
        }

        var __json_key = null,
            __keys_exist = 0,
            __keys_found = 0,
            __keys_optional = false;

        __def_model_args = __json_def_model.arguments;

        for (__json_key in json_object)
        {
            for (__counter = 0; __counter < __def_model_args.length; __counter++)
            {
                if (typeof parseInt(__json_key) === 'number')
                {/*
                    console.log(json_object[__json_key].hasOwnProperty(__def_model_args[__counter].key.name));
                    if (json_object[__json_key].hasOwnProperty(__def_model_args[__counter].key.name))
                    {
                        __keys_found++;

                        break;
                    }*/
                }
                else
                {
                    if (__def_model_args[__counter].key.optional === true && __keys_optional === false)
                    {
                        if (json_object[__def_model_args[__counter].key.name] === undefined)
                            __keys_optional = true;
                    }

                    if (__def_model_args[__counter].key.name === __json_key)
                        __keys_found++;
                }
            }

            __keys_exist++;
        }

        if (__keys_exist === 0)
        {
            info_log('The JSON object is null!');

            return false;
        }

/*
        if (__keys_found < __def_model_args.length && __keys_optional === false)
            return false;

        if (!__json_def_model.hasOwnProperty('ignore_keys_num') || __json_def_model.ignore_keys_num === false)
        {
            if (__keys_found !== __keys_exist)
                return false;
        }
*/
        for (__counter = 0; __counter < __def_model_args.length; __counter++)
        {
            if (json_object[__def_model_args[__counter].key.name] === undefined)
                continue;

            if (__def_model_args[__counter].value.type !== '*')
            {
                if (__def_model_args[__counter].value.type === 'null')
                {
                    if (json_object[__def_model_args[__counter].key.name] !== null)
                    {
                        info_log('Field: "' + __def_model_args[__counter].key.name + '" accepts only "null" values!');

                        return false;
                    }
                }
                else if (__def_model_args[__counter].value.type === 'array')
                {
                    if (!utils.validation.misc.is_array(json_object[__def_model_args[__counter].key.name]))
                    {
                        info_log('Field: "' + __def_model_args[__counter].key.id + '" accepts only "array" values!');

                        return false;
                    }
                }
                else
                {
                    if (typeof json_object[__def_model_args[__counter].key.name] !== 
                        __def_model_args[__counter].value.type)
                    {
                        info_log('Field: "' + __def_model_args[__counter].key.id + '" has a type mismatch!');

                        return false;
                    }
                }
            }

            if (__def_model_args[__counter].value.hasOwnProperty('length'))
            {
                if (__def_model_args[__counter].value.type === 'array')
                {
                    if (json_object[__def_model_args[__counter].key.name].length > 
                        __def_model_args[__counter].value.length)
                    {
                        info_log('Field: "' + __def_model_args[__counter].key.name + '" has exceeded the defined length!');

                        return false;
                    }
                }
                else
                {
                    if (json_object[__def_model_args[__counter].key.name].toString().length > 
                        __def_model_args[__counter].value.length)
                    {
                        info_log('Field: "' + __def_model_args[__counter].key.name + '" has exceeded the defined length!');

                        return false;
                    }
                }
            }

            if (__def_model_args[__counter].value.hasOwnProperty('regex'))
            {
                if (!utils.validation.utilities.reg_exp(__def_model_args[__counter].value.regex, 
                                                        json_object[__def_model_args[__counter].key.name]))
                {
                    info_log('Argument: "' + __def_model_args[__counter].key.name + '" has not matched the specified regex!');

                    return false;
                }
            }
        }

        return true;
    };

    var __is_model_defined = false,
        __counter = 0,
        __json_def_model = null,
        __def_model_args = null,
        __all_value_types = ['number', 'string', 'boolean', 'array', 'object', 'function', 'null', '*'],
        __uncountable_value_types = ['boolean', 'object', 'function', 'null', '*'],
        utils = new vulcan();
}
