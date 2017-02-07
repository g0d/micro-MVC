/*

    BULL (AJAX System/Framework)
    
    File name: bull.js (Version: 15.1)
    Description: This file contains the BULL - AJAX System/Framework.
    
    Coded by George Delaportas (G0D) / Contributions by Catalin Maftei
    Copyright (C) 2013
    Open Software License (OSL 3.0)

*/

// BULL
function bull()
{
    // AJAX core infrastructure
    function core()
    {
        var self = this;
        
        function ajax_model()
        {
            this.http_session = function(url, data, mode)
            {
                if (utils.validation.misc.is_undefined(url) || 
                    utils.validation.misc.is_undefined(data) || 
                    !utils.validation.misc.is_bool(mode))
                    return false;
                
                __xml_http.open('POST', url, mode);
                __xml_http.setRequestHeader('Access-Control-Allow-Origin', '*');
                
                if (!utils.validation.misc.is_object(data))
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
            {
                if (utils.validation.misc.is_function(__timeout_callback))
                    __timeout_callback.call(this, result());
                
                return false;
            }

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
                        
                        if (utils.validation.misc.is_invalid(__container))
                            return false;
                        
                        __ajax_response = __xml_http.responseText;
                        
                        if (__content_fill_mode === false)
                            __container.innerHTML = __ajax_response;
                        else
                            __container.innerHTML += __ajax_response;
                    }
                    
                    if (utils.validation.misc.is_function(__success_callback))
                        __success_callback.call(this, result());
                    
                    return true;
                }
                else
                {
                    if (utils.validation.misc.is_function(__fail_callback))
                        __fail_callback.call(this, result());
                }
            }
            
            return false;
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
            
            return true;
        }
        
        this.data = function(url, data, element_id, content_fill_mode, 
                             success_callback, request_timeout, timeout_callback, fail_callback)
        {
            if (utils.validation.misc.is_invalid(url) || (utils.validation.misc.is_invalid(data) && data !== '') || 
                utils.validation.misc.is_invalid(element_id) || 
                (!utils.validation.misc.is_invalid(content_fill_mode) && !utils.validation.misc.is_bool(content_fill_mode)) || 
                (!utils.validation.misc.is_invalid(success_callback) && !utils.validation.misc.is_function(success_callback)) || 
                (!utils.validation.misc.is_invalid(fail_callback) && !utils.validation.misc.is_function(fail_callback)) || 
                (!utils.validation.misc.is_invalid(request_timeout) && 
                 (!utils.validation.numerics.is_integer(request_timeout) || request_timeout < 1)) || 
                (!utils.validation.misc.is_invalid(timeout_callback) && 
                (!utils.validation.misc.is_function(timeout_callback) || 
                 !utils.validation.numerics.is_integer(request_timeout) || request_timeout < 1)))
                return false;
            
            __data_div_id = element_id;
            
            if (utils.validation.misc.is_bool(content_fill_mode))
                __content_fill_mode = content_fill_mode;
            
            if (utils.validation.numerics.is_integer(request_timeout))
                setTimeout(function() { __is_time_out = true; }, request_timeout);
            
            __success_callback = success_callback;
            __fail_callback = fail_callback;
            __timeout_callback = timeout_callback;
            
            ajax.http_session(url, data, true);
            
            return null;
        };
        
        this.request = function(url, data, ajax_mode, success_callback, request_timeout, 
                                timeout_callback, fail_callback)
        {
            if (utils.validation.misc.is_invalid(url) || (utils.validation.misc.is_invalid(data) && data !== '') || 
                (!utils.validation.numerics.is_integer(ajax_mode) || ajax_mode < 1 || ajax_mode > 2) || 
                (!utils.validation.misc.is_invalid(success_callback) && !utils.validation.misc.is_function(success_callback)) || 
                (!utils.validation.misc.is_invalid(fail_callback) && !utils.validation.misc.is_function(fail_callback)) || 
                (!utils.validation.misc.is_invalid(request_timeout) && 
                 (!utils.validation.numerics.is_integer(request_timeout) || request_timeout < 1)) || 
                (!utils.validation.misc.is_invalid(timeout_callback) && (!utils.validation.misc.is_function(timeout_callback) || 
                 !utils.validation.numerics.is_integer(request_timeout) || request_timeout < 1)))
                return false;
            
            __data_div_id = null;
            
            if (utils.validation.numerics.is_integer(request_timeout))
                setTimeout(function() { __is_time_out = true; }, request_timeout);
            
            __success_callback = success_callback;
            __fail_callback = fail_callback;
            __timeout_callback = timeout_callback;
            
            if (ajax_mode === 1)
                ajax.http_session(url, data, true);
            else
            {
                ajax.http_session(url, data, false);
                
                if (__ajax_response !== null && !utils.validation.misc.is_undefined(__ajax_response))
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
            __timeout_callback = null,
            __is_time_out = false,
            ajax = new ajax_model();
        
        init_ajax();
    }
    
    // AJAX data (Asynchronous)
    this.data = function(url, data, element_id, content_fill_mode, 
                         success_callback, request_timeout, timeout_callback, fail_callback)
    {
        var bull_core = new core();
        
        return bull_core.data(url, data, element_id, content_fill_mode, 
                              success_callback, request_timeout, timeout_callback, fail_callback);
    };
    
    // AJAX request (Asynchronous / Synchronous)
    this.request = function(url, data, ajax_mode, success_callback, request_timeout, 
                            timeout_callback, fail_callback)
    {
        var bull_core = new core();
        
        return bull_core.request(url, data, ajax_mode, success_callback, request_timeout, 
                                 timeout_callback, fail_callback);
    };
    
    var utils = new vulcan();
}
