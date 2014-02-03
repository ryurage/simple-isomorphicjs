<!-- Copyright 2006 Bontrager Connection, LLC
var cX = 0; var cY = 0;
function UpdateCursorPosition(e){ cX = e.pageX; cY = e.pageY;}
function UpdateCursorPositionDocAll(e){ cX = event.clientX; cY = event.clientY;}
if(document.all) { document.onmousemove = UpdateCursorPositionDocAll; }
else { document.onmousemove = UpdateCursorPosition; }

function AssignPosition(d) {
d.style.left = (cX+5) + "px";
d.style.top = (cY+5) + "px";
}
function HideContent(d) {
if(d.length < 1) { return; }
document.getElementById(d).style.display = "none";
}
function ShowContent(d) {
if(d.length < 1) { return; }
var dd = document.getElementById(d);
AssignPosition(dd);
dd.style.display = "block";

}
function ReverseContentDisplay(d) {
if(d.length < 1) { return; }
var dd = document.getElementById(d);
AssignPosition(dd);
if(dd.style.display == "none") { dd.style.display = "block"; }
else { dd.style.display = "none"; }
}


function Click(event,when,theDiv){
	dont(event);
    document.getElementById('dateSelected').value = when;
	ShowContent(theDiv);
	return true;
}
    

function dont(event)
{
    if (event.preventDefault)
        event.preventDefault();
    else
        event.returnValue= false;
     return false;
}
function GetEvent(e)
{
	
    if(!e)
    {
        e               = window.event;
    
  }
    if(e.layerX)
    {
        e.offsetX       = e.layerX;
        e.offsetY       = e.layerY;
    }
 
    if(e.type == 'mouseover' && !e.relatedTarget)
    {
        e.relatedTarget     = e.fromElement;
    }
    else if(e.type == 'mouseout' && !e.relatedTarget)
    {
        e.relatedTarget     = e.toElement;
    }
 
    e.src               = e.srcElement || e.target;
    e.key               = e.keyCode || e.charCode;

    return e;
}
function gracefulContextMenuClose(event){
  e = GetEvent(event);
  if(e.srcElement){ //if IE
    if(e.fromElement.id != "delLink" && e.toElement.id != "delLink" && e.fromElement.id != "addContextMenuDiv"){
    HideContent('deleteContextMenuDiv'); return true;
    }
	else if(e.fromElement.id != "addLink" && e.toElement.id != "addLink"){
    HideContent('addContextMenuDiv'); return true;
    }
  }
  else{
	if(e.target.id != "delLink" && e.relatedTarget.id != "delLink" && e.target.id != "addContextMenuDiv"){
     HideContent('deleteContextMenuDiv'); return true;
    }
    else if(e.target.id != "addLink" && e.relatedTarget.id != "addLink"){
     HideContent('addContextMenuDiv'); return true;
    }
   
  
  }

  

}