<?php

    /*

        localhost Ltd - spl@sh

        Version: 4.3

        File name: down.php
        Description: This file contains the server KEY DOWN event actions.

        Coded by George Delaportas (G0D)

        localhost Ltd
        Copyright (C) 2013
        Open Software License (OSL 3.0)

    */



    /* ------------------------ BEGIN ------------------------ */

    function Server_Key_Down($params)
    {

        $message = HELPERS::Parse_Event_Parameters($params);

        if ($message === false)
            return false;

        echo $message;

        return true;

    }

    /* ------------------------- END ------------------------- */

?>
