/*
This commented code is a legal notice and may not be removed:

Brandon Minton's Calendar' RESERVES THE RIGHT TO CHANGE THE TERMS OF THESE LICENSE AGREEMENTS AT ANY TIME.
Changes to the License Agreements will be announced on the 'Brandon Minton's Calendar Guide' web site, http://brandonminton.com/cal_guide.html/  Failure to receive notification of a change does not make those changes invalid. Current copies of the License Agreements will be available on this page.

By accepting a License Agreement form 'Brandon Minton's Calendar' or any previous license agreement you have agreed to be bound by the Terms and Conditions of the Agreement and by that any subsequent agreement, and that there no circumstances where deviation from the agreed Terms and Conditions is permissible. The Terms and Conditions of the Agreement is presented in the file called 'cal_legal_notice.php'.  Please beware that failure to carryout your obligations under the agreement could be seen as a breach of contract leading to termination of your licence with 'Brandon Minton's Calendar'. 
*/

function closeCalDiv(thediv){
document.getElementById(thediv).innerHTML = "";
  
}
function doDateCheck(from, to) {
  if (Date.parse(from.value) <= Date.parse(to.value)) {
    return true;
  }
  else {
    if (from.value == "" || to.value == "") 
      alert("Both dates must be entered.");
    else 
      alert("The 'To date' must occur after the 'From date'.");
  }
  return false;
}


var http_request = false;
function makePOSTRequest(url, params) {
  http_request = false;
  if (window.XMLHttpRequest) { // Mozilla, Safari,...
	 http_request = new XMLHttpRequest();
	 if (http_request.overrideMimeType) {
		// set type accordingly to anticipated content type
		//http_request.overrideMimeType('text/xml');
		http_request.overrideMimeType('text/html');
	 }
  } else if (window.ActiveXObject) { // IE
	 try {
		http_request = new ActiveXObject("Msxml2.XMLHTTP");
	 } catch (e) {
		try {
		   http_request = new ActiveXObject("Microsoft.XMLHTTP");
		} catch (e) {}
	 }
  }
  if (!http_request) {
	 alert('Cannot create XMLHTTP instance');
	 return false;
  }
  
  http_request.onreadystatechange = alertContents;
  http_request.open('POST', url, true);
  http_request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  http_request.setRequestHeader("Content-length", params.length);
  http_request.setRequestHeader("Connection", "close");
  http_request.send(params);
}
////////////////////
//var request = null;  //no longer necessary as this is a single request object
function createRequest() {
	var request = null;
	try {
		request = new XMLHttpRequest();
	} catch (trymicrosoft) {
		try {
			request = new ActiveXObject("Msxml2.XMLHTTP");
		}catch (othermicrosoft) {
			try {
				request = new ActiveXObject("Microsoft.XMLHTTP");
			} catch (failed) {
				request = null;
			}
		}
	}
	if (request == null) {
		alert("Error creating request object!");
	}else {
		return request;
	}
}
var request1 = createRequest();  // this is an initialized request waiting to be used by code.  for the printList stuff
var request2 = createRequest();  // another...we can make multiple requests to the server		for everything else pretty much
//////////////////
function alertContents() {
  if (http_request.readyState == 4) {
	 if (http_request.status == 200) {
		//alert(http_request.responseText);  // used for testing.  comment out to make normal
		result = http_request.responseText;
		document.getElementById('myspan').innerHTML = result;            
	 } else {
		alert('There was a problem with the request.');
	 }
  }
}

function get(obj) {
  //first, check if the start and end times are set, otherwise it will anger the javascript interpreter
  

  if(document.getElementById('what')) { //ADD/EDIT EVENT
	
	 var starting_time;
	 var ending_time;
	 var daily_occurence;
	 var days_of_week;
	 var dOW;
	 var months_of_year;
	 var mOY;
	 var never_end;

	 if (document.getElementById('never_end')){
		 if(document.getElementById('never_end').checked){
			never_end = "&noEDate=true";
		 }
	 }
    if (document.getElementById('chkbx1')){
	  for(i=0;i<=6;i++){
		if (document.getElementById('chkbx'+i).checked){
			if (days_of_week != undefined){
			days_of_week = days_of_week + "|" + i;
			}
			else{
			days_of_week = i;
			}
		}
	  }
	  dOW = "&dOW=" + days_of_week;
	 }
     if (document.getElementById('chkbxMon1')){
	  for(i=1;i<=12;i++){
		if (document.getElementById('chkbxMon'+i).checked){
			if (months_of_year != undefined){
			months_of_year = months_of_year + "|" + i;
			}
			else{
			months_of_year = i;
			}
		}
	  }
	  mOY = "&mOY=" + months_of_year;
	 }
	 if(document.getElementById("start_time")){
	  starting_time = "&start_time=" + encodeURI( document.getElementById("start_time").value );
	  ending_time = "&end_time=" + encodeURI( document.getElementById("end_time").value );
	 }
	 else {
	  starting_time = '';
	  ending_time = '';
     }
	 if(document.getElementById('daily_occurence')){
		daily_occurence = "&repeat_every=" + encodeURI( document.getElementById("daily_occurence").value );
	 }
     // build the string to post the form variables to our php page for processing
     var poststr = "what=" + encodeURI( document.getElementById("what").value ) +
				   "&sdate=" + encodeURI( document.getElementById("sdate").value ) +
				   "&edate=" + encodeURI( document.getElementById("edate").value ) +
				   starting_time +
				   ending_time +
					dOW +
					mOY +
					daily_occurence +
					never_end +
		 		   "&repeat_interval=" + encodeURI( document.getElementById("repeat").value ) +
				   "&location=" + encodeURI( document.getElementById("location").value ) +
				   "&description=" + encodeURI( document.getElementById("description").value ) +
				   "&submit=" + encodeURI( document.getElementById("submit").value );
				   if (document.getElementById('id')){
				     poststr = poststr + "&id=" + encodeURI( document.getElementById("id").value );
					}

      makePOSTRequest('./inc/post.php', poststr);

  }
  else { //DELETE EVENT
    
	 var poststr = "id=" + encodeURI( document.getElementById("id").value ) +
				   "&deleteAction="+ encodeURI( document.getElementById("action").value );
	 makePOSTRequest('./inc/post.php', poststr);
  }
}
   
   
function createQCObject() { 
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
var request2 = createQCObject(); 

function refreshCalendar(m,d,y) {
	
	var ran_no=(Math.round((Math.random()*9999))); 
	request2.open('get', '<?= $ajaxPath; ?>?m='+m+'&d='+d+'&y='+y+'&ran1='+ran_no);
   	request2.onreadystatechange = function() {

		if(request2.readyState == 4 && request2.status == 200) { 
      		var response = request2.responseText;
			//alert(response);
      		if(response) { 
			document.body.innerHTML = response; 
	  		} 
   		} 
	} 
   request2.send(null); 
}


function printMonthList(m,y){
	request1.open('get', './brandonminton_cal/inc/cal_monthlyList.php?m='+m+'&y='+y, true);
   	request1.onreadystatechange = function() {
		// we will remove the month list node each time before creating a new month list
		if(request1.readyState == 4 && request1.status == 200) { 
      		var response = request1.responseText;
			//alert(newNode.nodeValue);
			//alert(response);
			var pn = document.body;  // pn for parent node
			if (document.getElementById("month_elist")){
				cn = document.getElementById("month_elist");  // cn for child node
				pn.removeChild(cn);  
			}
			newnode = document.createElement('div');
			newnode.id = "month_elist";
			pn.appendChild(newnode);			
			if (response != ""){
				newnode.innerHTML = response;  // we use innerHTML b/c of the html tags within the response...creating a text node via the DOM would not render them
			}
   		} 
	} 
   request1.send(null); 
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
function grayOutTheRest(item){

	var x = document.getElementsByTagName('div');
	
	if (item == -1){  //Click event_list title bar 
		document.getElementById('divDisableEL').className = 'none;';
	}else if (item == -2){
		document.getElementById('divDisableEF').className = 'none;';
	}else{
		document.getElementById('divDisableEL').className = 'grayedOut';
		//document.getelementById('divDisableEF').className = 'grayedOut';
	}
	//runs through all divs on page looking for those starting with divDiabled
	for (var i=0;i<x.length;i++)
	{
		if(Left(x[i].id,11)=='divDisabled'){
           //gray out every other div but currently selected event
		   if(x[i].id == 'divDisabled'+item){
				x[i].className = 'none';
		   }
		   else {
			   if (item == -1 | item == -2){
			     x[i].className = 'none';
			   }else{
			     x[i].className = 'grayedOut';
			   }
		   }  
		}
		//Expands details div for currently selected event and collapses the other events
		if(Left(x[i].id,10) == 'divDetails'){
		     if(x[i].id == 'divDetails'+item){
		     	x[i].style.display = 'block';
			 }
		 	 else {
			  x[i].style.display = 'none';
		     }
		   }
	}
}

function renderData(div, str){
	var strFinal="";
	str = str.split("|");
	//toggleVisibility(div);
	for(i=0;i<str.length;i++){
		if(strFinal == ""){
			strFinal = str[i];
		}
		else{
			strFinal = strFinal+'<br/>&nbsp;&nbsp;'+str[i];
	    }
	 }
	document.getElementById(div).innerHTML=strFinal;
}
function setVal(e1,e2) {
	val = e1.value;
	e2.value = val;
}
function returnTime(e){
	var a_p = "";
	var timeStr = "<select size='6' id='timeListStart' onclick='setVal(this,this.form.start_time);toggleVisibility(\"timeListStart\");' multiple style='position:absolute;top:193px;left:141px;'  name='starting_times'>";
	var d = new Date();
	var curr_hour = d.getHours();
	var curr_min = d.getMinutes();
	curr_min = curr_min + "";
	if (curr_min.length == 1){
		curr_min = "0" + curr_min;
	}
	if (curr_hour < 12){
	   a_p = "AM";
	}
	else{
	   a_p = "PM";
	}
	if (curr_hour == 0){
	   curr_hour = 12;
	}
	if (curr_hour > 12){
	   curr_hour = curr_hour - 12;
	}
	if (curr_min <=29){
		curr_min = "30";
	}else{
		curr_min = "00";
		curr_hour = curr_hour+1;
	}
	var curr_timeStr = "<option style='display:block' selected value='"+curr_hour + " : " + curr_min + " " + a_p+"'>"+curr_hour + " : " + curr_min + " " + a_p+" ";
	var amOrPm = "AM"
	var startingHour = 12;
	var startingMin = "00";
	function incTime(h,m){
		if (m == "30"){
			startingHour++;
			startingMin = "00";
			if (startingHour>12){
				startingHour -= 12;
			}
		}else{
			startingMin = "30";
		}
	}
	for (var i=0;i<48;i++){
		if (i == 24){
			amOrPm = "PM";
		}
		if ((curr_hour == startingHour) && (curr_min == startingMin) && (a_p == amOrPm)){
			timeStr += curr_timeStr;
			incTime(startingHour,startingMin);
		}else{
				timeStr += "<option style='display:block' value='"+startingHour + ":" + startingMin + " " + amOrPm+"'>"+startingHour + ":" + startingMin + " " + amOrPm+" ";
				incTime(startingHour,startingMin);
		}
	}
	timeStr += "</select>";
	document.getElementById(e).innerHTML = timeStr;
}
function returnTimeTo(e){
	String.prototype.trim = function () { // this is for removing whitespace around the AM or PM user input, if any
    	return this.replace(/^\s*/, "").replace(/\s*$/, "");
	}
	var a_p = "";
	var timeStr = "<select size='6' id='timeListEnd' onclick='setVal(this,this.form.end_time);toggleVisibility(\"timeListEnd\");' multiple style='position:absolute;top:108px;left:335px;'  name='ending_times'>";
	var start_time = document.getElementById("start_time").value;
	var startingHour = parseInt(start_time.split(":",1));
	var startingMin = start_time.split(":").pop().substring(0,3);
	var amOrPm = start_time.split(":").pop().substring(3).trim(); 
	var curr_hour = 0;
	var curr_min = "00";
	function duration(n,hr){  // this function prints the duration of the event
		if (n == 0) {
			return "(0 mins)";
		}else if (n == 1){
			return "(30 mins)";
		}else if (n == 2) {
			return "("+ (n-1) +" hour)";
		}else {
			if ((n%2) != 1){
				return "("+ (n/2) +" hours)";
			}else {
				return "("+ (n/2) +" hours)";
			}
		}
	}
	function incTime(h,m){
		if (m == "30"){
			startingHour++;
			startingMin = "00";
			if (h>=12){
				startingHour -= 12;
			}
			curr_hour = h;
			curr_min = m;
		}else{
			startingMin = "30";
			curr_min = startingMin;
		}
	}
	for (var i=0;i<48;i++){
		if ((startingHour == 12) && (startingMin == "00") && (i > 0)){
			if (amOrPm == "AM"){
				amOrPm = "PM";
			}else {
				amOrPm = "AM";
			}
		}
		timeStr += "<option style='display:block' value='"+startingHour + ":" + startingMin + " " + amOrPm+"'>"+startingHour + ":" + startingMin + " " + amOrPm+" "+ " "+duration(i,startingHour)+" ";
		incTime(startingHour,startingMin);
	}
	timeStr += "</select>";
	document.getElementById(e).innerHTML = timeStr;
}
function pickREvent(time){
	function fourteenList(){
		var list = "<select id='daily_occurence'>";
		for (var i=1;i<=14;i++){
			list += "<option id='' style='display:block' value='"+i+"'>"+i+" ";
		}
		list += "</select>";
		return "Repeat every: "+list;
	}
	function weekList(){
		var check = "";
		var day = new Array("Sun","Mon","Tue","Wed","Thu","Fri","Sat");
		for (var i=0;i<day.length;i++){
			if (check == ""){
				check = "<input type='checkbox' id='chkbx"+i+"' value='true'>&nbsp;"+day[0]+" ";
			}else{
				check += "<input type='checkbox' id='chkbx"+i+"' value='true'>&nbsp;"+day[i]+" ";
			}
		}
		return "On: "+check;
	}
	function monthList(){
		var check = "";
		var mon = new Array("","Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec");
		for (var i=1;i<mon.length;i++){
			if (check == ""){
				check = "<input type='checkbox' id='chkbxMon"+i+"' value='true'>&nbsp;"+mon[1]+" ";
			}else{
				if (i == 7) {
					check +="<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";		
				}
				check += "<input type='checkbox' id='chkbxMon"+i+"' value='true'>&nbsp;"+mon[i]+" ";
				if (i == 7) {
					check +="&nbsp;";		
				}
			}
		}
		return "Every: "+check;
	}
	function endDate(){
		var check = "<input type='checkbox' id='never_end' />";
		return "No End Date: "+check;
	}
	if (time.value == "daily"){
		document.getElementById("r_info").style.display = 'block';
		document.getElementById("r_every").innerHTML = fourteenList();
		document.getElementById("r_on").innerHTML = "";

	}else if (time.value == "weekly"){
		document.getElementById("r_info").style.display = 'block';
		document.getElementById("r_every").innerHTML = fourteenList();
		document.getElementById("r_on").innerHTML = weekList();
	}
	else if (time.value == "monthly"){
		document.getElementById("r_every").innerHTML = "";
		document.getElementById("r_on").innerHTML = monthList();
	}
	else if (time.value == "yearly"){
		document.getElementById("r_every").innerHTML = "";
		document.getElementById("r_on").innerHTML = "";
	}
	else if (time.value == "does not repeat"){
		document.getElementById("r_info").style.display = 'none';
	}

}

function allDayCheck(main,elem1,name1,elem2,name2){	if(!main.checked){
		document.getElementById(elem1).innerHTML = '<input type="text" name="'+name1+'" id="'+name1+'"size="7" value="??:??" onclick="returnTime(\'timeList\');" /><div id="timeList"></div>';
		document.getElementById(elem2).innerHTML = '<input type="text" name="'+name2+'" id="'+name2+'"size="7" value="??:??" onclick="returnTimeTo(\'timeListTo\');" /><div id="timeListTo"></div>';
	}else{
		document.getElementById(elem1).innerHTML = '';
		document.getElementById(elem2).innerHTML = '';
	}
}
function closeEventList(){
  if (document.getElementById("month_elist")){
    document.getElementById('month_elist').style.display="block";
  }
  document.getElementById("event_list").style.display="none";
  document.getElementById('divDisableCal').className = 'none';
  if(document.getElementById('divDisableEL')){
  document.getElementById('divDisableEL').className = 'none';
  }

 //	document.getElementById('divDisableEF').className = 'none';
 // }
}
function closeEventForm(){

	if (document.getElementById('event_list').style.display != "block")
	    {document.getElementById('divDisableCal').className = 'none';}
	else 
		{document.getElementById('divDisableEL').className = 'none';}
}

function printList(longdate, shortdate, what){
document.getElementById('divDisableCal').className = 'grayedOut';
  if (document.getElementById("month_elist")){
	document.getElementById('month_elist').style.display="none";
  }
	document.getElementById('event_list').innerHTML="";
	document.getElementById('event_list').innerHTML = '<div id="divDisableEL"><span onclick="grayOutTheRest(-1);" class="title">Events for:													  '+longdate+
													  '<span onclick="closeEventList();" class="close">X</span></span></div>'+what;
	document.getElementById('event_list').style.border = "thin solid #000000";
	//document.getElementById('event_list').innerHTML = '<span class="title">Events for: '+date+'</span><br /><a href="'+linkTo+'" onclick="document.getElementById('description').innerHTML = '+description+';">'+what+'</a>';
	//document.getElementById('event_list').innerHTML += '<br /><a href="'+linkTo+'" onclick="return renderData(\'description\', \''+desc+'\');">'+what+'</a>';
	document.getElementById("event_list").style.display="block";
}
function Left(str, n)
        /***
                IN: str - the string we are LEFTing
                    n - the number of characters we want to return

                RETVAL: n characters from the left side of the string
        ***/
        {
                if (n <= 0)     // Invalid bound, return blank string
                        return "";
                else if (n > String(str).length)   // Invalid bound, return
                        return str;                // entire string
                else // Valid bound, return appropriate substring
                        return String(str).substring(0,n);
        }
