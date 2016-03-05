<?php
    /*
        micro-MVC
        
        File name: test.php
        Description: This file contains the "test" asset.
        
        Coded by George Delaportas (ViR4X)
        Copyright (C) 2015
    */
    
    if (!empty($_POST) && $_POST['id'] == '1')
        echo 'OK';
    else
        echo 0;
?>
