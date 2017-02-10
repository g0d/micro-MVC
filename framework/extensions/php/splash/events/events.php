<?php

    /*

        localhost Ltd - spl@sh

        Version: 4.3

        File name: events.php
        Description: This file contains the "EVENTS" wrapper.

        Coded by George Delaportas (G0D)

        localhost Ltd
        Copyright (C) 2013
        Open Software License (OSL 3.0)

    */



    /* ------------------------ BEGIN ------------------------ */

    // Disable error reporting
    error_reporting(0);

    if (!empty($_POST['splash_post']) && is_numeric($_POST['splash_post']) && 
       $_POST['splash_post'] == 1 && !empty($_POST['splash_action']))
    {

        // Include HELPERS class
        require_once(UTIL::Absolute_Path('framework/extensions/php/splash/helpers/helpers.php'));

        // Include EVENTS LIST wrapper
        require('events_list.php');

        HELPERS::Call_User_Function($_POST['splash_action']);

    }

    if (!empty($_POST['splash_ajax_post']) && is_numeric($_POST['splash_ajax_post']) && 
       $_POST['splash_ajax_post'] == 1 && !empty($_POST['splash_ajax_action']))
    {

        // Include micro-MVC framework
        require('../../../../micro_mvc.php');

        // Include HELPERS class
        require(UTIL::Absolute_Path('framework/extensions/php/splash/helpers/helpers.php'));

        // Include EVENTS LIST wrapper
        require('events_list.php');

        HELPERS::Call_User_Function($_POST['splash_ajax_action']);

    }

    /* ------------------------- END ------------------------- */

?>
