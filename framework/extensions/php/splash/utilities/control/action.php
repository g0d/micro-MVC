<?php

    /*

        localhost Ltd - spl@sh

        Version: 4.3

        File name: action.php
        Description: This file contains the "ACTION" abstract class.

        Coded by George Delaportas (G0D)

        localhost Ltd
        Copyright (C) 2013
        Open Software License (OSL 3.0)

    */



    /* ------------------------ BEGIN ------------------------ */

    // Include CONTROL class
    require_once(UTIL::Absolute_Path('framework/extensions/php/splash/classes/control.php'));

    // Utility: [ACTION]
    abstract class ACTION extends CONTROL
    {

        // Events
        protected $__event_focus = null;
        protected $__event_blur = null;

    }

    /* ------------------------- END ------------------------- */

?>
