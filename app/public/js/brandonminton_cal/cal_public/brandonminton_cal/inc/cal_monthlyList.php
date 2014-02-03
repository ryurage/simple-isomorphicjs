<?php
/*
This commented code is a legal notice and may not be removed:

Brandon Minton's Calendar' RESERVES THE RIGHT TO CHANGE THE TERMS OF THESE LICENSE AGREEMENTS AT ANY TIME.
Changes to the License Agreements will be announced on the 'Brandon Minton's Calendar Guide' web site, http://brandonminton.com/cal_guide.html/  Failure to receive notification of a change does not make those changes invalid. Current copies of the License Agreements will be available on this page.

By accepting a License Agreement form 'Brandon Minton's Calendar' or any previous license agreement you have agreed to be bound by the Terms and Conditions of the Agreement and by that any subsequent agreement, and that there no circumstances where deviation from the agreed Terms and Conditions is permissible. The Terms and Conditions of the Agreement is presented in the file called 'cal_legal_notice.php'.  Please beware that failure to carryout your obligations under the agreement could be seen as a breach of contract leading to termination of your licence with 'Brandon Minton's Calendar'. 
*/

require_once("cal_db.inc.php");

$eaag = "<strong>Events at a glance:</strong> <br />";
$monthlyEventList = buildMonthBlock($_GET['m'],'26',$_GET['y']);
if ($monthlyEventList != ""){
	print($eaag.$monthlyEventList);
}else { print(""); }
?>