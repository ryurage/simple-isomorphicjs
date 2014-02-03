<?php
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
}

// CONFIGURE THE DB ACCESS
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

// name of css
$css = 'calendar';

// Location of the calendar script file from the root
$ajaxPath = './quick_calendar_admin.php';

// END OF CONFIGURATION. YOU CAN CHANGE THE CSS. THE OTHER CODES CAN BE KEPT AS DEFAULT IF YOU WANT.

$sql = "SELECT * FROM $tableName WHERE (month='$m' AND year='$y') || (month='*' AND year='$y') || (month='$m' AND year='*') || (month='*' AND year='*')";

$rs = mysql_query($sql);
$links = array(); 
while ($rw = mysql_fetch_array($rs)) {
	extract($rw);
	$links[] = array('day'=>$day, 'month'=>$month, 'year'=>$year, 'link'=>$link, 'desc'=>$desc, 'what'=>$what, 'start_time'=>$start_time, 'start_date'=>$start_date);
}
?>
<?php 
// if called via ajax, dont display style sheet and javascript again
if (!isset($_GET['ran'])) {
?>
<link rel="stylesheet" type="text/css" href="./calendar.css" />
<script language="javascript">

function createCObject() { 
   var req; 
   if(window.XMLHttpRequest){ 
      // Firefox, Safari, Opera... 
      req = new XMLHttpRequest(); 
   } else if(window.ActiveXObject) { 
      // Internet Explorer 5+ 
      req = new ActiveXObject("Microsoft.XMLHTTP"); 
   } else { 
      alert('Problem creating the XMLHttpRequest object'); 
   } 
   return req; 
} 

// Make the XMLHttpRequest object 
var http = createCObject(); 

function displayCalendar(m,y) {
	var ran_no=(Math.round((Math.random()*9999))); 
	http.open('get', '<?= $ajaxPath; ?>?m='+m+'&y='+y+'&ran='+ran_no);
   	http.onreadystatechange = function() {
		if(http.readyState == 4 && http.status == 200) { 
      		var response = http.responseText;
      		if(response) { 
				document.getElementById("quickCalendarAdmin").innerHTML = http.responseText; 
      		} 
   		} 
	} 
   	http.send(null); 
}

function toggleVisibility(div){
  thisDiv = document.getElementById(div);
  if(thisDiv.style.display == 'none'){
	thisDiv.style.display = 'block';
  }
  else{
	thisDiv.style.display = 'none';
  }
  
//document.getElementById('event_list').style.classname='grayedOut';

}

function renderData(div, str){
	
	//toggleVisibility(div);
	document.getElementById(div).innerHTML =str;
}
</script>
<?php 
}
?>

<?php
class CreateCalendarArray {

	var $daysInMonth;
	var $weeksInMonth;
	var $firstDay;
	var $week;
	var $month;
	var $year;

	function CreateCalendarArray($month, $year) {
		$this->month = $month;
		$this->year = $year;
		$this->week = array();
		$this->daysInMonth = date("t",mktime(0,0,0,$month,1,$year));
		// get first day of the month
		$this->firstDay = date("w", mktime(0,0,0,$month,1,$year));
		$tempDays = $this->firstDay + $this->daysInMonth;
		$this->weeksInMonth = ceil($tempDays/7);
		$this->fillArray();
	}
	
	function fillArray() {
		// create a 2-d array
		for($j=0;$j<$this->weeksInMonth;$j++) {
			for($i=0;$i<7;$i++) {
				$counter++;
				$this->week[$j][$i] = $counter; 
				// offset the days
				$this->week[$j][$i] -= $this->firstDay;
				if (($this->week[$j][$i] < 1) || ($this->week[$j][$i] > $this->daysInMonth)) {	
					$this->week[$j][$i] = "";
				}
			}
		}
	}
}
class Calendar {
	
	var $html;
	var $weeksInMonth;
	var $week;
	var $month;
	var $year;
	var $today;
	var $links;
	var $css;

	function Calendar($cArray, $today, &$links, $css='') {
		$this->month = $cArray->month;
		$this->year = $cArray->year;
		$this->weeksInMonth = $cArray->weeksInMonth;
		$this->week = $cArray->week;
		$this->today = $today;
		$this->links = $links;
		$this->css = $css;
		$this->createHeader();
		$this->createBody();
		$this->createFooter();
	}
	function createHeader() {
  		$header = date('M', mktime(0,0,0,$this->month,1,$this->year)).' '.$this->year;
  		$nextMonth = $this->month+1;
  		$prevMonth = $this->month-1;
		switch($this->month) {
			case 1:
	   			$lYear = $this->year;
   				$pYear = $this->year-1;
   				$nextMonth=2;
   				$prevMonth=12;
   				break;
  			case 12:
   				$lYear = $this->year+1;
   				$pYear = $this->year;
   				$nextMonth=1;
   				$prevMonth=11;
      			break;
  			default:
      			$lYear = $this->year;
	   			$pYear = $this->year;
    	  		break;
  		}
		// --
		$this->html = "<table cellspacing='0' cellpadding='0' class='$this->css'>
		<tr>
		<th class='header'>&nbsp;<a href=\"javascript:;\" onclick=\"displayCalendar('$this->month','".($this->year-1)."')\" class='headerNav' title='Prev Year'><<</a></th>
		<th class='header'>&nbsp;<a href=\"javascript:;\" onclick=\"displayCalendar('$prevMonth','$pYear')\" class='headerNav' title='Prev Month'><</a></th>
		<th colspan='3' class='header'>$header</th>
		<th class='header'><a href=\"javascript:;\" onclick=\"displayCalendar('$nextMonth','$lYear')\" class='headerNav' title='Next Month'>></a>&nbsp;</th>
		<th class='header'>&nbsp;<a href=\"javascript:;\" onclick=\"displayCalendar('$this->month','".($this->year+1)."')\"  class='headerNav' title='Next Year'>>></a></th>
		</tr>";
	}
	function createBody(){
		// start rendering table
		$this->html.= "<tr><th>S</th><th>M</th><th>T</th><th>W</th><th>Th</th><th>F</th><th>S</th></tr>";
		for($j=0;$j<$this->weeksInMonth;$j++) {
			$this->html.= "<tr>";
			for ($i=0;$i<7;$i++) {
				$cellValue = $this->week[$j][$i];
				
				// if today
				if (($this->today['day'] == $cellValue) && ($this->today['month'] == $this->month) && ($this->today['year'] == $this->year)) {
					$cell = "<div class='today'>$cellValue</div>";
				}
				// else normal day
				else {
					$cell = "$cellValue";
				}
				// if days with link
				$numEvents = 0;
			foreach ($this->links as $val) {
				$aLinkVar = "";
					if (($val['day'] == $cellValue) && (($val['month'] == $this->month) || ($val['month'] == '*')) && (($val['year'] == $this->year) || ($val['year'] == '*'))) {			
			$cell = "<a href=\"javascript:;\" onclick=\"alert('{$cellValue}');\">$cellValue</a>";
						for ($k=0;$k<count($this->links);$k++){						
							if ((!empty($cell)) && ($this->links[$k]['day'] == $cellValue) ){
								$aLink = $this->links[$k];
								$theMonth = date('F', mktime(0,0,0,$aLink['month'],1,$this->year));
								//echo ($k+1).". ".$val['day']." and ".$cellValue."<br />";
								$desc=$aLink['desc'];
								$desc=str_replace(" ","\\\\t",$desc);  //admit, this is out of control...but a very small ammount of code!
								$aLinkVar .= "<div id=\'divDisabled".$numEvents."\' ><div class=\'eventBlock\'><span class=\'eventLink\'  onclick=renderData(\'divDetails".$numEvents."\',\'{$desc}\'); >".$aLink['start_time']." ".$aLink['what']."</span><div id = \'divDetails".$numEvents."\' class=\'details\' style=\'display:none;\'></div></div></div>";
								//$cell = "<span onclick=\"printList('{$theMonth} {$cellValue}, {$aLink['year']}', '{$aLinkVar}');document.getElementById('divDisableCal').className = 'grayedOut';\"><div class='link'>$cellValue</div></span>";
							}
						}
						break;
					} 
				}	
				$this->html.= "<td>$cell</td>";
			}
			$this->html.= "</tr>";
		}	
	}	
	
	function createFooter() {
		$this->html .= "<tr><td colspan='7' class='footer'><a href=\"javascript:;\" onclick=\"displayCalendar('{$this->today['month']}','{$this->today['year']}')\" class='footerNav'>Today is {$this->today['day']} ".date('M', mktime(0,0,0,$this->today['month'],1,$this->today['year']))." {$this->today['year']}</a></td></tr></table>";
	}
	
	function render() {
		echo $this->html;
	}

}

?>
<?php
// render calendar now
$cArray = &new CreateCalendarArray($m, $y);
$cal = &new Calendar($cArray, $today, $links, $css);
if (!isset($_GET['ran'])) {
	echo "<div id='quickCalendarAdmin'>";
}
$cal->render();
if (!isset($_GET['ran'])) {
	echo "</div>";
}
?>