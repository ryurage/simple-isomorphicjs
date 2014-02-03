<?php 
header("Cache-Control: no-store, no-cache");
header("Pragma: no-cache");



// CONFIGURE THE DB ACCESS
$dbhost = 'localhost';
$dbuser = 'brandot7_cal';
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


function writeRepeatSched(){
		global $tableName2,$startMonth,$startDay,$startYear,$start_time,$endMonth,$endDay,$endYear,$end_time,$startDate,$endDate,$recordID;
		$tempStartDate = strtotime($startDate);
		$tempEndDate = strtotime($endDate);
	

		if ($tempStartDate < $tempEndDate){  //Multiple Day Event
			
			if(($_POST['repeat_interval']=="daily")||($_POST['repeat_interval']=="does not repeat")) {
				if(isset($_POST['repeat_every'])){
				$dailyOccurence = $_POST['repeat_every'];
				
				}
				else {
				$dailyOccurence = 1;
				}
				$numRepeats = ($tempEndDate - $tempStartDate)/86400;
			
		   	    for($i = 0;$i <= $numRepeats;$i=$i+$dailyOccurence){
				  $newDate = date("Y-m-d",mktime(0,0,0,$startMonth,$startDay + $i,$startYear));
		 	      $sql = "INSERT INTO $tableName2 (id,date,start_time,end_time) VALUES ($recordID,'".$newDate."','".$start_time."','".$end_time."')";
		          $result=mysql_query($sql) or die('Database operation "'.$sql.'" failed. '.mysql_error()); 
			    } //end for
			}//end if
			elseif($_POST['repeat_interval']=="weekly"){
				if(isset($_POST['repeat_every'])){
					$weeklyOccurence = $_POST['repeat_every'];
				}
				else {
					$weeklyOccurence = 1;
				}
				$numRepeats = (($tempEndDate - $tempStartDate)/86400)/7;
				$days_of_week = explode("|",$_POST['dOW']);
				
				$startDayOfWeek = date("w",mktime(0,0,0,$startMonth,$startDay,$startYear));
				
				for($i = 0;$i <= $numRepeats;$i=$i+$weeklyOccurence){  //Weekly Loop
					$newDay = $startDay + ($i * 7);
					foreach ($days_of_week as $dow){ //Daily Loop 
						$dOWdiff = abs($startDayOfWeek - $dow);

						if($startDayOfWeek > $dow){
							$newStartDay = $newDay-$dOWdiff;
						}
						else{
							$newStartDay = $newDay+$dOWdiff;
						}

						//if(($startDayOfWeek < $dow) && ($i > 0)||($startDayOfWeek == $dow)||($startDayOfWeek > $dow)){
						$newDate = date("Y-m-d",mktime(0,0,0,$startMonth,$newStartDay,$startYear));
						$tempNewDate = strtotime($newDate);
				
						if ((!($tempNewDate < $tempStartDate)) && (!($tempNewDate > $tempEndDate))){
							$sql = "INSERT INTO $tableName2 (id,date,start_time,end_time) VALUES ($recordID,'".$newDate."','".$start_time."','".$end_time."')";
							$result=mysql_query($sql) or die('Database operation "'.$sql.'" failed. '.mysql_error()); 
						}
					}
			    }			
				
			}//end elseif
		
			elseif($_POST['repeat_interval']=="monthly") {
				$numYears = 0;
				$numMonths = 0;
				$numYears = $endYear - $startYear;
				$months_of_year = -1;
				if(isset($_POST['mOY'])){
					$months_of_year = explode('|',$_POST['mOY']);
				}
				
				print $months_of_year;
				//Calculate number of months between start and end date
				if (($numYears > 0) && ($endMonth >= $startMonth))
					{$numMonths = $numYears * 12;}
				else if (($numYears > 0) && ($endMonth < $startMonth))
					{$numMonths = ($numYears-1) * 12;}

				if ($endMonth < $startMonth)
					{$tempEndMonth = $endMonth + 12;}
				else {$tempEndMonth = $endMonth;}
				
				$numMonths = $numMonths + ($tempEndMonth - $startMonth);
				
				if ($endDay < $startDay)
					{$numMonths - 1;}
	
				    //Write each event to the database
		   		for($i = 0;$i <= $numMonths;$i++){
					$newMonth = date("n",mktime(0,0,0,$startMonth+$i,0,0));

					if($months_of_year != -1){
						foreach($months_of_year as $moy){
							if($newMonth == ($moy -1)){
								
								print ($newMonth.":".$moy."<br/>");
								$newDate = date("Y-m-d",mktime(0,0,0,$startMonth + $i,$startDay,$startYear));
								$sql = "INSERT INTO $tableName2 (id,date,start_time,end_time) VALUES ($recordID,'".$newDate."','".$start_time."','".$end_time."')";

								print ($sql."<br/>");
								$result=mysql_query($sql) or die('Database operation "'.$sql.'" failed. '.mysql_error()); 
							}//end if
						}//end foreach
					}//end if
					else {
								$newDate = date("Y-m-d",mktime(0,0,0,$startMonth+$i,$startDay,$startYear));
								$sql = "INSERT INTO $tableName2 (id,date,start_time,end_time) VALUES ($recordID,'".$newDate."','".$start_time."','".$end_time."')";
								$result=mysql_query($sql) or die('Database operation "'.$sql.'" failed. '.mysql_error()); 
					
					}//end else

				} //end for
			

			}//end elseif
			elseif($_POST['repeat_interval']=="yearly"){
				$numYears = 0;
				$numYears = $endYear - $startYear;
				
				if (($numYears > 0) && ($endMonth < $startMonth))
					{$numYears -= 1;}
				if (($numYears > 0) && ($endDay < $startDay) && ($endMonth == $startMonth))
					{$numYears -= 1;}
							
		   	    for($i = 0;$i <= $numYears;$i++){
				  $newDate = date("Y-m-d",mktime(0,0,0,$startMonth,$startDay,$startYear+$i));
				  $sql = "INSERT INTO $tableName2 (id,date,start_time,end_time) VALUES ($recordID,'".$newDate."','".$start_time."','".$end_time."')";
		          $result=mysql_query($sql) or die('Database operation "'.$sql.'" failed. '.mysql_error()); 
			    } //end for

			}//end elseif

		}//end if
		else{
		$sql = "INSERT INTO $tableName2 (id,date,start_time,end_time) VALUES ($recordID,'".$startDate."','".$start_time."','".$end_time."')";
		$result=mysql_query($sql); 
		}
}



if(isset($_POST['deleteAction'])){
    $sql = "SELECT id FROM $tableName2 WHERE event_id =".$_POST['id'];
	$result=mysql_query($sql) or die('Database operation "'.$sql.'" failed. '.mysql_error()); 
	while ($row = mysql_fetch_assoc($result)) {
		$id = $row['id'];
	}
	

	if($_POST['deleteAction'] == "event"){ //DELETE SINGLE EVENT IN SERIES
		$sql = "DELETE FROM $tableName2 WHERE event_id =".$_POST['id'];
		$result=mysql_query($sql) or die('Database operation "'.$sql.'" failed. '.mysql_error()); 
	}
	else{
		$sql = "DELETE FROM $tableName1 WHERE id =".$id;
		$result=mysql_query($sql) or die('Database operation "'.$sql.'" failed. '.mysql_error()); 

		$sql = "DELETE FROM $tableName2 WHERE id =".$id;
		$result=mysql_query($sql) or die('Database operation "'.$sql.'" failed. '.mysql_error()); 
	}

}
else{
	
	// END OF CONFIGURATION. YOU CAN CHANGE THE CSS. THE OTHER CODES CAN BE KEPT AS DEFAULT IF YOU WANT.
	$startDate = explode('/',$_POST['sdate']);
	$startMonth = $startDate[0];
	$startDay = $startDate[1];
	$startYear = $startDate[2];
	$startDate = $startYear."-".$startMonth."-".$startDay;

	if(isset($_POST['noEDate'])){
	$endMonth = $startMonth;
    $endDay = $startDay;
	$endYear = $startYear + 5;
	$endDate = $endYear."-".$endMonth."-".$endDay;
	}
	elseif($_POST['edate'] == ""){
	$endDate = $startDate;
	}
	else{
	$endDate = explode('/',$_POST['edate']);
	$endMonth = $endDate[0];
    $endDay = $endDate[1];
	$endYear = substr($endDate[2],0,4);  //the end of the explode has some undefined stuff with it so subtr was mandatory to get daily repeating events
	$endDate = $endYear."-".$endMonth."-".$endDay;
	}
	if ($_POST['submit'] == "Update"){
		$recordID = $_POST['id'];
		$sql = "DELETE FROM $tableName2 WHERE id =".$recordID;
		$result=mysql_query($sql) or die('Database operation "'.$sql.'" failed. '.mysql_error()); 
 
		if ($startDate == $endDate){
		$repeat_int = "does not repeat";
		}
		else {
		$repeat_int = $_POST['repeat_interval'];
		}

		$sql = "UPDATE $tableName1 SET what='".$_POST['what'].
			                       "',descript='".$_POST['description'].
								   "',location='".$_POST['location'].
								   "',repeat_interval='".$repeat_int.
								   "' WHERE id =".$recordID;

		$result=mysql_query($sql) or die('Database operation "'.$sql.'" failed. '.mysql_error()); 
	
	}
	else{
		//$sql = "INSERT INTO calendar (month,day,year,what,descript,location,repeat_interval,start_date,end_date,start_time,end_time) VALUES ('".$startMonth."','".$startDay."','".$startYear."','".$_POST['what']."','".$_POST['description']."','".$_POST['location']."','".$_POST['repeat_interval']."','".$startDate."','".$endDate."','".$start_time."','".$end_time."')";
		

		//Write calendar event info to Calendar table
		$sql = "INSERT INTO $tableName1 (what,descript,location,repeat_interval) VALUES ('".$_POST['what']."','".$_POST['description']."','".$_POST['location']."','".$_POST['repeat_interval']."')";
		$result=mysql_query($sql) or die('Database operation "'.$sql.'" failed. '.mysql_error()); 
		
		
		//Get Calendar event ID from event_series table for reoccuring events
		$recordID = mysql_insert_id();
			
	}
		
	if(isset($_POST['start_time'])){
		$start_time = $_POST['start_time'];
	   }
	   else {
		$start_time = "12:00 AM";
	}

	if(isset($_POST['end_time'])){
		$end_time = $_POST['end_time'];
	}
	else {
		$end_time = "11:59 PM";
	}

	//Write to event_series table		
	writeRepeatSched();

}
//$result=mysql_query($sql) or die('Database operation "'.$sql.'" failed. '.mysql_error()); 

/*if ($_POST['submit'] == "submit"){
		$sql = "SELECT @last_ins := LAST_INSERT_ID();".
				"UPDATE event_series SET id=@last_ins'".$startMonth.
								   "',repeat_interval='".$_POST['repeat_interval'].
								   "',start_date='".$startDate.
								   "',end_date='".$endDate."' WHERE id=".$_POST['id'];
}*/

//print($result);



?>