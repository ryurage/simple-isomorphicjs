<?php
header("Cache-Control: no-store, no-cache");
header("Pragma: no-cache");
function runQuery($sql){

	$rs = mysql_query($sql);
	$qryData = array(); 
	while ($rw = mysql_fetch_array($rs)) {
		extract($rw);
		$qryData[] = array('day'=>$day, 'month'=>$month, 'year'=>$year, 'link'=>$link, 'description'=>$descript, 'what'=>$what, 'start_time'=>$start_time, 'start_date'=>$start_date, 'location'=>$location, 'id'=>$id);
	}
	return $qryData;
}

function buildEventBlock($month,$day,$year){

$dbhost = 'localhost';
$dbuser = 'root';
$dbpass = '2b6m4m2b';
$database = "test";
$dbConnect = mysql_connect($dbhost, $dbuser, $dbpass);
if (!$dbConnect) {
   die('Could not connect: ' . mysql_error());
}
$db_selected = mysql_select_db($database, $dbConnect);
if (!$db_selected) {
   die ('db selection error : ' . mysql_error());
}

// name of table
$tableName = 'calendar';

		$result = "";
		$aLinkVar ="";
		$numEvents = 0;
	    //global $tableName;
		$sql = "SELECT * FROM $tableName WHERE (month='$month' AND day = '$day' AND year='$year')";		
		$result = runQuery($sql);

		$cellValue = $day;						
		foreach($result as $aLink) {
		$numEvents += 1;
		
								
		$desc="Location:".$aLink['location']."|".$aLink['description'];
		$desc=str_replace(" ","\\\\t",$desc);  //admit, this is out of control...but a very small ammount of code!
		$title = str_replace(" ","\\\\t",$aLink['what']); 
		$aLinkVar .= "<div id=\'divDisabled".$numEvents."\' >".
					 "<div class=\'eventBlock\'>".
					 "<span class=\'eventLink\'  oncontextmenu=Click(event,\'".$title."|".$aLink['id']."\',\'deleteContextMenuDiv\'); onclick=renderData(\'divDetails".$numEvents."\',\'{$desc}\');grayOutTheRest(\'".$numEvents."\'); >".$aLink['start_time']." ".$aLink['what']."</span><!-- close span \'eventLink\' -->".
					 "<div id = \'divDetails".$numEvents."\' class=\'details\' style=\'display:none;\' onContextMenu=Click(event,\'".$title."|".$aLink['id']."\',\'deleteContextMenuDiv\');></div><!-- close \'divDetails\' -->".
			         "</div><!-- close \'eventBlock\' -->".
					 "</div><!-- close \'divDisabled\' -->";

		}
		return $aLinkVar;
}

print(buildEventBlock($_GET['m'],$_GET['d'],$_GET['y']));

?>
