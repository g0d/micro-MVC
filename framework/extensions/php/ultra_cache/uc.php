<?php
    /*
        Ultra Cache (Abstract class)
        
        File name: uc.php (Version: 3.0)
        Description: This file contains the Ultra Cache (UC) - Abstract class.
        
        Coded by George Delaportas (G0D)
        Copyright (c) 2017
        Open Software License (OSL 3.0)
    */
    
    // Ultra Cache (UC) abstract class
    abstract class UC
    {
        const _GET_ = 0;
        const _SET_ = 1;
        protected $__modes = array(self::_GET_, self::_SET_);
        
        abstract protected function Delete($key);
        
        abstract protected function Exists($key);
        
        abstract protected function Clear();
    }
?>
