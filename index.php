<?php
    /*
        micro-MVC

        File name: index.php
        Description: This file contains the index (bootstrapping).

        Coded by George Delaportas (ViR4X)
        Copyright (C) 2015
    */

    // Enable: 1 / Disable: 0 errors
    error_reporting(0);

    // Enable sessions
    session_start();

    // Include MICRO MVC framework
    require('framework/micro_mvc.php');

    // Include the config loader
    require('framework/misc/config_loader.php');

    // Include the languages and routes supervisor
    require('framework/misc/supervisor.php');

    // Include the AJAX dispatcher
    require('framework/misc/fortress.php');
?>
