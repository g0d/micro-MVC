<?php
    /*
        micro-MVC
        
        File name: db.php
        Description: This file contains the "DB" class.
        
        Coded by George Delaportas (ViR4X)
        Copyright (C) 2015
    */
    
    // Check for direct access
    if (!defined('micro_mvc'))
        exit();
    
    // DB class
    class DB
    {
        // Shared database connection
        private static $__db_con = null;
        
        // Shared database configuration file
        private static $__db_conf = 'framework/config/db.cfg';
        
        // Connect to the database
        public static function Connect($user, $pass, $domain, $db, $port = 3306)
        {
            if (empty($user) || empty($domain) || empty($db))
                return false;
            
            $mysql_con = mysqli_connect($domain, $user, $pass, $db, $port);
            
            if ($mysql_con === false)
                return false;
            
            $mysql_result = mysqli_set_charset($mysql_con, 'utf8');
            
            if ($mysql_result === false)
                return false;
            
            if (mysqli_error($mysql_con) != '')
            {
                self::Disconnect($mysql_con);
                
                return false;
            }
            
            self::$__db_con = $mysql_con;
            
            return self::$__db_con;
        }
        
        // Disconnect from the database
        public static function Disconnect($connection_id)
        {
            if (empty($connection_id))
                return false;
            
            $mysql_dis = mysqli_close($connection_id);
            
            if ($mysql_dis === false)
                return false;
            
            self::$__db_con = null;
            
            return true;
        }
        
        // Store a database connection
        public static function Store_Connection($user, $pass, $domain, $db, $port)
        {
            if (empty($user) || empty($domain) || empty($db))
                return false;
            
            $file_handler = fopen(UTIL::Absolute_Path(self::$__db_conf), 'w');
            
            if ($file_handler === false)
                return false;
            
            $access = fputs($file_handler, $user . ':' . $pass . ':' . $domain . ':' . $db . ':' . $port);
            
            fclose($file_handler);
            
            if ($access === false)
                return false;
            
            return true;
        }
        
        // Restore the database connection
        public static function Restore_Connection()
        {
            $result = array();
            
            $file_handler = fopen(UTIL::Absolute_Path(self::$__db_conf), 'r');
            
            if ($file_handler === false)
                return false;
            
            $buffer = fgets($file_handler);
            
            fclose($file_handler);
            
            if ($buffer === false)
                return false;
            
            $result = explode(':', $buffer);
            
            return $result;
        }
        
        // Use the current database connection
        public static function Use_Connection()
        {
            if (empty(self::$__db_con))
            {
                $con_array = array();
                
                $con_array = self::Restore_Connection();
                
                if ($con_array === false)
                    return false;
                
                $mysql_con = self::Connect($con_array[0], $con_array[1], $con_array[2], $con_array[3], $con_array[4]);
                
                if ($mysql_con === false)
                    return false;
                
                self::$__db_con = $mysql_con;
            }
            
            return self::$__db_con;
        }
        
        // Delete the database connection
        public static function Delete_Connection()
        {
            $file_handler = fopen(UTIL::Absolute_Path(self::$__db_conf), 'w');
            
            if ($file_handler === false)
                return false;
            
            $access = fputs($file_handler, '0');
            
            fclose($file_handler);
            
            if ($access === false)
                return false;
            
            self::$__db_conf = null;
            self::$__db_con = null;
            
            return true;
        }
        
        // Execute SQL commands
        public static function Exec_SQL_Command($sql_com)
        {
            if (empty($sql_com))
                return false;
            
            $mysql_con = self::Use_Connection();
            
            if ($mysql_con === false)
                return false;
            
            $mysql_result = mysqli_query($mysql_con, $sql_com);
            
            if ($mysql_result === false)
                return false;
            
            $final_result = array();
            
            if (!is_bool($mysql_result))
            {
                while ($mysql_row = mysqli_fetch_array($mysql_result))
                    $final_result[] = $mysql_row;
            }
            
            return $final_result;
        }
        
        // Execute SQL script files
        public static function Exec_SQL_Script($sql_file)
        {
            if (empty($sql_file))
                return false;
            
            $mysql_multi_query = file_get_contents($sql_file);
            
            if ($mysql_multi_query === false)
                return false;
            
            $mysql_con = self::Use_Connection();
            
            if ($mysql_con === false)
                return false;
            
            $mysql_result = mysqli_multi_query($mysql_con, $mysql_multi_query);
            
            self::Disconnect($mysql_con);
            
            return $mysql_result;
        }
    }
?>
