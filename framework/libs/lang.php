<?php
    /*
        micro-MVC
        
        File name: lang.php
        Description: This file contains the "LANG" class.
        
        Coded by George Delaportas (ViR4X)
        Copyright (C) 2015
    */
    
    // Check for direct access
    if (!defined('micro_mvc'))
        exit();
    
    // LANG class
    class LANG
    {
        // Default language code
        private static $__langs = array(0 => 'en');
        
        // Check if the argument is a valid country code
        private static function Is_Country_Code($lang)
        {
            if (empty($lang) || !ctype_alpha($lang) || strlen($lang) != 2)
                return false;

            return true;
        }

        // Get current or all physical and virtual language codes ("this" / "all") [Returns 'en' if language is missing from address]
        public static function Get($option = null)
        {
            if ($option === null)
                return self::$__langs[0];
            elseif ($option === 'this')
            {
                if (UTIL::Check_Route_Lang() === false)
                    return self::$__langs[0];
                else
                    return UTIL::Fetch_Route_Lang();
            }
            elseif ($option === 'all')
                return self::$__langs;
            else
                return false;
        }
        
        // Set a new virtual language code
        public static function Set($lang)
        {
            $fixed_lang = trim($lang);
            
            if (self::Exists($fixed_lang) === true)
                return false;
            
            array_push(self::$__langs, $fixed_lang);
            
            return true;
        }
        
        // Verify the language code is valid
        public static function Verify($lang)
        {
            if (self::Is_Country_Code($lang) === false)
                return false;

            if (!in_array($lang, self::$__langs))
                return false;

            return true;
        }

        // Check if the language code exists in config
        public static function Exists($lang)
        {
            if (self::Is_Country_Code($lang) === false)
                return true;
            
            if (in_array($lang, self::$__langs))
                return true;

            return false;
        }
    }
?>
