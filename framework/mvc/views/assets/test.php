<?php
    /*
        micro-MVC
        
        File name: test.php
        Description: This file contains the "test" asset.
        
        Coded by George Delaportas (ViR4X)
        Copyright (C) 2015
    */
    
    if (!empty($_POST['id']) == '1')
        echo 'OK';
    else
    {
        print_r($_POST);
        print_r($_FILES);
    }
?>
