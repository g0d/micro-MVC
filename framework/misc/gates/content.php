<?
    // Test - Fetch content based on ID (AJAX)
    if (!empty($_POST['content_id']))
    {
    	if (!empty($_POST['language_code']))
    		echo UTIL::Load_Content($_POST['content_id'], 'static', $_POST['language_code']);
    	else
    		echo UTIL::Load_Content($_POST['content_id'], 'static');
    }
?>
