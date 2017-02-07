<?
	/*
		Config Loader (Configurations initialization facility)
		
		File name: config_loader.php
		Description: This file contains the Config Loader - Configurations initialization facility.
		
		Coded by George Delaportas (ViR4X)
		Copyright (C) 2016
		Open Software License (OSL 3.0)
	*/

    // Check for direct access
    if (!defined('micro_mvc'))
        exit();
    
    // Load and setup all languages in config
    UTIL::Setup_Languages();
    
    // Load and setup all routes in config
    UTIL::Setup_Routes();
?>
