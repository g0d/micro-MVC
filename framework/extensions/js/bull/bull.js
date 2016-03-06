/*

    BULL (AJAX System/Framework)
    
    File name: bull.js (Version: 14.2)
    Description: This file contains the BULL - AJAX System/Framework.
    
    Coded by George Delaportas (G0D)
    Contributions by Catalin Maftei
    
    Copyright © 2013 - 2016

*/

// BULL
function bull()
{
    // General utilities
    function utilities()
    {
        var me = this;

        this.is_undefined = function(val)
        {
            if (val === undefined)
                return true;

            return false;
        };

        this.is_invalid = function(val)
        {
            if (me.is_undefined(val) || val === null || val === '')
                return true;

            return false;
        };

        this.is_bool = function(val)
        {
            if (typeof val === 'boolean')
                return true;

            return false;
        };

        this.is_integer = function(val)
        {
            if (!isNaN(val) && (val % 1 === 0))
                return true;

            return false;
        };

        this.is_function = function(val)
        {
            if (typeof val === 'function')
                return true;

            return false;
        };
    }
    
    // AJAX core infrastructure
    function core()
    {
        var self = this;
        
        function ajax_model()
        {
            this.http_session = function(url, data, mode)
            {
                if (utils.is_undefined(url) || utils.is_undefined(data) || !utils.is_bool(mode))
                    return false;
                
                __xml_http.open('POST', url, mode);
                __xml_http.setRequestHeader('Access-Control-Allow-Origin', '*');
                __xml_http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
                __xml_http.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
                
                if (mode === true)
                    __xml_http.onreadystatechange = state_changed;
                
                __xml_http.send(data);
                
                if (mode === false)
                    state_changed();
                
                return true;
            };
            
            this.create_object = function()
            {
                var xml_http = null;
                
                if (window.XMLHttpRequest)
                    xml_http = new XMLHttpRequest();
                else
                    xml_http = new ActiveXObject("Microsoft.XMLHTTP");
                
                return xml_http;
            };
        }
        
        function state_changed()
        {
            if (__is_time_out === true)
                return false;
            
            if (__xml_http.readyState === 4)
            {
                __ajax_response = null;
                
                if (__xml_http.status === 200)
                {
                    if (__data_div_id === null)
                        __ajax_response = __xml_http.responseText;
                    else
                    {
                        var __container = document.getElementById(__data_div_id);
                        
                        if (utils.is_invalid(__container))
                            return false;
                        
                        __ajax_response = __xml_http.responseText;
                        
                        if (__content_fill_mode === false)
                            __container.innerHTML = __ajax_response;
                        else
                            __container.innerHTML += __ajax_response;
                    }
                    
                    if (utils.is_function(__success_callback))
                    {
                        __success_callback.call(this, result());
                        
                        __success_callback = null;
                    }
                    
                    return true;
                }
                else
                {
                    if (utils.is_function(__fail_callback))
                    {
                        __fail_callback.call(this, result());
                        
                        __fail_callback = null;
                    }
                }
            }
            
            return false;
        }
        
        function result()
        {
            if (utils.is_undefined(__ajax_response))
                return null;
            
            return __ajax_response;
        }
        
        function init_ajax()
        {
            __xml_http = ajax.create_object();
            
            return true;
        }
        
        this.data = function(url, data, element_id, content_fill_mode, success_callback, request_time_out, fail_callback)
        {
            if (utils.is_invalid(url) || (utils.is_invalid(data) && data !== '') || utils.is_invalid(element_id) || 
                (!utils.is_invalid(content_fill_mode) && !utils.is_bool(content_fill_mode)) || 
                (!utils.is_invalid(success_callback) && !utils.is_function(success_callback)) || 
                (!utils.is_invalid(fail_callback) && !utils.is_function(fail_callback)) || 
                (!utils.is_invalid(request_time_out) && (!utils.is_integer(request_time_out) || request_time_out < 1)))
                return false;
            
            __data_div_id = element_id;
            
            __content_fill_mode = content_fill_mode;
            
            if (utils.is_integer(request_time_out))
                setTimeout(function() { __is_time_out = true; }, request_time_out);
            
            __success_callback = success_callback;
            __fail_callback = fail_callback;
            
            ajax.http_session(url, data, true);
            
            return null;
        };
        
        this.request = function(url, data, ajax_mode, success_callback, request_time_out, fail_callback)
        {
            if (utils.is_invalid(url) || (utils.is_invalid(data) && data !== '') || 
                (!utils.is_integer(ajax_mode) || ajax_mode < 1 || ajax_mode > 2) || 
                (!utils.is_invalid(success_callback) && !utils.is_function(success_callback)) || 
                (!utils.is_invalid(fail_callback) && !utils.is_function(fail_callback)) || 
                (!utils.is_invalid(request_time_out) && (!utils.is_integer(request_time_out) || request_time_out < 1)))
                return false;
            
            __data_div_id = null;
            
            if (utils.is_integer(request_time_out))
                setTimeout(function() { __is_time_out = true; }, request_time_out);
            
            __success_callback = success_callback;
            __fail_callback = fail_callback;
            
            if (ajax_mode === 1)
                ajax.http_session(url, data, true);
            else
            {
                ajax.http_session(url, data, false);
                
                if (__ajax_response !== null && !utils.is_undefined(__ajax_response))
                    return __ajax_response;
            }
            
            return null;
        };
        
        var __xml_http = null,
            __data_div_id = null,
            __ajax_response = null,
            __content_fill_mode = false,
            __success_callback = null,
            __fail_callback = null,
            __is_time_out = false,
            ajax = new ajax_model();
        
        init_ajax();
    }
    
    // AJAX data (Asynchronous)
    this.data = function(url, data, element_id, content_fill_mode, success_callback, request_time_out, fail_callback)
    {
        var bull_core = new core();
        
        return bull_core.data(url, data, element_id, content_fill_mode, success_callback, request_time_out, fail_callback);
    };
    
    // AJAX request (Asynchronous / Synchronous)
    this.request = function(url, data, ajax_mode, success_callback, request_time_out, fail_callback)
    {
        var bull_core = new core();
        
        return bull_core.request(url, data, ajax_mode, success_callback, request_time_out, fail_callback);
    };
    
    var utils = new utilities();
}
