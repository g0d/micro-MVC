<?php
    /*
        micro-MVC
        
        File name: test.php
        Description: This file contains the "test" asset for AJAX test calls.
        
        Coded by George Delaportas (ViR4X)
        Copyright (C) 2015
    */
    
    if (!empty($_POST['id']) && $_POST['id'] === '1')
        echo 'AJAX system is OK!';
    else
        print_r($_FILES);
?>
