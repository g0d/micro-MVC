<?
    // Check for direct access
    if (!defined('micro_mvc'))
        exit();
    
    // Load and setup all languages in config
    UTIL::Setup_Languages();
    
    // Load and setup all routes in config
    UTIL::Setup_Routes();
?>
