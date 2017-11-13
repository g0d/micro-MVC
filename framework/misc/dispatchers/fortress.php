<?
	/*
		Fortress (AJAX dispatcher)
		
		File name: fortress.php
		Description: This file contains the Fortress - AJAX dispatcher with controllable gates.
		
		Coded by George Delaportas (ViR4X)
		Copyright (C) 2016
		Open Software License (OSL 3.0)
	*/

    // Check for direct access
    if (!defined('micro_mvc'))
        exit();

	// Load registered activities (gates)
	$user_activities = UTIL::Load_Activities();

	if ($user_activities === false || !in_array($_POST['gate'], $user_activities))
	{
		echo -1;

		exit();
	}

	// Include corresponding gate
	require('framework/misc/gates/' . $_POST['gate'] . '.php');

	// ----------------------------
?>
