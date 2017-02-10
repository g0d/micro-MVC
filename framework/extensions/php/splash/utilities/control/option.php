<?php

    /*

        localhost Ltd - spl@sh

        Version: 4.3

        File name: option.php
        Description: This file contains the "OPTION" abstract class.

        Coded by George Delaportas (G0D)

        localhost Ltd
        Copyright (C) 2013
        Open Software License (OSL 3.0)

    */



    /* ------------------------ BEGIN ------------------------ */

    // Include CONTROL class
    require_once(UTIL::Absolute_Path('framework/extensions/php/splash/classes/control.php'));

    // Utility: [OPTION]
    abstract class OPTION extends CONTROL
    {

        // Attributes
        protected $__attr_name = null;
        protected $__attr_form = null;
        protected $__attr_autofocus = false;
        protected $__attr_required = false;
        protected $__attr_disabled = false;

        // Events
        protected $__event_focus = null;
        protected $__event_blur = null;
        protected $__event_change = null;

    }

    /* ------------------------- END ------------------------- */

?>
