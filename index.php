<?php
    /*
        micro-MVC
        
        File name: index.php
        Description: This file contains the index.
        
        Coded by George Delaportas (ViR4X)
        Copyright (C) 2015
    */
    
    // Enable/Disable errors
    error_reporting(E_ALL);
    
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
        $all_routes = MICRO_MVC::Get_Route('all');
        
        // Handle non existing pages
        if (!in_array($this_route, $all_routes))
            echo '<b>The page you requested does not exist!</b><br>';
        
        else
        {
            $args = '';

            MICRO_MVC::Go_To($this_route, $args);
        }
    ?>
    </body>
</html>
