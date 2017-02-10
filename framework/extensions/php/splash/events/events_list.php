<?php

    /*

        localhost Ltd - spl@sh

        Version: 4.3

        File name: events_list.php
        Description: This file contains the "EVENTS LIST" wrapper.

        Coded by George Delaportas (G0D)

        localhost Ltd
        Copyright (C) 2013
        Open Software License (OSL 3.0)

    */



    /* ------------------------ BEGIN ------------------------ */

    // Include MOUSE::CLICK event
    require(UTIL::Absolute_Path('framework/extensions/php/splash/events/mouse/click.php'));

    // Include KEY::DOWN event
    require(UTIL::Absolute_Path('framework/extensions/php/splash/events/key/down.php'));

    /* ------------------------- END ------------------------- */

?>
