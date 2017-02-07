/*

    localhost Ltd - spl@sh (splash AJAX utility)
    
    File name: splash.js (Version: 4.2)
    Description: This file contains the spl@sh AJAX utility.
    
    Coded by George Delaportas (G0D)
    
    localhost Ltd
    Copyright (C) 2013
    Open Software License (OSL 3.0)

*/



var splash = function(action, file, mode, misc, func)
             {
                 // Splash post
                 function splash(action, file, mode, misc, func)
                 {
                     var dynamic_element = null;
                     
                     if (action === null || action == '' || 
                         file === null || file == '' || 
                         mode === null || isNaN(mode) || mode < 1 || mode > 2 || 
                         misc === null || misc == '' || 
                         (func !== undefined && typeof func !== 'function'))
                         return false;
                     
                     if (mode === 1)
                     {
                         var form = document.getElementsByTagName('form');
                         
                         if (form.length === 0)
                         {
                             dynamic_element = document.createElement('form');
                             dynamic_element.setAttribute('action', misc);
                             dynamic_element.setAttribute('method', 'post');
                             
                             form = dynamic_element;
                             
                             dynamic_element = __set_input(1);
                             
                             form.appendChild(dynamic_element);
                             
                             dynamic_element = __set_input(2, action);
                             
                             form.appendChild(dynamic_element);
                             
                             form.submit();
                         }
                         else
                         {
                             dynamic_element = __set_input(1);
                             
                             form[0].appendChild(dynamic_element);
                             
                             dynamic_element = __set_input(2, action);
                             
                             form[0].appendChild(dynamic_element);
                             
                             form[0].submit();
                         }
                     }
                     else
                     {
                         var ajax = new bull();
                         var data = 'splash_ajax_post=1&splash_ajax_action=' + action;
                         
                         ajax.data(file, data, misc, false, func);
                     }
                     
                     return true;
                 }
                 
                 // Set splash input
                 function __set_input(type, action)
                 {
                     if (isNaN(type) || type < 1 || type > 2 || 
                         (type === 2 && (action === null || action == '')))
                         return false;
                     
                     var dynamic_element = null;
                     
                     if (type === 1)
                     {
                         dynamic_element = document.createElement('input');
                         dynamic_element.setAttribute('id', 'splash_post');
                         dynamic_element.setAttribute('name', 'splash_post');
                         dynamic_element.setAttribute('type', 'hidden');
                         dynamic_element.setAttribute('value', 1);
                     }
                     else
                     {
                         dynamic_element = document.createElement('input');
                         dynamic_element.setAttribute('id', 'splash_action');
                         dynamic_element.setAttribute('name', 'splash_action');
                         dynamic_element.setAttribute('type', 'hidden');
                         dynamic_element.setAttribute('value', action);
                     }
                     
                     return dynamic_element;
                 }
                 
                 return splash(action, file, mode, misc, func);
             };
