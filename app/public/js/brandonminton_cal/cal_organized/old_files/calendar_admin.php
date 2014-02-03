<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"
"http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1">
<title>A quick calendar</title>
<script language="JavaScript" SRC="./contextMenu.js"></script>
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
<body>
<h2>A rather roughly hewn example of my events calendar.</h2>
<div id="event_list" style="display:none;"></div>
<div id="add_event_box" style="display:none"></div>
<div id="divDisableCal">
<input type="hidden" id="dateSelected" value=""/>
<?php require_once('quick_calendar_admin.php'); ?></div>
<!--
<a id="previewToggle" href="javascript:;" onclick="javascript:toggleLiveView('live_preview','previewToggle');">click here for a live preview</a><br /><br />
<div id="live_preview" style="display:none;">
	<div id="divDisableCal">
	<?php //require_once('quick_calendar.php'); ?></div>
	<br />
	<div style="">
	</div>
	<div id="description"></div> 
</div> --><!-- close 'live_preview' -->
<div 
   id="addContextMenuDiv" 
   style="display:none; 
      position:absolute; 
      border: 1px solid black; 
      background-color: white;
      padding: 4px;
      font: 12px Verdana"
   onmouseout="javaScript:gracefulContextMenuClose(event);">

<a id="addLink" href="#_self" onclick="addEventBox(document.getElementById('dateSelected').value);HideContent('addContextMenuDiv'); return true;">Add Event</a>


</div>
<div 
   id="deleteContextMenuDiv" 
   style="display:none; 
      position:absolute; 
      border: 1px solid black; 
      background-color: white;
      padding: 4px;
      font: 12px Verdana"
   onmouseout="javaScript:gracefulContextMenuClose(event);">

<a id="delLink" href="#_self" onclick="deleteEventBox(document.getElementById('dateSelected').value);HideContent('deleteContextMenuDiv'); return true;">Delete Event</a>


</div>
<span style="position:absolute;bottom:150px; " name="myspan" id="myspan"></span>
</body>
</html>