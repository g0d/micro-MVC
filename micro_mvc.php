<?php
    /*
        micro-MVC
        
        File name: micro_mvc.php
        Description: This file contains the "MICRO_MVC" class.
        
        Coded by George Delaportas (ViR4X)
        Copyright (C) 2015
    */
    
    // Include MVC class
    require('mvc.php');
    
    // MICRO_MVC class
    class MICRO_MVC
    {
        // MVC_Go_To - MVC::Route front-end (Go to a virtual MVC route passing any arguments)
        public static function Go_To($mvc_route, $mvc_args = null)
        {
            return MVC::Route($mvc_route, $mvc_args);
        }
        
        // MVC_Setup_Route - MVC::Set_Route front-end
        public static function Setup_Route($mvc_route)
        {
            return MVC::Set_Route($mvc_route);
        }
        
        // MVC_Get_Route - MVC::Get_Route front-end
        public static function Get_Route($option)
        {
            return MVC::Get_Route($option);
        }
        
        // MVC_Store_Content - MVC::Store_Variable front-end
        public static function Store_Content($mvc_var, $content)
        {
            return MVC::Store_Variable($mvc_var, $content);
        }
        
        // MVC_Show_Content - MVC::Restore_Variable front-end
        public static function Show_Content($mvc_var)
        {
            return MVC::Restore_Variable($mvc_var);
        }
    }
?>
