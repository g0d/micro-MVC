/*

    Key Manager
    
    File name: key_manager.js (Version: 0.2)
    Description: This file contains the Key Manager.
    
    Coded by George Delaportas (G0D)
    Copyright (C) 2016
    Open Software License (OSL 3.0)

*/

// Key Manager
function key_manager()
{
    // Global keyboard key
    var keyboard_key = null;

    // Key Constants
    function key_constants() 
    {
        this.ENTER = 13;
        this.BACKSPACE = 8;
        this.SHIFT = 16;
    };

    // Constants
    this.constants = function()
    {
        return new key_constants();
    }

    // Scan keys
    this.scan = function(key_event)
    {
        try
        {
            if (typeof key_event.keyCode === 'undefined')
                keyboard_key = key_event.button;
            else
                keyboard_key = key_event.keyCode;

            return true;
        }
        catch(e)
        {
            return false;
        }
    };

    // Get keys
    this.get = function()
    {
        try
        {
            return keyboard_key;
        }
        catch(e)
        {
            return false;
        }
    };
}
