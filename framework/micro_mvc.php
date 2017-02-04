<?php
    /*
        micro-MVC
        
        File name: micro_mvc.php
        Description: This file contains the micro-MVC framework.
        
        Coded by George Delaportas (ViR4X)
        Copyright (C) 2015
    */
    
    // Define constant for direct access control
    define('micro_mvc', true);

    // Include UTIL class
    require('libs/util.php');
    
    // Include LANG class
    require('libs/lang.php');
        
    // Include DB class
    require('libs/db.php');
    
    // Include MVC class
    require('libs/mvc.php');
?>
