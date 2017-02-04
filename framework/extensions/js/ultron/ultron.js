/*

    ULTRON (Safe JS loader & manager)
    
    File name: ultron.js (Version: 0.2)
    Description: This file contains the ULTRON - Safe JS loader & manager.
    
    Coded by George Delaportas (G0D)
    Copyright © 2016

*/

// ULTRON
function ultron(anonymous_function)
{
	var my_vulcan = new vulcan();

	if (!my_vulcan.validation.misc.is_function(anonymous_function))
		return false;

    document.addEventListener("DOMContentLoaded", function(event) { (anonymous_function)(event); });

    return true;
}
