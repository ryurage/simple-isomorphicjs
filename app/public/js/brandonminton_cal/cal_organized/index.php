<?php
header("Cache-Control: no-store, no-cache");
header("Pragma: no-cache");


require_once("./inc/db.inc.php");

if(!isset($_POST['ran1'])){
?>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"
"http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1">
<title>A quick calendar</title>
<script language="JavaScript" SRC="./js/contextMenu1.js"></script>
<script type="text/javascript">
function toggleLiveView(obj1, obj2){
	var e1 = document.getElementById(obj1);
	var e2 = document.getElementById(obj2);
	if (e1.style.display == 'none'){
		e2.innerHTML = 'hide preview';
		e1.style.display = '';
	}else {
		e1.style.display = 'none';
		e2.innerHTML = 'click here for a live preview';
	}
}
function activateCal(){
   //if event_list is displayed, remove grayedOut class from calendar and hide event_list
   if (document.getElementById('divDisableCal').className == 'grayedOut'){
	 document.getElementById('divDisableCal').className = 'none';
	 document.getElementById('event_list').style.display = 'none';
	  document.getElementById('add_event_box').style.display = 'none';
   }

}
</script>
</head>


<?php 
}
 
require_once('calendar_admin.php'); ?>


</body>
</html>