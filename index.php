<?php
    /*
        micro-MVC
        
        File name: index.php
        Description: This file contains the index.
        
        Coded by George Delaportas (ViR4X)
        Copyright (C) 2015
    */

	// Include MICRO MVC framework
    require('micro_mvc.php');
    
    // Setup new routes
    MICRO_MVC::Setup_Route('test');
    
    // Read current route
    $this_route = MICRO_MVC::Get_Route('this');
?>

<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">
        <title>micro-MVC</title>
    </head>
    <body>
    <?php
        MICRO_MVC::Go_To($this_route);
    ?>
    </body>
</html>
