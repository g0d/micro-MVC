<?php
    /*
        micro-MVC
        
        File name: index.php
        Description: This file contains the index.
        
        Coded by George Delaportas (ViR4X)
        Copyright (C) 2015
    */
    
    // Enable/Disable errors
    error_reporting(E_ALL);
    
    // Include MICRO MVC framework
    require('framework/micro_mvc.php');
    
    // Load and setup all routes in config
    UTIL::Setup_Routes();
    
    // Read current route
    $this_route = MVC::Get_Route('this');
    
    // Include index
    require('site/index.phtml');
?>
