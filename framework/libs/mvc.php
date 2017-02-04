<?php
    /*
        micro-MVC
        
        File name: mvc.php
        Description: This file contains the "MVC" class.
        
        Coded by George Delaportas (ViR4X)
        Copyright (C) 2015
    */
    
    // Check for direct access
    if (!defined('micro_mvc'))
        exit();
    
    // Include MVC CONTROLLER class
    require(UTIL::Absolute_Path('framework/mvc/controller.php'));
    
    // MVC class
    class MVC
    {
        // MVC - Routes
        private static $__mvc_routes = array(0 => 'root');
        
        // MVC - Variables
        private static $__mvc_vars = array();
        
        // Go to the specified virtual MVC route passing any arguments
        public static function Go_To($method, $args = null)
        {
            if (empty($method))
                return false;
            
            $mvc_path = 'framework/mvc/';
            
            // Always include the root model
            require($mvc_path . 'models/root.php');
            
            // Include the specified model
            if (file_exists($mvc_path . 'models/' . $method . '.php'))
                require_once($mvc_path . 'models/' . $method . '.php');
            
            // Call the specified controller function (if it exists)
            if (in_array($method, get_class_methods('MVC_CONTROLLER')))
                MVC_CONTROLLER::$method($args);
            
            // Include the specified view
            if (file_exists($mvc_path . 'views/' . $method . '.phtml'))
                require($mvc_path . 'views/' . $method . '.phtml');
            
            return true;
        }
        
        // Set a virtual MVC route
        public static function Set_Route($mvc_route)
        {
            $fixed_route = trim($mvc_route);
            
            if (empty($fixed_route) || $fixed_route === 'root')
                return false;
            
            array_push(self::$__mvc_routes, UTIL::Normalize_Route($fixed_route));
            
            return true;
        }
        
        // Get current or all virtual MVC routes ("this" / "all") passing any language code
        public static function Get_Route($option, $lang = null)
        {
            if ($option === 'this')
            {
                $result = UTIL::Normalize_Route(substr($_SERVER['QUERY_STRING'], 4));
                
                if ($lang !== null)
                {
                    if ($lang !== '*')
                    {
                        if (LANG::Exists($lang) === false)
                            return false;
                    }
                    
                    $result = substr($result, 3);
                }
                
                if ($result === 'root')
                    return false;
                
                if ($result === '' || $result === false)
                    $result = 'root';
            }
            elseif ($option === 'all')
            {
                if ($lang !== null)
                    return false;
                
                $result = self::$__mvc_routes;
            }
            else
                return false;
            
            return $result;
        }
        
        // Store an MVC content
        public static function Store_Content($mvc_var, $content)
        {
            if (empty($mvc_var))
                return false;
            
            self::$__mvc_vars[$mvc_var] = $content;
            
            return true;
        }
        
        // Restore an MVC content
        public static function Restore_Content($mvc_var)
        {
            if (empty($mvc_var))
                return false;
            
            $result = self::$__mvc_vars[$mvc_var];
            
            return $result;
        }    
    }
?>
