<?php
require_once("db.inc.php");

$eaag = "<strong>Events at a glance:</strong> <br />";
$monthlyEventList = buildMonthBlock($_GET['m'],'26',$_GET['y']);
if ($monthlyEventList != ""){
	print($eaag.$monthlyEventList);
}else { print(""); }
?>