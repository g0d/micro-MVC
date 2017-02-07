<?
	/*
		Supervisor (Languages and routes central dispatcher)
		
		File name: supervisor.php
		Description: This file contains the Supervisor - Languages and routes central dispatcher.
		
		Coded by George Delaportas (ViR4X)
		Copyright (C) 2016
		Open Software License (OSL 3.0)
	*/

    // Check for direct access
    if (!defined('micro_mvc'))
        exit();
    
    if (empty($_POST['gate']))
    {
        $route_lang_exists = UTIL::Check_Route_Lang();

        if ($route_lang_exists === false)
        {
            header('Location: /en/');
            
            exit();
        }
        
        $this_lang = LANG::Get('this');
        $all_langs = LANG::Get('all');
        
        if (!isset($_SESSION['micro_mvc']['index']))
        {
            $_SESSION['micro_mvc']['index'] = true;
            
            header('Location: /' . $this_lang . '/');
            
            exit();
        }
        
        $this_route = MVC::Get_Route('this');
        $all_routes = MVC::Get_Route('all');
        
        require('framework/misc/dragon.php');
        
        UTIL::Set_Variable('this_lang', $this_lang);
        UTIL::Set_Variable('all_langs', $all_langs);
        UTIL::Set_Variable('this_route', $this_route);
        UTIL::Set_Variable('all_routes', $all_routes);
        
        unset($this_lang);
        unset($all_langs);
        unset($this_route);
        unset($all_routes);
    }
    else
    {
        if (MVC::Get_Route('this') !== 'root')
        {
            header('Location: /');
            
            exit();
        }
    }
?>
