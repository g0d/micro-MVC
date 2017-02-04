<?php
    /*
        micro-MVC
        
        File name: util.php
        Description: This file contains the "UTIL" class.
        
        Coded by George Delaportas (ViR4X)
        Copyright (C) 2015
    */
    
    // Check for direct access
    if (!defined('micro_mvc'))
        exit();
    
    // UTIL class
    class UTIL
    {
        // Configuration importer
        private static function Config_Importer($config_file, $delimiter = null)
        {
            $file_result = file_get_contents(self::Absolute_Path('framework/config/') . $config_file . '.cfg');

            if ($file_result === false)
                return false;

            if ($delimiter === null)
                $results = trim($file_result);
            else
                $results = explode($delimiter, trim($file_result));

            return $results;
        }

        // Setup languages
        public static function Setup_Languages()
        {
            $langs_array = self::Config_Importer('langs', ',');
            
            foreach ($langs_array as $lang)
                LANG::Set($lang);
            
            return true;
        }
        
        // Setup routes
        public static function Setup_Routes()
        {
            $routes_array = self::Config_Importer('routes', ',');
            
            foreach ($routes_array as $route)
                MVC::Set_Route($route);
            
            return true;
        }

        // Load registered activities (Fortress gates)
        public static function Load_Activities()
        {
            $result = json_decode(self::Config_Importer('gates'), true);

            if (json_last_error() !== JSON_ERROR_NONE)
                return false;

            return $result;
        }
        
        // Absolute system path of a relative file path
        public static function Absolute_Path($file_path = null)
        {
            $final_path = $_SERVER['DOCUMENT_ROOT'] . '/' . $file_path;
            
            if (file_exists($final_path) === false)
                return null;
            
            return $final_path;
        }
        
        // Fetch the language code from route
        public static function Fetch_Route_Lang()
        {
            $normalized_route = self::Normalize_Route(substr($_SERVER['QUERY_STRING'], 4));
            $dash_pos = strpos($normalized_route, '_');
            
            if ($dash_pos === false)
                $lang = substr($normalized_route, 0);
            else
                $lang = substr($normalized_route, 0, $dash_pos);

            return $lang;
        }
        
        // Check for language code in route
        public static function Check_Route_Lang()
        {
            $lang = self::Fetch_Route_Lang();
            
            if (LANG::Verify($lang) === false)
                return false;
            
            return true;
        }
        
        // Normalize route
        public static function Normalize_Route($mvc_route)
        {
            if (empty($mvc_route))
                return false;
            
            return str_replace('-', '_', str_replace('/', '_', $mvc_route));
        }
        
        // Denormalize route
        public static function Denormalize_Route($mvc_route)
        {
            if (empty($mvc_route))
                return false;
            
            return str_replace('_', '-', str_replace('_', '/', $mvc_route));
        }
        
        // Set a new variable and put data (optional)
        public static function Set_Variable($variable_name, $variable_data = null)
        {
            if (empty($variable_name))
                return false;
            
            $_SESSION['micro_mvc'][$variable_name] = $variable_data;
            
            return true;
        }

        // Get data from a previously set variable
        public static function Get_Variable($variable_name)
        {
            if (empty($variable_name))
                return null;
            
            return $_SESSION['micro_mvc'][$variable_name];
        }

        // Check if content code has data and return the filename for a specific language code (optional)
        public static function Content_Data($content_code, $lang = null)
        {
            if (empty($content_code))
                return false;
            
            if ($lang !== null)
            {
                if (LANG::Verify($lang) === false)
                    return false;
                
                $this_lang = $lang;
            }
            else
                $this_lang = LANG::Get('this');
            
            $filename = self::Absolute_Path('framework/mvc/views/content/') . $this_lang . '/' . $content_code . '.phtml';
            
            if (file_exists($filename) === false)
                return false;
            
            return $filename;
        }

        // Load file using a specific language code (optional)
        public static function Load_File($content_code, $lang = null)
        {
            $filename = self::Content_Data($content_code, $lang);

            if ($filename === false)
                return false;
            
            require($filename);
            
            return true;
        }
        
        // Load file contents using a specific language code (optional)
        public static function Load_File_Contents($content_code, $lang = null)
        {
            $filename = self::Content_Data($content_code, $lang);

            if ($filename === false)
                return false;
            
            return trim(file_get_contents($filename));
        }
        
        // Fetch a template passing arguments (optional)
        public static function Fetch_Template($template_name, $arguments_array = null)
        {
            if (empty($template_name) || ($arguments_array !== null && is_array($arguments_array) && count($arguments_array) !== 2))
                return false;
            
            $filename = self::Absolute_Path('framework/templates/') . $template_name . '.phtml';
            
            if (file_exists($filename) === false)
                return false;
            
            $template = file_get_contents($filename);
            
            if ($arguments_array === null)
                $result = $template;
            else
                $result = str_replace($arguments_array[0], $arguments_array[1], $template);
            
            return $result;
        }
        
        // Convert any associative array mapped with one or more elements to an XML
        public static function Convert_Array_To_XML($elements, $data_array, $xml_file)
        {
            if (empty($elements) || empty($data_array) || empty($xml_file))
                return false;
            
            $file_handler = fopen($xml_file, 'w');
            
            if ($file_handler === false)
                return false;
            
            $xml_writer = new XMLWriter();
            $xml_writer->openMemory();
            $xml_writer->setIndent(true);
            $xml_writer->startDocument('1.0', 'UTF-8');
            
            if (is_array($elements))
            {
                if (count($elements) > count($data_array) || count($elements) < count($data_array))
                    return false;
                
                $i = 0;
                
                foreach ($elements as $this_element)
                {
                    $xml_writer->startElement($this_element);
                    $xml_writer->writeElement($data_array[$i][0], $data_array[$i][1]);
                    $xml_writer->endElement();
                    
                    $i++;
                }
            }
            else
            {
                $xml_writer->startElement($elements);
                
                foreach ($data_array as $this_val)
                    $xml_writer->writeElement($this_val[0], $this_val[1]);
                
                $xml_writer->endElement();
            }
            
            $xml_writer->endDocument();
            
            $access = fputs($file_handler, $xml_writer->outputMemory());
            
            fclose($file_handler);
            
            if ($access === false)
                return false;
            
            return true;
        }
        
        // Convert any valid XML file into an associative array map
        public static function Convert_XML_To_Array($xml, $callback = null, $recursive = false)
        {
            $new_data = (!$recursive && file_get_contents(self::Absolute_Path($xml)))? simplexml_load_file($xml): $xml;
            
            if ($new_data instanceof SimpleXMLElement)
                $new_data = (array)$new_data;
            
            if (is_array($new_data))
            {
                foreach ($new_data as &$item)
                    $item = self::Convert_XML_To_Array($item, $callback, true);
            }
            
            return (!is_array($new_data) && is_callable($callback))? call_user_func($callback, $new_data): $new_data;
        }
        
        // Process a directory
        public static function Process_Dir($dir, $recursive = false)
        {
            if (is_dir($dir))
            {
                for ($list = array(), $handle = opendir($dir); (($file = readdir($handle)) != false);)
                {
                    if (($file !== '.' && $file !== '..') && (file_exists($path = $dir . '/' . $file)))
                    {
                        if (is_dir($path) && ($recursive))
                            $list = array_merge($list, self::Process_Dir($path, true));
                        else
                        {
                            $entry = array('filename' => $file, 'dirpath' => $dir);
                            
                            $entry['modtime'] = filemtime($path);
                            
                            if (!is_dir($path))
                            {
                                $entry['size'] = filesize($path);
                                
                                if (strstr(pathinfo($path, PATHINFO_BASENAME), 'log'))
                                {
                                    if (!$entry['handle'] = fopen($path, 'r'))
                                        $entry['handle'] = "ERROR";
                                }
                            }
                            
                            $list[] = $entry;
                        }
                    }
                }
                
                closedir($handle);
                
                return $list;
            }
            else
                return false;
        }
        
        // Recursively delete directories
        public static function Delete_Dir($dir)
        {
            if (is_dir($dir))
            {
                 $files = scandir($dir);
                 
                 foreach ($files as $this_file)
                 {
                   if ($this_file !== '.' && $this_file !== '..')
                   {
                       if (filetype($dir . '/' . $this_file) === 'dir')
                       {
                           $result = Delete_Dir($dir . '/' . $this_file);
                           
                           if ($result === false)
                               return false;
                       }
                       else
                       {
                           $result = unlink($dir . '/' . $this_file);
                           
                           if ($result === false)
                               return false;
                       }
                   }
                 }
                 
                 reset($files);
                 
                 $result = rmdir($dir);
                 
                 return $result;
            }
            else
                return false;
        }

        // Load extension
        public static function Load_Extension($extension, $ext_type)
        {
            if (empty($extension))
                return false;
            
            // PHP extensions
            if ($ext_type === 'php')
            {
                if ($extension === 'all')
                {
                    $result = self::Process_Dir(self::Absolute_Path('framework/extensions/php'), true);
                    
                    // Close on error
                    if (empty($result))
                        return false;
                    
                    // Load all the extensions
                    foreach ($result as $file)
                    {
                        $file_ext = mb_substr($file['filename'], -3, 3, 'utf8');
                        
                        if ($file_ext === 'php')
                        {
                            $file_name = mb_substr($file['filename'], 0, strlen($file['filename']) - 3, 'utf8');
                            
                            require_once($file['dirpath'] . '/' . $file['filename']);
                        }
                    }
                    
                    return true;
                }
                else
                {
                    $result = self::Process_Dir(self::Absolute_Path('framework/extensions/php/' . $extension), false);
                    
                    // Close on error
                    if (empty($result))
                        return false;
                    
                    // Load this extension
                    foreach ($result as $file)
                    {
                        if (mb_substr($file['filename'], 0, strlen($file['filename']) - 4, 'utf8') === $extension)
                        {
                            $file_ext = mb_substr($file['filename'], -3, 3, 'utf8');
                            
                            if ($file_ext === 'php')
                            {
                                $file_name = mb_substr($file['filename'], 0, strlen($file['filename']) - 3, 'utf8');
                                
                                require_once($file['dirpath'] . '/' . $file['filename']);
                                
                                break;
                            }
                        }
                    }
                    
                    return true;
                }
            }
            
            // Javascript extensions
            elseif ($ext_type === 'js')
            {
                if ($extension === 'all')
                {
                    $result = self::Process_Dir(self::Absolute_Path('framework/extensions/js'), true);
                    
                    // Close on error
                    if (empty($result))
                        return false;
                    
                    // Load all the extensions
                    foreach ($result as $file)
                    {
                        $file_ext = mb_substr($file['filename'], -3, 3, 'utf8');
                        
                        if ($file_ext === '.js')
                        {
                            $dir_path = mb_substr($file['dirpath'], strrpos($file['dirpath'], '/') + 1);
                            
                            $file_name = mb_substr($file['filename'], 0, strlen($file['filename']) - 2, 'utf8');
                            
                            echo '<script src="/framework/extensions/js/' . $dir_path . '/' . $file['filename'] . '"></script>';
                        }
                    }
                    
                    return true;
                }
                else
                {
                    $result = self::Process_Dir(self::Absolute_Path('framework/extensions/js/' . $extension), false);
                    
                    // Close on error
                    if (empty($result))
                        return false;
                    
                    // Load this extension
                    foreach ($result as $file)
                    {
                        if (mb_substr($file['filename'], 0, strlen($file['filename']) - 3, 'utf8') === $extension)
                        {
                            $file_ext = mb_substr($file['filename'], -3, 3, 'utf8');
                            
                            $file_name = mb_substr($file['filename'], 0, strlen($file['filename']) - 2, 'utf8');
                            
                            if ($file_ext === '.js')
                            {
                                echo '<script src="/framework/extensions/js/' . $extension . '/' . $file['filename'] . '"></script>';
                                
                                break;
                            }
                        }
                    }
                    
                    return true;
                }
                
                echo '<noscript>Your browser does not support JavaScript!</noscript>';
            }
            else
                return false;
        }
    }
?>
