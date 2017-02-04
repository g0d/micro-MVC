/*

    J.A.P (JSON Argument Parser)
    
    File name: jap.js (Version: 0.9)
    Description: This file contains the J.A.P - JSON Argument Parser.
    
    Coded by George Delaportas (G0D)
    Copyright © 2016

*/

// J.A.P
function jap()
{
    // Define the JSON object
    this.define = function(definition_model)
    {
        if (!utils.validation.misc.is_object(definition_model))
            return false;

        if (!utils.validation.misc.is_object(definition_model))
            return false;

        if (definition_model.hasOwnProperty('ignore_keys_num') && 
            !utils.validation.misc.is_bool(definition_model.ignore_keys_num))
            return false;

        if (!definition_model.hasOwnProperty('arguments') || 
            !utils.validation.misc.is_object(definition_model.arguments))
            return false;

        var def_counter,
            def_model_args = definition_model.arguments;

        for (def_counter = 0; def_counter < def_model_args.length; def_counter++)
        {
            if (!utils.validation.misc.is_object(def_model_args[def_counter]))
                return false;

            if (!def_model_args[def_counter].hasOwnProperty('key') || 
                !def_model_args[def_counter].hasOwnProperty('value'))
                return false;

            if (!utils.validation.misc.is_object(def_model_args[def_counter].key) || 
                !utils.validation.misc.is_object(def_model_args[def_counter].value))
                return false;

            if (!def_model_args[def_counter].key.hasOwnProperty('name') ||
                !def_model_args[def_counter].key.hasOwnProperty('optional'))
                return false;

            if (!utils.validation.alpha.is_string(def_model_args[def_counter].key.name) || 
                !utils.validation.misc.is_bool(def_model_args[def_counter].key.optional))
                return false;

            if (!def_model_args[def_counter].value.hasOwnProperty('type'))
                return false;

            if (!utils.validation.alpha.is_string(def_model_args[def_counter].value.type) || 
                __all_value_types.indexOf(def_model_args[def_counter].value.type) === -1)
                return false;

            if (def_model_args[def_counter].value.hasOwnProperty('length'))
            {
                if (__uncountable_value_types.indexOf(def_model_args[def_counter].value.type) !== -1)
                    return false;

                if (!utils.validation.numerics.is_integer(def_model_args[def_counter].value.length) || 
                    def_model_args[def_counter].value.length < 1)
                    return false;
            }

            if (def_model_args[def_counter].value.hasOwnProperty('regex'))
            {
                if (__uncountable_value_types.indexOf(def_model_args[def_counter].value.type) !== -1 || 
                    def_model_args[def_counter].value.type === 'array')
                    return false;

                if (!utils.validation.misc.is_object(def_model_args[def_counter].value.regex) || 
                    def_model_args[def_counter].value.regex === '')
                    return false;
            }
        }

        __is_defined = true;
        __json_def_model = definition_model;

        return true;
    };

    // Validate the JSON object based on the definition model
    this.validate = function(json_object)
    {
        if (!__is_defined)
            return false;

        if (!utils.validation.misc.is_object(json_object))
            return false;

        var def_counter,
            def_model_args = __json_def_model.arguments,
            json_key,
            keys_exist = 0,
            keys_found = 0,
            keys_optional = false,
            regex_tester = null;

        for (json_key in json_object)
        {
            for (def_counter = 0; def_counter < def_model_args.length; def_counter++)
            {
                if (def_model_args[def_counter].key.optional === true)
                {
                    if (json_object[def_model_args[def_counter].key.name] === undefined)
                        keys_optional = true;
                }

                if (def_model_args[def_counter].key.name === json_key)
                    keys_found++;
            }

            keys_exist++;
        }

        if (keys_found < def_model_args.length && keys_optional === false)
            return false;

        if (!__json_def_model.hasOwnProperty('ignore_keys_num') || __json_def_model.ignore_keys_num === false)
        {
            if (keys_found !== keys_exist)
                return false;
        }

        for (def_counter = 0; def_counter < def_model_args.length; def_counter++)
        {
            if (json_object[def_model_args[def_counter].key.name] === undefined)
                continue;

            if (def_model_args[def_counter].value.type !== '*')
            {
                if (def_model_args[def_counter].value.type === 'null')
                {
                    if (json_object[def_model_args[def_counter].key.name] !== null)
                        return false;
                }
                else if (def_model_args[def_counter].value.type === 'array')
                {
                    if (!Array.isArray(json_object[def_model_args[def_counter].key.name]))
                        return false;
                }
                else
                {
                    if (typeof json_object[def_model_args[def_counter].key.name] !== def_model_args[def_counter].value.type)
                        return false;
                }
            }

            if (def_model_args[def_counter].value.hasOwnProperty('length'))
            {
                if (def_model_args[def_counter].value.type === 'array')
                {
                    if (json_object[def_model_args[def_counter].key.name].length > 
                        def_model_args[def_counter].value.length)
                        return false;
                }
                else
                {
                    if (json_object[def_model_args[def_counter].key.name].toString().length > 
                        def_model_args[def_counter].value.length)
                        return false;
                }
            }

            if (def_model_args[def_counter].value.hasOwnProperty('regex'))
            {
                regex_tester = new RegExp(def_model_args[def_counter].value.regex);

                if (regex_tester.test(json_object[def_model_args[def_counter].key.name]) === false)
                    return false;
            }
        }

        return true;
    };

    var __is_defined = false,
        __json_def_model = null,
        __all_value_types = ['number', 'string', 'boolean', 'array', 'object', 'function', 'null', '*'],
        __uncountable_value_types = ['boolean', 'object', 'function', 'null', '*'],
        utils = new vulcan();
}
