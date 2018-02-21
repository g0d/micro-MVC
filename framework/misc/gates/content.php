<?
	/*
		Content (Programmable gate for delivering content)
		
		File name: content.php
		Description: This file contains the content gate.
		
		Coded by George Delaportas (ViR4X)
		Copyright (C) 2017
		Open Software License (OSL 3.0)
	*/
	
    // Check for direct access
    if (!defined('micro_mvc'))
        exit();

	/*
	UTIL::Load_Extension('anti_hijack', 'php');

	function hijack_test($message)
	{
		if (!empty($message))
			echo $message . '<br><br>';
		else
			echo '::All Good::<br><br>';
	}

	$attack_params = array('hijack_test', 'I have "HIJACKED" you!');
	$normal_params = array('hijack_test');

	Anti_Hijack($_SERVER['REMOTE_ADDR'], $_SERVER['HTTP_USER_AGENT'], time(), 10, $attack_params, $normal_params);
	*/

    // Test - Fetch content based on ID (AJAX)
    if (!empty($_POST['content_id']))
    {
    	if (!empty($_POST['language_code']))
    		echo UTIL::Load_Content($_POST['content_id'], 'static', $_POST['language_code']);
    	else
    		echo UTIL::Load_Content($_POST['content_id'], 'static');
    }
?>
