<?
	/*
		Portal (REST Framework using POST)
		
		File name: portal.php (Version: 1.0)
		Description: This file contains the Portal - REST Framework (POST).
		
		Coded by George Delaportas (ViR4X)
		Copyright (C) 2016
		Open Software License (OSL 3.0)
	*/

    // Check for direct access
    if (!defined('micro_mvc'))
        exit();
    
	function Portal($url, $params_list = array(), $timeout_options = array())
	{
		if (empty($url))
			return false;

		$connect_timeout = 30;
		$opt_timeout = 60;
		$params = null;

		$curl = curl_init();

		curl_setopt($curl, CURLOPT_HEADER, false);
		curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
		curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
		curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, false);

		if (!empty($timeout_options))
		{
			if (count($timeout_options) !== 2)
				return false;
			else
			{
				$connect_timeout = $timeout_options[0];
				$opt_timeout = $timeout_options[1];
			}
		}

		curl_setopt($curl, CURLOPT_CONNECTTIMEOUT, $connect_timeout);
		curl_setopt($curl, CURLOPT_TIMEOUT, $opt_timeout);

		if (!empty($params_list))
		{
			foreach ($params_list as $key => $value)
				$params .=  $key . '=' . $value . '&';

			rtrim($params, '&');
		}

		curl_setopt($curl, CURLOPT_URL, $url);
		curl_setopt($curl, CURLOPT_POST, count($params_list));
		curl_setopt($curl, CURLOPT_POSTFIELDS, $params);

		$result = curl_exec($curl);

		curl_close($curl);

		return $result;
	}

	// ----------------------------
?>
