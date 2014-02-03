<?php
require_once("db.inc.php");


function buildEditForm($id){
	$result = "";
	$aLinkVar = "";
	$startDayOfWeek = "";
	$endDayOfWeek = "";
	$editForm = "";
	global $tableName1,$tableName2;
	
	   $sql = "SELECT id FROM $tableName2 WHERE event_id =".$id;
	$result=mysql_query($sql) or die('Database operation "'.$sql.'" failed. '.mysql_error()); 
	while ($row = mysql_fetch_assoc($result)) {
		$id = $row['id'];
	}

	$sql = "SELECT * FROM $tableName1 WHERE (id=".$id.")";		
	$result = runQuery($sql);


	$seriesSQL = "SELECT * FROM $tableName2 WHERE (id=".$id." ) ORDER BY date";
	$seriesResult = runQuery($seriesSQL);


	foreach($result as $event) {
		$startDate = explode('-',$seriesResult[0]['date']);
		$m = $startDate[1];
		$d = $startDate[2];
		$y = $startDate[0];
		$startDate = $m."/".$d."/".$y;
		$numRepeats = count($seriesResult);
		$endDate = explode('-',$seriesResult[count($seriesResult)-1]['date']);
		$endDate = $endDate[1]."/".$endDate[2]."/".$endDate[0];
		$what = $event['what'];
		$repeat = $event['repeat_interval'];

		$tempStartDate = strtotime($startDate);
		$tempEndDate = strtotime($endDate);

	    $numDays = ($tempEndDate - $tempStartDate)/86400;
		$numEvents = count($seriesResult);
		
		switch ($repeat){
		case "daily":
			$repeat_occurence = $numDays/($numEvents -1);
			break;
		case "weekly":
			$startDayOWeek = date("w",mktime(0,0,0,$m,$d,$y));
			$endDayOfWeek = date("w",strtotime($endDate));

			if ($startDayOfWeek > $endDayOfWeek){
				$dOWDiff = $startDayOfWeek - $endDayOfWeek; 
				$tempEndDate = date("w",mktime(0,0,0,$endDate[1],$endDate[2]+$dOWDiff,$endDate[0]));
			}
			elseif($startDayOfWeek < $endDayOfWeek){
				$dOWDiff = $endDayOfWeek - $startDayOfWeek; 
				$tempEndDate = date("w",mktime(0,0,0,$endDate[1],$endDate[2]-$dOWDiff,$endDate[0]));
			}
			$numDays = ($tempEndDate - $tempStartDate)/86400;	
			$repeat_occurence = $numDays/7;	
			break;
		}

		$m=ltrim($m,'0');
		
		$start_time = $seriesResult[0]['start_time'].""; // these two lines used to have a capital M in the last quotes...hrmm
		$end_time = $seriesResult[0]['end_time']."";


	/*	$m = $event['month'];
		$d = $event['day']; 
		$y = $event['year'];
		
		$startDate = $m."/".$d."/".$y;
		$endDate = $event['end_date'];
		$endDate = explode('-',$endDate);
		$endDate = $endDate[1]."/".$endDate[2]."/".$endDate[0];
	*/
		$location = $event['location'];
		$description = $event['descript'];
		$id = $event['id'];
		
		$editForm = '<br/><fieldset id="divDisableEF" onclick="grayOutTheRest(-2);">'.
					'<legend>Edit Event Form</legend><span onclick="closeEventForm();" class="close">X</span>'.
					'<form action="javascript:get(document.getElementById(\'actionform\'));setTimeout(\'refreshCalendar('.$m.','.$d.','.$y.')\',75);closeEventForm();" name="actionform" id="actionform">'.
					//'<form action="javascript:get(document.getElementById(\'actionform\'));closeEventForm();" name="actionform" id="actionform">'.
					'What <input type="text" id="what" value="'.$what.'" /><br /><br />'.
					'When <div id="when"><input type="text" name="start_date"  value="'.$startDate.'" size=10 onClick="var cal1x = new CalendarPopup(\'smallcal1\');cal1x.select(document.forms[0].start_date,\'sdate\',\'MM/dd/yyyy\'); return false;" name="sdate" id="sdate">&nbsp;&nbsp;<div id="start_t">'.
					'<input type="text" name="start_time" id="start_time" size="7" value="'.$start_time.'" onclick="returnTime(\'timeList\');" /><div id="timeList"></div>'.
					'</div>&nbsp;&nbsp;to&nbsp;&nbsp;'.
					'<input type="text" name="end_date"  value="'.$endDate.'" size=10 onClick="var cal2x = new CalendarPopup(\'smallcal2\');cal2x.select(document.forms[0].end_date,\'edate\',\'MM/dd/yyyy\'); return false;"  name="edate" id="edate">&nbsp;&nbsp;<div id="end_t">'.
					'<input type="text" name="end_time" id="end_time" size="7" value="'.$end_time.'" onclick="returnTimeTo(\'timeListTo\');" /><div id="timeListTo"></div>'.
					'</div><br/></div>'.
					'<div style="margin-left:36px;margin-top:15px;">Repeats <select size="1" id="repeat" name="repeat" onchange="pickREvent(this);">';
		$arrRepeat = array('does not repeat','daily','weekly','monthly','yearly');
		
		foreach($arrRepeat as $item){
			$editForm .='<option value="'.$item.'"';
			if ($item == $repeat){
				$editForm .=' SELECTED';
		 	}
			$editForm .= '>'.$item.'</option>';
		}
		
		$editForm .='</select><br/></div><br />'.
					'<div id="r_info">'.
					'<div id="d"></div><div id="w"></div><div id="y"></div>'.
					'<div id="r_text"></div><div id="r_every">';

		if(($repeat == "daily") || ($repeat == "weekly")){
			$editForm .= "Repeat Every: <select id='daily_occurence'>";
			for ($i=1;$i<=14;$i++){
				$editForm .= "<option id='' style='display:block' value='".$i."'";
				if ($i == $repeat_occurence){
					$editForm .= " SELECTED";
				} 
				$editForm .=">".$i."</option>";
			}
			$editForm .= "</select>";
		}
		$editForm .='</div><div id="r_on">';
			if($repeat == "weekly"){		
					$arrDay = array('Sun','Mon','Tue','Wed','Thu','Fri','Sat');
					$j = 0;
					$oneDay="";
					foreach($arrDay as $wd){	
						$isChecked = false;
						foreach($seriesResult as $event){
												
							$oneDay = date("w", strtotime($event['date']));
							if ($oneDay == $j){
								$isChecked = true;
							}
						}
						if ($isChecked){
							$editForm.="<input type='checkbox' id='chkbx".$j."' value='true' CHECKED>&nbsp;".$wd."&nbsp;";
						}
						else{
							$editForm.="<input type='checkbox' id='chkbx".$j."' value='true'>&nbsp;".$wd."&nbsp;";
						}
						$j+=1;
					}
			}
		$editForm .='</div><div id="r_range"><div id ="cal3">';
			if( $repeat != "does not repeat"){
			/* $editForm .= "No End Date: <input type='checkbox' id='never_end' />"; */  //don't particularly need this as it causes more confusion than worth
			}
		$editForm .='</div></div>'.
					'</div><!-- end \'r_info\' -->'.
					'Where <input type="text" name="location" id="location" value="'.$location.'"/><br /><br />'.
					'Description <textarea cols="55" rows="5" id="description" name="description">'.$description.'</textarea><br /><br />'.
					'<input value='.$id.' type="hidden" name="id" id="id">'.
					'<input value="Update" type="submit" name="submit" id="submit">'.
					'</form></div>'.
					'<div id="smallcal1" style="position:absolute;visibility:hidden;background-color:white;"></div>'.
					'<div id="smallcal2" style="position:absolute;visibility:hidden;background-color:white;"></div>'.
					'</fieldset>';

	}
		return $editForm;
}

print(buildEditForm($_GET['id']));

?>
