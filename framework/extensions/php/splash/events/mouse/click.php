<?php

    /*

        localhost Ltd - spl@sh

        Version: 4.3

        File name: click.php
        Description: This file contains the server MOUSE CLICK event actions.

        Coded by George Delaportas (G0D)

        localhost Ltd
        Copyright (C) 2013
        Open Software License (OSL 3.0)

    */



    /* ------------------------ BEGIN ------------------------ */

    function Server_Mouse_Click($params)
    {

        $message = HELPERS::Parse_Event_Parameters($params);

        if ($message === false)
            return false;

        echo $message;

        return true;

    }

    /* ------------------------- END ------------------------- */

?>
