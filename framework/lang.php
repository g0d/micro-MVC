<?php
    /*
        micro-MVC
        
        File name: lang.php
        Description: This file contains the "LANG" class.
        
        Coded by George Delaportas (ViR4X)
        Copyright (C) 2016
    */
    
    // LANG class
    class LANG
    {
        // Shared language code
        private static $__lang_code = 'en';
        
        // Set current language
        public static function Set_Lang($lang_code)
        {
            // Set language code
            if (!empty($lang_code))
            {
                self::$__lang_code = $lang_code;
                
                return true;
            }
            
            else
                return false;
        }
        
        // Get current language
        public static function Get_Lang()
        {
            if(!empty($_GET['req']))
                self::$__lang_code = substr($_GET['req'], 0, 2);
            
            return self::$__lang_code;
        }
    }
?>
