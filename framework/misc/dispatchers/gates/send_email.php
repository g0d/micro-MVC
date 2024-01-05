<?php
	/*
		Send Email (Programmable gate for delivering emails) - { *** THIS IS A TEMPLATE / SAMPLE | NOT A FINAL CODE *** }
		
		File name: send_email.php
		Description: This file contains the send email gate.
		
		Coded by George Delaportas (G0D)
		Copyright (C) 2019
		Open Software License (OSL 3.0)
	*/

    // Check for direct access
    if (!defined('micro_mvc'))
        exit();

	// Load extensions
	UTIL::Load_Extension('woody', 'php');

	if (!empty($_POST['send']) && $_POST['send'] === '1' && !empty($_POST['email']))
	{
		$this_lang = UTIL::Get_Session_Variable('this_lang');
		$searches = array('{lang}', '{main}');
		$replaces = array($this_lang, UTIL::Load_Content('test_mail', 'static', $this_lang));
		$arguments = array($searches, $replaces);
		$message = UTIL::Fetch_Template('woody', $arguments);

		$result = Woody::Send_Mail('hello@micro-mvc.co', $_POST['email'], 'micro-MVC', $message);

		if (!empty($result))
			echo UTIL::Load_Content('email_sent', 'static', $this_lang);
		else
			echo UTIL::Load_Content('email_not_sent', 'static', $this_lang);
	}
	else
		echo '-1';
?>
