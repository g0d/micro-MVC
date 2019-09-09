<?php
    /*
        KeyCard (Login form and logout button manager)

        File name: keycard.php (Version: 1.2)
        Description: This file contains the KeyCard extension.

		Coded by George Delaportas (G0D)
		Copyright (C) 2019
		Open Software License (OSL 3.0)
    */

    // Check for direct access
    if (!defined('micro_mvc'))
        exit();

    // KeyCard class
    class KeyCard
    {
        // Consistency flag
        private static $__login_form_active = false;

        // Show login form
        public static function Show_Login_Form()
        {
            self::$__login_form_active = true;

            // Load login from template
            $searches = array('{login}', '{login_button_text}');
            $replaces = array(UTIL::Load_Content('login', 'static'),
                              UTIL::Load_Content('login_button_text', 'static'));
            $arguments = array($searches, $replaces);
            $content = UTIL::Fetch_Template('login_form', $arguments);

            return preg_replace('/[\n\r]/', '', $content);
        }

        // Show logout button
        public static function Show_Logout_Button()
        {
            if (self::$__login_form_active === false)
                return null;

            // Load logout button template
            $searches = array('{logout_button_text}');
            $replaces = array(UTIL::Load_Content('logout_button_text', 'static'));
            $arguments = array($searches, $replaces);
            $content = UTIL::Fetch_Template('logout_button', $arguments);

            return preg_replace('/[\n\r]/', '', $content);
        }
    }
?>

<script src="/framework/extensions/php/keycard/keycard.js"></script>
