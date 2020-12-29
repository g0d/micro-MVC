/*
    AJAX Factory (Factory method for AJAX calls)

    File name: ajax_factory.js (Version: 1.0)
    Description: This file contains the AJAX Factory extension.
    Dependencies: BULL.

    Coded by George Delaportas (G0D) 
    Copyright (C) 2019
    Open Software License (OSL 3.0)
*/

// AJAX Factory
function ajax_factory(ajax_data, success_cb, failure_cb, default_cb)
{
    var ajax = new bull();
    var bull_config = {
                            "type"          :   "request",
                            "url"           :   "/",
                            "data"          :   ajax_data,
                            "ajax_mode"     :   "asynchronous",
                            "on_success"    :   function (response)
                                                {
                                                    if (response !== '0' && response !== '-1' && response !== 'undefined')
                                                        success_cb.call(this, response);
                                                    else
                                                        failure_cb.call(this, response);

                                                    default_cb.call(this);
                                                }
                      };

    ajax.run(bull_config);

    return true;
}
