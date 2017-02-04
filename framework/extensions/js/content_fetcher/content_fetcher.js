/*

    Content Fetcher (International content loader)
    
    File name: content_fetcher.js (Version: 0.1)
    Description: This file contains the Content Fetcher - International content loader.
    Dependencies: Depends on BULL and Vulcan.
    
    Coded by George Delaportas (G0D)
    Copyright © 2016

*/

// Content Fetcher
function content_fetcher(content_id, language_code, result_callback)
{
	var my_vulcan = new vulcan();
	var my_bull = new bull();

	var data = null;

	if (my_vulcan.validation.misc.is_undefined(content_id))
		return false;

    if (!my_vulcan.validation.alpha.is_string(content_id) || 
    	(!my_vulcan.validation.misc.is_nothing(language_code) && 
         !my_vulcan.validation.alpha.is_string(language_code)))
        return false;

    if (!my_vulcan.validation.misc.is_function(result_callback))
        return false;

    data = 'gate=content&content_id=' + content_id;

    if (!my_vulcan.validation.misc.is_nothing(language_code))
    	data += '&language_code=' + language_code;

    my_bull.request('/', data, 1, 
    				function(response)
    				{
    					result_callback.call(this, response);
    				});

    return true;
}
