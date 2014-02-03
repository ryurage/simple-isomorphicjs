<?php
require_once("db.inc.php");
$event = $_GET['e'];

$event = explode("|",$event);
$title = $event[0];
$id = $event[1];
$eventdate = explode("/",$event[2]);
$evtMon = $eventdate[0];
if($evtMon < 10){$evtMon = substr($evtMon,-1);}

$evtDay = $eventdate[1];
if($evtDay < 10){$evtDay = substr($evtDay,-1);}

$evtYr = $eventdate[2];

$seriesSQL = "SELECT id FROM $tableName2 WHERE (event_id=".$id.")";
$rs = runQuery($seriesSQL);

$seriesSQL = "SELECT * FROM $tableName2 WHERE (id=".$rs[0]['id'].") ORDER BY date";
$seriesResult = runQuery($seriesSQL);

$numEvents = count($seriesResult);


$delForm = '<br/><fieldset id="divDisableEF" onclick="grayOutTheRest(-2);">'.
		   '<legend>Delete Event Form</legend><span onclick="closeEventForm();" class="close">X</span>'.
		   'Are you sure you want to delete event: <b>'.$title.'</b>?<br/>'.
		   '<form name="deleteform" id="deleteform">'.
		   '<input type="hidden" id="id" value="'.$id.'">'.
		   '<input type="hidden" id="action" value="">'.
		   '<input type="button" name="deleteAction" value="Delete Event" onclick="document.getElementById(\'action\').value=\'event\';javascript:get(this.parentNode);setTimeout(\'refreshCalendar('.$evtMon.','.$evtDay.','.$evtYr.')\',75);closeEventForm();">';

if($numEvents > 1){
	$delForm .= '<input type="button" name="deleteAction" value="Delete Series" onclick="document.getElementById(\'action\').value=\'series\';javascript:get(this.parentNode);setTimeout(\'refreshCalendar('.$evtMon.','.$evtDay.','.$evtYr.')\',75);closeEventForm();">';
}	  

	$delForm .= '<input type="button" name="cancelDelete" value="Cancel" onclick="closeEventForm();"></form>'.'</fieldset>';

print ($delForm);
?>