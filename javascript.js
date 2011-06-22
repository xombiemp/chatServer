setInterval("updateChat()",1500);	//Ajax calls updateChat every 1.5 seconds

function submitForm(chatForm) { 

	//*************Call for Ajax object**************//
	//***********************************************//
	var xmlHttp = GetXmlHttpObject();
	
	if (xmlHttp==null) {
		alert ("Your browser does not support AJAX!");
		return;
	} 
	  
	//*************Replace newline and returns with HTML breaks**************//
	//***********************************************************************//  
	var replaceWith = "<br />";
	//textarea is reference to that object, replaceWith is string that will replace the encoded return
	chatForm.sendMessage.value = escape(chatForm.sendMessage.value); // encode textarea string's carriage returns
	var length = chatForm.sendMessage.value.length;

	for(i=0; i<length; i++){
		//loop through string, replacing carriage return encoding with HTML break tag

		if(chatForm.sendMessage.value.indexOf("%0D%0A") > -1){
			//Windows encodes returns as \r\n hex
			chatForm.sendMessage.value=chatForm.sendMessage.value.replace("%0D%0A",replaceWith);
		}
		else if(chatForm.sendMessage.value.indexOf("%0A") > -1){
			//Unix encodes returns as \n hex
			chatForm.sendMessage.value=chatForm.sendMessage.value.replace("%0A",replaceWith);
		}
		else if(chatForm.sendMessage.value.indexOf("%0D") > -1){
			//Macintosh encodes returns as \r hex
			chatForm.sendMessage.value=chatForm.sendMessage.value.replace("%0D",replaceWith);
		}
	}

	chatForm.sendMessage.value=unescape(chatForm.sendMessage.value); // unescape all other encoded characters;
		
	var sentMessage = chatForm.sendMessage.value;
	var sentName = chatForm.senderName.value;
	
	//*************Ajax ready state**************//
	//*******************************************//
	xmlHttp.onreadystatechange=function() {
		if (xmlHttp.readyState==4) { 
			document.getElementById("chatArea").innerHTML=xmlHttp.responseText;  //Updates the chatArea with the text

			chatForm.sendMessage.value='';  //clears the sendMessage textbox
			
			 var objDiv = document.getElementById("chatArea");  //moves the scroll bar to the bottom of div
			 objDiv.scrollTop = objDiv.scrollHeight;			//
		}
	}
	xmlHttp.open("GET","chatHistory.txt?name="+sentName+"&send="+sentMessage,true);  //sends the HTTP GET request
	xmlHttp.send(null);
	return false;	//return false so the html form doesn't sumbit
}




function updateChat() { 

	//*************Call for Ajax object**************//
	//***********************************************//
	var xmlHttp = GetXmlHttpObject();
	
	if (xmlHttp==null) {
		alert ("Your browser does not support AJAX!");
		return;
	} 
	
	//*************Ajax ready state**************//
	//*******************************************//
	xmlHttp.onreadystatechange=function() {
		if (xmlHttp.readyState==4) { 
			document.getElementById("chatArea").innerHTML=xmlHttp.responseText;	//Updates the chatArea with the text
			
			divScroll.activeScroll();	//moves the scroll bar to the bottom of div while checking for user scrolling
		}
	}
	xmlHttp.open("GET","chatHistory.txt",true);	//sends the HTTP GET request
	xmlHttp.send(null);
}




function clearHistory() {
	//*************Call for Ajax object**************//
	//***********************************************//
	var xmlHttp = GetXmlHttpObject();
	
	if (xmlHttp==null) {
		alert ("Your browser does not support AJAX!");
		return;
	} 
	
	//*************Ajax ready state**************//
	//*******************************************//
	xmlHttp.onreadystatechange=function() {
		if (xmlHttp.readyState==4) { 
		}
	}
	xmlHttp.open("GET","clearHistory",true);  //sends the HTTP GET request
	xmlHttp.send(null);
	return false;	//return false so the html form doesn't sumbit
}




function GetXmlHttpObject() {

	//*************Set up Ajax object**************//
	//***********************************************//
	var xmlHttp=null;
	try {
	  // Firefox, Opera 8.0+, Safari
	  xmlHttp=new XMLHttpRequest();
	}
	catch (e){
	  // Internet Explorer
	  try {
	    xmlHttp=new ActiveXObject("Msxml2.XMLHTTP");
	  }
	  catch (e) {
	    xmlHttp=new ActiveXObject("Microsoft.XMLHTTP");
	  }
	}
	return xmlHttp;
}
		
		


//*************Keep scroll bar at bottom of div**************//
//*************while checking for user scrolling*************//

var chatscroll = new Object();

chatscroll.Pane = function(scrollContainerId) {
	this.bottomThreshold = 25;
	this.scrollContainerId = scrollContainerId;
}

chatscroll.Pane.prototype.activeScroll = function() {
	var scrollDiv = document.getElementById(this.scrollContainerId);
	var currentHeight = 0;
	
	if (scrollDiv.scrollHeight > 0)
	    currentHeight = scrollDiv.scrollHeight;
	else 
		if (objDiv.offsetHeight > 0)
	        currentHeight = scrollDiv.offsetHeight;
	
	if (currentHeight - scrollDiv.scrollTop - ((scrollDiv.style.pixelHeight) ? scrollDiv.style.pixelHeight : scrollDiv.offsetHeight) < this.bottomThreshold)
		scrollDiv.scrollTop = currentHeight;

	scrollDiv = null;
}

var divScroll = new chatscroll.Pane('chatArea');
		
	
		
	
//*************Submit form on Return**************//
//*************Enter newline on Shift+Return******//

var isShift=null;
var isNN = (navigator.appName.indexOf("Netscape")!=-1);
var OP = (navigator.appName.indexOf("Opera")!=-1);

if (OP)
	isNN=true;
	
var key;
function shift(event) {
	key = (isNN) ? event.which : event.keyCode;
	if (key==16)
		isShift=1;
}

function process(event){
	key = (isNN) ? event.which : event.keyCode;
	if (document.layers && event.modifiers==4) {
		isShift=1;
	}
	if (key==13 && isShift!=1) {
		submitForm(document.getElementById("myForm"));  //if just the enter key call submitForm function
	}
	if (key!=16)
		isShift=null;
}