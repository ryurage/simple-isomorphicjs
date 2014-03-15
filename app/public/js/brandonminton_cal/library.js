$(function () {
	var mouseX = 0,
		mouseY = 0,
		classes = ['start-time','end-time'],
		eventForm = '<fieldset>'+
					'<legend>Add Event Form</legend><span class="close-event-form">X</span>'+
					'<form action="" name="actionform" id="actionform">'+ // turn this on!
					  '<div id="smallcal1" style="position:absolute;visibility:hidden;background-color:white;top:0px;"></div>'+
					 '<form action="javascript:get(document.getElementById(\'actionform\'));closeEventForm();" name="actionform" id="actionform">'+
					 'What <input type="text" id="what" /><br /><br />'+
					 'When <div id="when"><input type="text" class="calendar-start-date calendar-dates"  value="" size=10 " title="enter the start date" name="sdate" id="sdate">&nbsp;&nbsp;<div class="start-t"></div> to '+
					  	  '<input type="text" class="calendar-end-date calendar-dates"  value="" size=10 title="enter the end date" name="edate" id="edate">&nbsp;&nbsp;<div class="end-t"></div>'+
						  '<input type="checkbox" class="calendar-all-day" checked />All day <br /></div>'+
						  '<br /><div style="margin-left:36px;">Repeats <select size="1" id="repeat" name="repeat_int" onChange="pickREvent(this);">'+
						  			'<option name="dnrepeat" value="does not repeat">does not repeat</option>'+
									'<option name="daily"  value="daily">daily</option>'+
									'<option name="weekly" value="weekly">weekly</option>'+
									'<option name="monthly" value="monthly">monthly</option>'+
									'<option name="yearly" value="yearly">yearly</option>'+
									'</select></div><br />'+
						 		'<div id="r_info">'+
									'<div id="d"></div><div id="w"></div><div id="y"></div>'+
									'<div id="r_text"></div><div id="r_every"></div><div id="r_on"></div><div id="r_range"><div id="cal3"></div></div>'+
								'</div><!-- end \'r_info\' -->'+
					 'Where <input type="text" name="location" id="location" /><br /><br />'+
					 'Description <textarea cols="55" rows="5" id="description" name="description"></textarea><br /><br />'+
					 '<input value="Save" type="submit" id="submit" name="submit">'+
					 '</form>'+
					 '</fieldset>';
	$('<div>', {
	    'class': 'calendar-crud-box',
	    'mouseleave':function(){ $(this).fadeOut(500); }
	}).prependTo('body');
	$('<div>', {
	    'class': 'calendar-event-list',
	}).insertAfter($('.cal1'));
	$('<div>', {
	    'class': 'calendar-mini',
	    'mouseleave':function(){ $(this).fadeOut(500); }
	}).prependTo('body');
	$('<div>', {
	    'class': 'calendar-mini',
	    'mouseleave':function(){ $(this).fadeOut(500); }
	}).prependTo('body');
	$('<div>', {
	    'class': 'time-list',
	    'mouseleave':function(){ $(this).fadeOut(500); }
	}).prependTo('body');
	$( document ).on( "mousemove", function(e) {
		mouseX = e.pageX;
		mouseY = e.pageY;
	});
	function showCrudBox(action, theDate) {
		var crudHtml = '';
		action.forEach( function(entry) {
			crudHtml += '<a class="calendar-crud-clicked" data-action="' + entry + '" data-date="' + theDate + '" href="#">' + entry + ' Event</a><br />';
		});
		$('.calendar-crud-box')
			.html(crudHtml)
			.offset({top: mouseY + 5, left: mouseX + 5})
			.fadeIn(500);
	}
	function showEventForm(theDate) {
		$('.calendar-event-list')
			.html(eventForm)
			.fadeIn(500);
	}
	function showMiniCal($el) {
		$('.calendar-mini')
			.css('top', mouseY + 5)
			.css('left', mouseX + 5)
			.fadeIn(500);
		addMiniCalListener($el);
	}
	function addMiniCalListener($el) {
		$('.calendar-mini .calendar-day').on('click', function(e){
			$el.val($(this).attr('data-date'));
		});
	}
	function allDayCheck(checkbox,elem1,name1,elem2,name2){
		var $startEl = $(elem1),
			$endEl = $(elem2);
		if(!$(checkbox).is(':checked')){
			$startEl.html('<input type="text" class="'+name1+' time-input" size="7" value="??:??" />');
			$endEl.html('<input type="text" class="'+name2+' time-input" size="7" value="??:??" />');
		}else{
			$startEl.html('');
			$endEl.html('');
		}
	}
	function returnTime(el, settime){
		var meridiem = '',
			timeStr = '<select size="6" class="timeList" multiple name="starting_times">',
			d = new Date(),
			curr_hour = d.getHours(),
			curr_min = d.getMinutes(),
			curr_timeStr = '',
			amOrPm = 'AM',
			startingHour = 12,
			startingMin = '00';
		curr_min = curr_min + "";
		if (curr_min.length == 1){
			curr_min = '0' + curr_min;
		}
		if (curr_hour < 12){
		   meridiem = 'AM';
		}
		else{
		   meridiem = 'PM';
		}
		if (curr_hour == 0){
		   curr_hour = 12;
		}
		if (curr_hour > 12){
		   curr_hour = curr_hour - 12;
		}
		if (curr_min <=29){
			curr_min = '30';
		}else{
			curr_min = "00";
			curr_hour = curr_hour+1;
		}
		curr_timeStr = '<option class="'+settime+'-option settime-option" style="display:block" selected value="'+curr_hour + ':' + curr_min + ' ' + meridiem+'">'+curr_hour + ':' + curr_min +  ' ' + meridiem+' ';
		
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
			if ((curr_hour == startingHour) && (curr_min == startingMin) && (meridiem == amOrPm)){
				timeStr += curr_timeStr;
				incTime(startingHour,startingMin);
			}else{
					timeStr += '<option class="'+settime+'-option settime-option" style="display:block" value="'+startingHour + ':' + startingMin + ' ' + amOrPm+'">'+startingHour + ':' + startingMin + ' ' + amOrPm+' ';
					incTime(startingHour,startingMin);
			}
		}
		timeStr += "</select>";
		$(el)
			.css('top', mouseY + 5)
			.css('left', mouseX + 5)
			.fadeIn(500)
			.html(timeStr)
	}
	$('td.calendar-day').on('click', function(e) {
		showCrudBox(['Add'], $(this).attr('data-date'));
	});
	$( ".calendar-crud-box" ).on( "click", function(e) {
		e.preventDefault();
	    showEventForm($(this).attr('data-date'));
	});
	$( 'body' ).on( "click", '.calendar-dates', function(e) {
		var d = new Date();
		if(!$.trim($('calendar-mini').html())) {
	    	QuickCal('calendar-mini', d.getMonth()+1, d.getFullYear(), 'mini-cal');
	    }
	    showMiniCal($(this));
	});
	$('body').on('click', '.calendar-all-day', function() {
		allDayCheck(this,'.start-t','start-time','.end-t','end-time')
	});
	$('body').on('click', '.time-input', function() {
		classNames = this.className.split(/\s+/),
		timeClass = function() { 
			var cls = $.grep(classNames, function(c, i) {
    			if ($.inArray(c, classes) !== -1) {
    				return c;
    			}
			})[0];
			return cls;
		}();
		returnTime('.time-list', timeClass);
	});
	$('body').on('click', '.settime-option', function() {
		var settimeClasses = this.className,
			that = this;
		$.each(classes, function(i, c) {
			if (settimeClasses.indexOf(c) !== -1) {
				$('.'+c).val($(that).val());
				return false;
			}
		});
	});
	$('body').on('click', '.close-event-form', function() {
		$(this).parent().fadeOut(500)
	})
});





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
		alert('There was a problem with the request: '+http_request.responseText);
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
	request2.open('get', './index.php?m='+m+'&d='+d+'&y='+y+'&ran1='+ran_no); // this used to have a php variable 'ajaxPath' but its a js file!!
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

function editEvent(data) {
	var data = data.split('|');
	var id = data[1];
	request2.open('get', './inc/editEvnt.php?id='+id);
   	request2.onreadystatechange = function() {

		if(request2.readyState == 4 && request2.status == 200) { 
      		var response = request2.responseText;
			if(response) { 
			document.getElementById("add_event_box").innerHTML = response; 
			document.getElementById("add_event_box").style.display="block";
	  		}
   		} 
	} 
   request2.send(null); 
}

function printMonthList(m,y){
	request1.open('get', './inc/monthlyList.php?m='+m+'&y='+y, true);
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

function returnTimeTo(el){
	String.prototype.trim = function () { // this is for removing whitespace around the AM or PM user input, if any
    	return this.replace(/^\s*/, "").replace(/\s*$/, "");
	}
	var meridiem = "",
		timeStr = "<select size='6' class='timeListEnd timeList' onclick='setVal(this,this.form.end_time);toggleVisibility(\"timeListEnd\");' multiple name='ending_times'>",
		start_time = $('.start-time').val(),
		startingHour = parseInt(start_time.split(":",1)),
		startingMin = start_time.split(":").pop().substring(0,3),
		amOrPm = start_time.split(":").pop().substring(3).trim(),
		curr_hour = 0,
		curr_min = "00";
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
	$(el).html(timeStr)
		.css('top', mouseY + 5)
		.css('left', mouseX + 5)
		.fadeIn(500);
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
	/* if (time.value != "does not repeat"){
	document.getElementById("cal3").innerHTML = endDate();
	} */
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
 // if(document.getElementById('divDisableEF').className != 'none'){ //shuts the add_event_box off too
	document.getElementById('add_event_box').style.display = "none";
 //	document.getElementById('divDisableEF').className = 'none';
 // }
}
function closeEventForm(){
    document.getElementById('add_event_box').style.display = "none";
	if (document.getElementById('event_list').style.display != "block")
	    {document.getElementById('divDisableCal').className = 'none';}
	else 
		{document.getElementById('divDisableEL').className = 'none';}
}
function addEventBox(when){
	if (document.getElementById('event_list').style.display == "block")
	{document.getElementById('divDisableEL').className = 'grayedOut';}

	document.getElementById('divDisableCal').className = 'grayedOut';
	var m,d,y;
	strDate = when.split("/");
	m = strDate[0];
	if(m < 10){m = m.substring(1,2);}
	d= strDate[1];
	y = strDate[2];
	document.getElementById('add_event_box').innerHTML ='<br/><fieldset id="divDisableEF" onclick="grayOutTheRest(-2);">'+
														 '<legend>Add Event Form</legend><span onclick="closeEventForm();" class="close">X</span>'+
														'<form action="javascript:get(document.getElementById(\'actionform\'));setTimeout(\'refreshCalendar('+m+','+d+','+y+')\',75);closeEventForm();" name="actionform" id="actionform">'+ // turn this on!
														  '<div id="smallcal1" style="position:absolute;visibility:hidden;background-color:white;top:0px;"></div>'+
														 '<form action="javascript:get(document.getElementById(\'actionform\'));closeEventForm();" name="actionform" id="actionform">'+
														 'What <input type="text" id="what" /><br /><br />'+
														 'When <div id="when"><input type="text" name="start_date"  value="'+when+'" size=10 onClick="var cal1x = new CalendarPopup(\'smallcal1\');cal1x.select(document.forms[0].start_date,\'sdate\',\'MM/dd/yyyy\'); return false;" title="enter the start date" name="sdate" id="sdate">&nbsp;&nbsp;<div id="start_t"></div> to '+
														  	  '<input type="text" name="end_date"  value="" size=10 onClick="var cal2x = new CalendarPopup(\'smallcal2\');cal2x.select(document.forms[0].end_date,\'edate\',\'MM/dd/yyyy\'); return false;"  title="enter the end date" name="edate" id="edate">&nbsp;&nbsp;<div id="end_t"></div>'+
															  '<input type="checkbox" id="all_day" name="all_day" onclick="allDayCheck(this,\'start_t\',\'start_time\',\'end_t\',\'end_time\')" checked />All day <br /></div>'+
															  '<br /><div style="margin-left:36px;">Repeats <select size="1" id="repeat" name="repeat_int" onChange="pickREvent(this);">'+
															  			'<option name="dnrepeat" value="does not repeat">does not repeat</option>'+
																		'<option name="daily"  value="daily">daily</option>'+
																		'<option name="weekly" value="weekly">weekly</option>'+
																		'<option name="monthly" value="monthly">monthly</option>'+
																		'<option name="yearly" value="yearly">yearly</option>'+
																		'</select></div><br />'+
															 		'<div id="r_info">'+
																		'<div id="d"></div><div id="w"></div><div id="y"></div>'+
																		'<div id="r_text"></div><div id="r_every"></div><div id="r_on"></div><div id="r_range"><div id="cal3"></div></div>'+
																	'</div><!-- end \'r_info\' -->'+
														 'Where <input type="text" name="location" id="location" /><br /><br />'+
														 'Description <textarea cols="55" rows="5" id="description" name="description"></textarea><br /><br />'+
														 '<input value="Save" type="submit" id="submit" name="submit">'+
														 '</form>'+
														
														 '<div id="smallcal2" style="position:absolute;visibility:hidden;background-color:white;"></div>'+
														 '</fieldset>';
	//document.getElementById('add_event_box').style.border = "thin solid #000000";
	document.getElementById("add_event_box").style.display="block";
}
function deleteEventBox(event){
    //event = event.split('|');
	//title = event[0];
	//id = event[1];
	//eventdate = event[2].split('/');
	//m = eventdate[0];
	//if(m < 10){m = m.substring(1,2);}

//	d = eventdate[1];
//	if(d < 10){d= d.substring(1,2);}

//	y = eventdate[2];

	request2.open('get', './inc/delEvnt.php?e='+event);
   	request2.onreadystatechange = function() {

		if(request2.readyState == 4 && request2.status == 200) { 
      		var response = request2.responseText;
			//alert(response);
      		if(response) { 
			document.getElementById('add_event_box').innerHTML = response; 
	  		} 
   		} 
	} 
   request2.send(null); 



	document.getElementById('divDisableEL').className = 'grayedOut';
	//document.getElementById('add_event_box').innerHTML ='<br/><fieldset id="divDisableEF" onclick="grayOutTheRest(-2);">'+
	//													 '<legend>Delete Event Form</legend><span onclick="closeEventForm();" class="close">X</span>'+
	//													 'Are you sure you want to delete event: <b>'+title+'</b>?<br/>'+
	//													 '<form name="deleteform" id="deleteform">'+
	//													 '<input type="hidden" id="id" value="'+id+'">'+
	//													 '<input type="button" name="deleteAction" value="yes" onclick="javascript:get(this.parentNode);setTimeout(\'refreshCalendar('+m+','+d+','+y+')\',75);closeEventForm();"><input type="button" name="cancelDelete" value="no" onclick="closeEventForm();"></form>'
	//													 '</fieldset>';
	////document.getElementById('add_event_box').style.border = "thin solid #000000";
	document.getElementById("add_event_box").style.display="block";
}
function printList(longdate, shortdate, what){
document.getElementById('divDisableCal').className = 'grayedOut';
  if (document.getElementById("month_elist")){
	document.getElementById('month_elist').style.display="none";
  }
	document.getElementById('event_list').innerHTML="";
	document.getElementById('event_list').innerHTML = '<div id="divDisableEL"><span onclick="grayOutTheRest(-1);" class="title">Events for:													  '+longdate+
													  '<span onclick="closeEventList();" class="close">X</span></span></div>'+what+
													  '<div id=\"addbtn\" onclick=\"addEventBox(\''+shortdate+'\');\" >Add Event</div>';  //the addevent button
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
