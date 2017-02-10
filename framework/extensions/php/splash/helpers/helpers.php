<?php

    /*

        localhost Ltd - spl@sh

        Version: 4.3

        File name: helpers.php
        Description: This file contains the HELPERS class.

        Coded by George Delaportas (G0D)

        localhost Ltd
        Copyright (C) 2013
        Open Software License (OSL 3.0)

    */



    /* ------------------------ BEGIN ------------------------ */

    // Class: [HELPERS]
    class HELPERS
    {

        private static $TRUE = array(true, 1, 'true', '1', 'yes', 'on');
        private static $FALSE = array(false, 0, 'false', '0', 'no', 'off');
        
        private static $CREATE = array('CREATE', 'create', 1);
        private static $DEBUG = array('DEBUG', 'debug', 2);

        public static function Is_Logic($value)
        {

            if (empty($value) || is_array($value))
                return false;

            $true_false_array = array_merge(self::$TRUE, self::$FALSE);

            $result = in_array($value, $true_false_array);

            return $result;

        }

        public static function Is_True($value)
        {

            $result = in_array($value, self::$TRUE);

            return $result;

        }

        public static function Is_False($value)
        {

            $result = in_array($value, self::$FALSE);

            return $result;

        }
        
        public static function Is_Positive_Integer($value)
        {

            if (is_int(intval($value)) && intval($value) > 0)
                return true;

            return false;

        }

        public static function Is_Empty($value)
        {

            if (empty($value) && $value !== '0' && $value !== 0)
                return true;

            return false;

        }

        public static function Is_Valid_Mode($value)
        {

            $create_debug_array = array_merge(self::$CREATE, self::$DEBUG);

            if (!in_array($value, $create_debug_array))
                return false;

            return true;

        }

        public static function Is_Valid_Array($array)
        {

            if (!empty($array) && is_array($array))
                return true;

            return false;

        }

        public static function Filter_Null_Values($array)
        {

            $new_array = array();

            if (!empty($array) && is_array($array))
            {

                foreach ($array as $item)
                {

                    if (!empty($item))
                        array_push($new_array, $item);

                }

                return $new_array;

            }

            return false;

        }

        public static function Valid_Parameters($params_1, $params_2 = null)
        {

            if (!empty($params_1) && !is_array($params_1) || (!empty($params_2) && !is_array($params_2)))
                return false;

            return true;

        }

        public static function Parameters_Contain($params, $value)
        {

            if (is_array($params) && array_key_exists($value, $params))
                return true;

            return false;

        }

        public static function Value_Contained($value, $array)
        {

            if (!empty($value) && is_array($array) && in_array($value, $array))
                return true;

            return false;

        }

        public static function Mode_Matches_Case($mode, $case)
        {

            if (!is_int($case) || $case < 1 || $case > 2)
                return false;

            if ($case == 1)
            {

                if (!in_array($mode, self::$CREATE))
                    return false;

            }

            else
            {

                if (!in_array($mode, self::$DEBUG))
                    return false;

            }

            return true;

        }

        public static function Unroll_Select_Structure($structure_map)
        {

            $is_label = false;
            $is_content = false;
            $is_options = false;
            $is_selected = false;
            $row_res = null;
            $result = null;

            foreach ($structure_map as $key => $value)
            {

                if (is_array($value))
                    $row_res = self::Unroll_Select_Structure($value);

                if ($key === 'value')
                {

                    if (empty($value))
                        return false;

                    $result = 'value="' . $value . '"';

                }

                else if ($key === 'selected' && self::Is_Logic($value) && $value === true)
                    $is_selected = true;

                else if ($key === 'content' && $is_label === false)
                {

                    if (empty($value))
                        return false;

                    $is_content = true;

                    if ($is_selected === true)
                        $result .= 'selected>' . $value;

                    else
                        $result .= '>' . $value;

                }

                else if ($key === 'label' && $is_content === false)
                {

                    if (empty($value))
                        return false;

                    $is_label = true;

                    if ($is_selected === true)
                        $result = 'label="' . $value . '" selected>';

                    else
                        $result = 'label="' . $value . '">';

                }

                else if ($key === 'optlabel')
                {

                    if (empty($value))
                        return false;

                    $tmp = $result;
                    $result = 'label="' . $value . '">' . $tmp;

                }

                else if ($key === 'options')
                {

                    $is_options = true;

                    $result = $row_res;

                }

                else if (strstr($key, 'option'))
                {

                    if (strstr($row_res, 'label'))
                        $result .= '<option ' . $row_res;

                    else
                        $result .= '<option ' . $row_res . '</option>';

                }

                else if (strstr($key, 'optgroup'))
                    $result .= '<optgroup ' . $row_res;

            }

            return $result;

        }

        public static function Call_User_Function($action_string)
        {

            if (empty($action_string) || !is_string($action_string))
                return false;

            $parenthesis_pos = strpos($action_string, '(');

            $function = substr($action_string, 0, $parenthesis_pos);
            $parameters = substr($action_string, $parenthesis_pos + 1, -1);

            call_user_func($function, $parameters);

            return true;

        }

        public static function Parse_Event_Parameters($params)
        {

            if (!is_string($params))
                return false;

            $final_message = null;
            $params_array = explode(',', $params);

            foreach ($params_array as $argument)
                $final_message .= $argument . ' ';

            return $final_message;

        }

        public static function Error($element, $code_key)
        {

            if (!is_string($element) && !is_int($code_key))
                return false;

            $error = null;

            if ($code_key === 1)
               $error = 'Empty content.';

            else if ($code_key === 2)
               $error = 'Invalid structure of attributes or events.';

            else if ($code_key === 3)
               $error = 'Missing "type" attribute.';

            else if ($code_key === 4)
               $error = 'The "type" attribute has an invalid value ("button", "submit" or "reset" expected)';

            else if ($code_key === 5)
                $error = 'Empty attribute.';

            else if ($code_key === 6)
                $error = 'Invalid HTML5 attribute.';

            else if ($code_key === 7)
                $error = 'Empty event.';

            else if ($code_key === 8)
                $error = 'Invalid Javascript event.';    

            else if ($code_key === 9)
                $error = 'Invalid structure of attributes or events in fetch function.';    

            else if ($code_key === 10)
                $error = 'Invalid HTML5 attribute in fetch function.';    

            else if ($code_key === 11)
                $error = 'Invalid Javascript event in fetch function.';

            else if ($code_key === 12)
                $error = 'Missing "href" attribute.';

            else if ($code_key === 13)
                $error = 'Empty "href" attribute.';  

            else if ($code_key === 14)
                $error = 'Content in fetch function is invalid (Boolean expected)';

            else if ($code_key === 15)
                $error = 'Missing "src" attribute.';

            else if ($code_key === 16)
                $error = 'Empty "src" attribute.';  

            else if ($code_key === 17)
                $error = 'Missing "src" or "alt" attribute.';

            else if ($code_key === 18)
                $error = 'Empty "src" or "alt" attribute.';

            else if ($code_key === 19)
                $error = 'Missing "name" or "value" attribute.';

            else if ($code_key === 20)
                $error = 'Empty "name" or "value" attribute.';

            else if ($code_key === 21)
                $error = 'Missing "size" attribute.';

            else if ($code_key === 22)
                $error = 'Invalid value for "size" attribute.';

            else if ($code_key === 23)
                $error = 'Invalid value for "type" attribute.';

            else if ($code_key === 24)
                $error = 'Missing "for" attribute.';

            else if ($code_key === 25)
                $error = 'Empty "for" attribute.';

            echo '<div style="padding: 2px; background-color: #F56E6E; text-align: center; color: #FFFFFF;">
                    <span style="font-weight: 600;">SPLASH ERROR</span> - 
                    <span style="color: #FFE4E4;">Element: </span>' . $element . ' | 
                    <span style="color: #FFE4E4;">Error: </span>' . $error . 
                 '</div>';

        }

    }

    /* ------------------------- END ------------------------- */

?>
