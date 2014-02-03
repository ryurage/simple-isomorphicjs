<?php
header("Cache-Control: no-store, no-cache");
header("Pragma: no-cache");

/*
 * INSTALLATION:
 * 1. Save the code in a file call quick_calendar.php. Then Insert this file into anywhere where 
 * you want the calendar to appear. Use:
 *
 *      require_once('quick_calendar.php');
 *
 *		or if you save the file elsewhere, require_once('dir_path/quick_calendar.php')
 *
 * 2. Create a table in your database. If you are using your own table, you need to map the fields
 * appropriately.
 *
 * CREATE TABLE `calendar` ( 
 * `id` INT NOT NULL AUTO_INCREMENT ,
`* day` VARCHAR( 2 ) NOT NULL ,
 * `month` VARCHAR( 2 ) NOT NULL ,
 * `year` VARCHAR( 4 ) NOT NULL ,
 * `link` VARCHAR( 255 ) NOT NULL ,
 * `descript` TEXT NOT NULL ,
 * PRIMARY KEY ( `id` ) 
 * );
 *
 * 3. Configure the db and path access below. Use any db of your choice. You can also configure 
 * the CSS to change the look and feel of the calendar.
 */

// This year
$y = date('Y');
// This month
$m = date('n');
// This Day
$d = date('j');
$today = array('day'=>$d, 'month'=>$m, 'year'=>$y);
// If user specify Day, Month and Year, reset the var

if (isset($_GET['m'])) {
	$y = $_GET['y'];
	$m = $_GET['m'];
	//echo $m."   xxx   ".$y."<br />";
}

// CONFIGURE THE DB ACCESS
$dbhost = 'localhost';
$dbuser = 'brandot7_cal';
//$dbpass = 'W!`z|1pVjj;F';
$dbpass = 'whoisoromendi1';
$database = "brandot7_calendar";
$dbConnect = mysql_connect($dbhost, $dbuser, $dbpass);
if (!$dbConnect) {
   die('Could not connect: ' . mysql_error());
}
$db_selected = mysql_select_db($database, $dbConnect);
if (!$db_selected) {
   die ('db selection error : ' . mysql_error());
}

// name of table
$tableName1 = 'calendar';
$tableName2 = 'event_series';
// name of css
$css = 'calendar';

// Location of the calendar script file from the root
$ajaxPath = './index.php';



// END OF CONFIGURATION. YOU CAN CHANGE THE CSS. THE OTHER CODES CAN BE KEPT AS DEFAULT IF YOU WANT.


function runQuery($sql){

	$rs = mysql_query($sql) or die('Database operation "'.$sql.'" failed. '.mysql_error()); 
	$qryData = array(); 
	$arrNR = array();
	$i = 0;
	while ($rw = mysql_fetch_array($rs)) {
		
		foreach($rw as $key=>$value){
			$arrNR[$key] = $value;
		}
		$qryData[$i] = $arrNR;
		$i+=1;
	}
	
	return $qryData;
}
if (($m < 10) && (strlen($m) == 1)){$m = "0".$m;}
if (($d < 10) && (strlen($d) == 1)){$d = "0".$d;}
$sqlDate = "".$y."-".$m."-";
$sql = "SELECT $tableName1.*,$tableName2.date as date FROM $tableName1,$tableName2 WHERE ($tableName2.date like '%".$sqlDate."%') AND ($tableName2.id = $tableName1.id)";

$links = runQuery($sql);

function buildEventBlock($month,$day,$year){
		$result = "";
		$aLinkVar = "";
		$title= "";
		$numEvents= 0;
		
	    global $tableName1,$tableName2;
		$sqlDate = $year."-".$month."-".$day;
		$sql = "SELECT $tableName2.event_id 
				FROM $tableName1,$tableName2 
				WHERE ($tableName2.date like '%".$sqlDate."%') AND ($tableName2.id = $tableName1.id)";	
		
		$result=runQuery($sql);

		foreach($result as $rs){
			$id = $rs['event_id'];
			$sql = "SELECT $tableName1.*,$tableName2.*
					FROM $tableName1,$tableName2 
					WHERE ($tableName2.event_id = '".$id."') AND ($tableName2.id = $tableName1.id)";
			
			$aLink = runQuery($sql) or die('Database operation "'.$sql.'" failed. '.mysql_error());
	
			$cellValue = $day;						
			$numEvents += 1;
				
			$duration = ($aLink[0]['start_time'] == '12:00 A' && $aLink[0]['end_time'] == '11:59 P') ? 'When: all day' : "When: ".$aLink[0]['start_time']." - ".$aLink[0]['end_time'];
			$desc="Location:".$aLink[0]['location']."|".$duration."|".$aLink[0]['descript']."|";
			$desc=str_replace(" ","\\\\t",$desc);  //admit, this is out of control...but a very small ammount of code!
			$title = str_replace(" ","\\\\t",$aLink[0]['what']); 
			$passedInfo = $aLink[0]['title']."|".$aLink[0]['event_id']."|".$month."/".$day."/".$year;		
			
			
			$aLinkVar .= "<div id=\'divDisabled".$numEvents."\' >".
						 "<div class=\'eventBlock\'>".
						 "<span class=\'eventLink\'  oncontextmenu=Click(event,\'".$passedInfo."\',\'deleteContextMenuDiv\'); onclick=renderData(\'divDetails".$numEvents."\',\'{$desc}\');grayOutTheRest(\'".$numEvents."\'); > ".$aLink[0]['what']."</span><!-- close span \'eventLink\' -->".
						 "<div id = \'divDetails".$numEvents."\' class=\'details\' style=\'display:none;\' onContextMenu=Click(event,\'".$passedInfo."\',\'deleteContextMenuDiv\');></div><!-- close \'divDetails\' -->".
						 "</div><!-- close \'eventBlock\' -->".
						 "</div><!-- close \'divDisabled\' -->";
		
		}
		return $aLinkVar;
}

function buildMonthBlock($month,$day,$year){  // this builds the monthly list of events in the 'month_elist' div
		$result = "";
		$aLinkVar = "";
		$title= "";
		$numEvents= 0;
		$tempAr = Array();
		
	    global $tableName1,$tableName2;
		$sqlDate = $year."-".$month."-".$day;  // it took me a year to realize that we had to check for the year as well
		$sql = "SELECT $tableName2.event_id FROM $tableName1,$tableName2 WHERE (MONTH($tableName2.date) like MONTH('".$sqlDate."')) AND (YEAR($tableName2.date) like YEAR('".$sqlDate."')) AND ($tableName2.id = $tableName1.id)";	
		
		$result=runQuery($sql);
		
		foreach($result as $rs){
			$id = $rs['event_id'];
			$sql = "SELECT $tableName1.*, $tableName2.event_id FROM $tableName1,$tableName2 WHERE ($tableName2.event_id = '".$id."') AND ($tableName2.id = $tableName1.id)";
			
			$aLink = runQuery($sql) or die('Database operation "'.$sql.'" failed. '.mysql_error());
	
			$cellValue = $day;						
			$numEvents += 1;
							
			//$desc="Location:".$aLink[0]['location']."|".$aLink[0]['descript'];
			//$desc=str_replace(" ","\\\\t",$desc);  //admit, this is out of control...but a very small ammount of code!
			//$title = str_replace(" ","\\\\t",$aLink[0]['what']);
			$title = $aLink[0]['what']; 
			//$passedInfo = $title."|".$aLink[0]['event_id']."|".$month."/".$day."/".$year;		
			
			//$aLinkVar .= $title."<br />";
			array_push($tempAr, $title);
			
		
		}
		$tempAr = array_unique($tempAr); /**** the use of this temporary array eliminates duplicates or repeating titles in the 'Events at a glance' list ****/
		foreach($tempAr as $key=>$val){
			$aLinkVar .= $val."<br />";
		}
		return $aLinkVar;
		
}
?>