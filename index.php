<?php
    /*
        micro-MVC

        File name: index.php
        Description: This file contains the index (bootstrapping).

        Coded by George Delaportas (G0D)
        Copyright (C) 2015
        Open Software License (OSL 3.0)
    */

    // Enable: E_WARNING | E_PARSE (report typical errors), -1 (report all errors) / Disable: 0 (no error reporting)
    error_reporting(0);

    // Enable sessions
    session_start();

    // Include micro-MVC framework
    require('framework/micro_mvc.php');

    // Include the config loader
    require('framework/misc/config_loader.php');

    // Include the supervisor
    require('framework/misc/supervisor.php');

    // Include the JS compactor to optimize and load all JS extensions on refresh (Optional - Use for speed at release)
    // (Note: After loading the JS compactor Do not use the "Autoload_Extensions()" and "Load_Extension(...)" API calls anyhere in your code)
    //require('site/php/js_compactor.php');
?>
