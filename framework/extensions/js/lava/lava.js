/*

    L.A.Va (LIVE Argument Validator)
    
    File name: lava.js (Version: 0.2)
    Description: This file contains the L.A.Va - LIVE Argument Validator.
    
    Coded by George Delaportas (G0D) 
    Copyright (C) 2016
    Open Software License (OSL 3.0)

*/

// L.A.Va
function lava()
{
    // Define the JSON object
    this.define = function(definition_model)
    {
        if (!utils.validation.misc.is_object(definition_model))
            return false;

        if (!utils.validation.misc.is_object(definition_model))
            return false;

        var def_counter;

        for (def_counter = 0; def_counter < definition_model.length; def_counter++)
        {
            if (!utils.validation.misc.is_object(definition_model[def_counter]))
                return false;

            if (!definition_model[def_counter].hasOwnProperty('key') || 
                !definition_model[def_counter].hasOwnProperty('value'))
                return false;

            if (!utils.validation.misc.is_object(definition_model[def_counter].key) || 
                !utils.validation.misc.is_object(definition_model[def_counter].value))
                return false;

            if (!definition_model[def_counter].key.hasOwnProperty('id') ||
                !definition_model[def_counter].key.hasOwnProperty('optional'))
                return false;

            if (!utils.validation.alpha.is_string(definition_model[def_counter].key.id) || 
                !utils.validation.misc.is_bool(definition_model[def_counter].key.optional))
                return false;

            if (document.getElementById(definition_model[def_counter].key.id) === null)
                return false;

            if (!definition_model[def_counter].value.hasOwnProperty('type'))
                return false;

            if (!utils.validation.alpha.is_string(definition_model[def_counter].value.type) || 
                __all_value_types.indexOf(definition_model[def_counter].value.type) === -1)
                return false;

            if (definition_model[def_counter].value.hasOwnProperty('length'))
            {
                if (__uncountable_value_types.indexOf(definition_model[def_counter].value.type) !== -1)
                    return false;

                if (!utils.validation.numerics.is_integer(definition_model[def_counter].value.length) || 
                    definition_model[def_counter].value.length < 1)
                    return false;
            }

            if (definition_model[def_counter].value.hasOwnProperty('regex'))
            {
                if (__uncountable_value_types.indexOf(definition_model[def_counter].value.type) !== -1 || 
                    definition_model[def_counter].value.type === 'array')
                    return false;

                if (!utils.validation.misc.is_object(definition_model[def_counter].value.regex) || 
                    definition_model[def_counter].value.regex === '')
                    return false;
            }
        }

        __is_defined = true;
        __json_def_model = definition_model;

        return true;
    };

    // Validate all fields based on the definition model
    this.validate = function()
    {
        if (!__is_defined)
            return false;

        var def_counter,
            keys_found = 0,
            keys_optional = false,
            regex_tester = null,
            this_field = null;

        for (def_counter = 0; def_counter < __json_def_model.length; def_counter++)
        {
            this_field = document.getElementById(__json_def_model[def_counter].key.id);

            if (__json_def_model[def_counter].key.optional === true)
            {
                if (this_field === null)
                    keys_optional = true;
            }

            if (this_field === null)
                return false;

            keys_found++;
        }

        if (keys_found < __json_def_model.length && keys_optional === false)
            return false;

        for (def_counter = 0; def_counter < __json_def_model.length; def_counter++)
        {
            this_field = document.getElementById(__json_def_model[def_counter].key.id);

            if (this_field === null)
                continue;

            if (__json_def_model[def_counter].value.type !== '*')
            {
                if (__json_def_model[def_counter].value.type === 'null')
                {
                    if (this_field.value !== null)
                        return false;
                }
                else if (__json_def_model[def_counter].value.type === 'array')
                {
                    if (!utils.validation.misc.is_array(this_field.value))
                        return false;
                }
                else
                {
                    if (typeof this_field.value !== __json_def_model[def_counter].value.type)
                        return false;
                }
            }

            if (__json_def_model[def_counter].value.hasOwnProperty('length'))
            {
                if (__json_def_model[def_counter].value.type === 'array')
                {
                    if (this_field.value.length > __json_def_model[def_counter].value.length)
                        return false;
                }
                else
                {
                    if (this_field.value.toString().length > __json_def_model[def_counter].value.length)
                        return false;
                }
            }

            if (__json_def_model[def_counter].value.hasOwnProperty('regex'))
            {
                regex_tester = new RegExp(__json_def_model[def_counter].value.regex);

                if (regex_tester.test(this_field.value) === false)
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
