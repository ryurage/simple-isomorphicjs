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
</script>
</head>
<div id="event_list" style="display:none;"></div>
<div id="add_event_box" style="display:none"></div>
<body><div id="divDisableCal">
<input type="hidden" id="dateSelected" value=""/>
<?php require_once('quick_calendar_admin2.php'); ?></div>
<br /><br /><!--
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
   id="uniquename3" 
   style="display:none; 
      position:absolute; 
      border: 1px solid black; 
      background-color: white;
      padding: 5px;
      width: 100px;
      font: 12px Verdana"
	   onmouseout="javaScript:gracefulContextMenuClose(event);">

<a id="clink" href="#_self" onclick="addEventBox(document.getElementById('dateSelected').value);HideContent('uniquename3'); return true;">Add Event</a>
<a id="clink" href="#_self">Delete Event</a>

</div>
<span style="position:absolute;bottom:150px; " name="myspan" id="myspan"></span>
</body>
</html>