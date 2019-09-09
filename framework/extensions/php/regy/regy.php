<?php
    /*
        Regy (Registration Manager)

        File name: regy.php (Version: 1.2)
        Description: This file contains the Regy extension.

        Coded by George Delaportas (G0D)
        Copyright © 2019
        Open Software License (OSL 3.0)
    */

    // Check for direct access
    if (!defined('micro_mvc'))
        exit();

    // Regy class
    class Regy
    {
        // Show registration form
        public static function Show_Form()
        {
            // Load registration from template
            $searches = array('{register}', '{register_button_text}');
            $replaces = array(UTIL::Load_Content('register', 'static'),
                              UTIL::Load_Content('register_button_text', 'static'));
            $arguments = array($searches, $replaces);
            $content = UTIL::Fetch_Template('registration_form', $arguments);

            return preg_replace('/[\n\r]/', '', $content);
        }
    }
?>

<script src="/framework/extensions/php/regy/regy.js"></script>
