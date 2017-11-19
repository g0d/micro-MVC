/*

    Content Fetcher (Universal content loader)

    File name: content_fetcher.js (Version: 0.2)
    Description: This file contains the Content Fetcher - Universal content loader.
    Dependencies: BULL and Vulcan.

    Coded by George Delaportas (G0D)
    Copyright (C) 2016
    Open Software License (OSL 3.0)

*/

// Content Fetcher
function content_fetcher(content_id, language_code, result_callback)
{
    var data = null,
        utils = new vulcan(),
        ajax = new bull();
	

	if (utils.validation.misc.is_undefined(content_id))
		return false;

    if (!utils.validation.alpha.is_string(content_id) || 
    	(!utils.validation.misc.is_nothing(language_code) && 
         !utils.validation.alpha.is_string(language_code)))
        return false;

    if (!utils.validation.misc.is_function(result_callback))
        return false;

    data = 'gate=content&content_id=' + content_id;

    if (!utils.validation.misc.is_nothing(language_code))
    	data += '&language_code=' + language_code;

    ajax.request('/', data, 1, 
    			 function(response)
    			 {
    			    result_callback.call(this, response);
    			 });

    return true;
}
