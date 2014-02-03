<input type="hidden" id="dateSelected" value=""/>
<link rel="stylesheet" type="text/css" href="/style/default/calendar.css" />
<script language="JavaScript" SRC="/js/suggest.js"></script>
<div 
   id="addContextMenuDiv" 
   class="contextMenuDiv"
   onmouseout="javaScript:gracefulContextMenuClose(event);">

<a id="addLink" href="#_self" onclick="addEventBox(document.getElementById('dateSelected').value);HideContent('addContextMenuDiv'); return true;">Add Event</a>
</div>
<div 
   id="deleteContextMenuDiv" 
   class="contextMenuDiv"
   onmouseout="javaScript:gracefulContextMenuClose(event);">
<a id="delLink" href="#_self" onclick="editEvent(document.getElementById('dateSelected').value);HideContent('deleteContextMenuDiv'); return true;">Edit Event</a>
<br/>
<a id="delLink" href="#_self" onclick="deleteEventBox(document.getElementById('dateSelected').value);HideContent('deleteContextMenuDiv'); return true;">Delete Event</a>


</div>

<span style="position:absolute;bottom:150px; " name="myspan" id="myspan"></span>
<script language="javascript" src="js/functions.js"></script>
<?php 
// if called via ajax, dont display style sheet and javascript again
if (!isset($_GET['ran'])) {
?>
<div id="event_list" style="display:none;"></div>
<div id="add_event_box" style="display:none"></div>
<h2>A rather roughly hewn example of my events calendar.</h2>
<link rel="stylesheet" type="text/css" href="./css/calendar.css" />

<!-- the small calendar stuff for entering start and end dates -->
<script language="JavaScript" SRC="js/calendarPopup.js"></script>
<!-- <script language="JavaScript" SRC="./prototype.js"></script> -->

<!-- the scripts below are used for the main calendar -->
<script language="javascript">

var cal = new CalendarPopup();  // this produces the small calendar for choosing dates

document.write(getCalendarStyles());  // this writes the small calendar styles

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
include_once('inc/cal_classes.php');
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
