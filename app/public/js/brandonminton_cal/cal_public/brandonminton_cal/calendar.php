<!--
This commented code is a legal notice and may not be removed:

Brandon Minton's Calendar' RESERVES THE RIGHT TO CHANGE THE TERMS OF THESE LICENSE AGREEMENTS AT ANY TIME.
Changes to the License Agreements will be announced on the 'Brandon Minton's Calendar Guide' web site, http://brandonminton.com/cal_guide.html/  Failure to receive notification of a change does not make those changes invalid. Current copies of the License Agreements will be available on this page.

By accepting a License Agreement form 'Brandon Minton's Calendar' or any previous license agreement you have agreed to be bound by the Terms and Conditions of the Agreement and by that any subsequent agreement, and that there no circumstances where deviation from the agreed Terms and Conditions is permissible. The Terms and Conditions of the Agreement is presented in the file called 'cal_legal_notice.php'.  Please beware that failure to carryout your obligations under the agreement could be seen as a breach of contract leading to termination of your licence with 'Brandon Minton's Calendar'. 

-->

<input type="hidden" id="dateSelected" value=""/>
<link rel="stylesheet" type="text/css" href="/style/default/calendar.css" />
<script language="JavaScript" SRC="./brandonminton_cal/js/suggest.js"></script>
</div>

<span style="position:absolute;bottom:150px; " name="myspan" id="myspan"></span>
<script language="javascript" src="./brandonminton_cal/js/cal_functions.js"></script>
<?php 
// if called via ajax, dont display style sheet and javascript again
if (!isset($_GET['ran'])) {
?>
<div id="event_list" style="display:none;"></div>


<link rel="stylesheet" type="text/css" href="./brandonminton_cal/css/calendar.css" />

<!-- the scripts below are used for the main calendar -->
<script language="javascript">

function displayCalendar(m,y) {
	var ran_no=(Math.round((Math.random()*9999))); 
	request2.open('get', '<?= $ajaxPath; ?>?m='+m+'&y='+y+'&ran='+ran_no);
   	request2.onreadystatechange = function() {
		if(request2.readyState == 4 && request2.status == 200) { 
      		var response = request2.responseText;
			//alert(response);
      		if(response) { 
					document.getElementById("quickCalendar").innerHTML = request2.responseText; 
					//document.body.innerHTML = request2.responseText;
      		} 
   		} 
	} 
   	request2.send(null); 
}

</script>
<?php 
}
?>
<?php
include_once('./brandonminton_cal/inc/cal_classes.php');
?>

<?php
// render calendar now
$cArray = &new CreateCalendarArray($m, $y);

$cal = &new Calendar($cArray, $today, $links, $css);

//if (!isset($_GET['ran'])) {
	echo "<div id='divDisableCal' style='width:230px;'>";
	echo "<div id='quickCalendar'>";
//}
echo $cal;  // this actually prints the calendar code
//if (!isset($_GET['ran'])) {
	echo "</div>";
	echo "</div>";
//}
?>

<script>
printMonthList('<?=$m?>','<?=$y?>');  // this sets the calendar with the right month and year
</script>
