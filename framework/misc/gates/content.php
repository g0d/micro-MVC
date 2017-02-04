<?
    // Fetch content based on ID
    if (!empty($_POST['content_id']))
    {
    	if (!empty($_POST['language_code']))
    		echo UTIL::Load_File_Contents($_POST['content_id'], $_POST['language_code']);
    	else
    		echo UTIL::Load_File_Contents($_POST['content_id']);
    }
?>
