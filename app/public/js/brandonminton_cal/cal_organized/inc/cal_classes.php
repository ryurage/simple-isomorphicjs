<?php

class CreateCalendarArray {

	public $daysInMonth, $weeksInMonth, $firstDay, $week, $month, $year;

	public function __construct($month, $year) {
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
	
	protected function fillArray() {
		// create a 2-d array
		$counter = 0;
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
	
	public $weeksInMonth, $week, $month, $year, $today; 
	protected $html, $links, $css;

	public function __construct($cArray, $today, &$links, $css='') {
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
	public function createHeader() {
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

		$this->html = "<table cellspacing='0' cellpadding='0' class='$this->css'>
		<tr>
		<th class='header'>&nbsp;<a href=\"javascript:;\" onclick=\"closeEventList();displayCalendar('$this->month','".($this->year-1)."')\" class='headerNav' title='Prev Year'><<</a></th>
		<th class='header'>&nbsp;<a href=\"javascript:;\" onclick=\"closeEventList();displayCalendar('$prevMonth','$pYear');printMonthList('$prevMonth','$pYear');\" class='headerNav' title='Prev Month'><</a></th>
		<th colspan='3' class='header'>$header</th>
		<th class='header'><a href=\"javascript:;\" onclick=\"closeEventList();displayCalendar('$nextMonth','$lYear');printMonthList('$nextMonth','$lYear');\" class='headerNav' title='Next Month'>></a>&nbsp;</th>
		<th class='header'>&nbsp;<a href=\"javascript:;\" onclick=\"closeEventList();displayCalendar('$this->month','".($this->year+1)."')\"  class='headerNav' title='Next Year'>>></a></th>
		</tr>
		<script language=\"javascript\">
		
		</script>
		";
		
	}
	
	public function createBody(){

//echo $this->links[0]['day'];
		// start rendering table
		// echo "<a href='#_self' onclick='document.getElementById(&#39description&#39).innerHTML = &#39something fun!!!&#39;'>a test link</a>"; the testing single quote thingy
		$this->html.= "<tr><th>S</th><th>M</th><th>T</th><th>W</th><th>Th</th><th>F</th><th>S</th></tr>";
		for($j=0;$j<$this->weeksInMonth;$j++) {
			$this->html.= "<tr>";
			for ($i=0;$i<7;$i++) {
				$cellValue = $this->week[$j][$i];
				
				// if today
				if (($this->today['day'] == $cellValue) && ($this->today['month'] == $this->month) && ($this->today['year'] == $this->year)) {
					$cell = "<div class='today'><span 
					               onclick=\"activateCal();return Click(event,'{$this->month}/{$cellValue}/{$this->year}','addContextMenuDiv');\"
					               ondblclick=\"return dont(event);\"
								   oncontextmenu=\"return dont(event);\" 
								   style=\"cursor: pointer;\">$cellValue</span></div>";
					$cellClass = "todayLink";
				}
				// else normal day
				else {
					  $cell = "<span onclick=\"activateCal();return	Click(event,'{$this->month}/{$cellValue}/{$this->year}','addContextMenuDiv');\"
					               ondblclick=\"return dont(event);\"
                                   oncontextmenu=\"return dont(event);\" 
								   style=\"cursor: pointer;\">$cellValue</span>";
				      $cellClass = "link";
				}
				// if days with link/event
				$numEvents = 0;
				
			foreach ($this->links as $val) {
				$aLinkVar = "";
					//if (($val['day'] == $cellValue) && (($val['month'] == $this->month) || ($val['month'] == '*')) && (($val['year'] == $this->year) || ($val['year'] == '*'))) {
						if($cellValue < 10){$cellDayVal = "0".$cellValue;}
						else {$cellDayVal = $cellValue;}
						$currentDate = $this->year."-".$this->month."-".$cellDayVal;
						if ($val['date']== $currentDate){
							$aLinkVar = buildEventBlock($this->month,$cellDayVal,$this->year);
							$theMonth = date('F', mktime(0,0,0,$this->month,1,$this->year));
							$cell = "<span onclick=\"printList('{$theMonth} {$cellValue}, {$this->year}','{$this->month}/{$cellValue}/{$this->year}', '{$aLinkVar}');\"
							ondblclick=\"return dont(event);\"
							oncontextmenu=\"return dont(event);\"><div class='$cellClass'>$cellValue</div></span>";
					
					} 
				}	
				$this->html.= "<td>$cell</td>";
			}
			$this->html.= "</tr>";
		}	
	}	
	
	public function createFooter() {
		$this->html .= "<tr><td colspan='7' class='footer'><a href=\"javascript:;\" onclick=\"closeEventList();displayCalendar('{$this->today['month']}','{$this->today['year']}')\" class='footerNav'>Today is ".date('M', mktime(0,0,0,$this->today['month'],1,$this->today['year']))." {$this->today['day']}, {$this->today['year']}</a></td></tr></table>";
	}
	
	function __toString(){  // return the html for the calendar
		return $this->html;
	}
}

?>