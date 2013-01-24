$(document).ready(function() {

	var settings = {
		stickToBottom: true,
		clickOnTrack: false,
		contentWidth: 323
	};
	var pane = $('.scroll-pane');
	pane.jScrollPane(settings);		// set up custom scroll bar
	var api = pane.data('jsp');

	setInterval(
		function()
		{
			 $.get("chatHistory.txt", function(data){	// refreshes chat window every second
				api.getContentPane().empty();
				api.getContentPane().append(data);
				api.reinitialise();
			 });
		},
		1000
	);

	$('#myForm').submit(function() {	// called on form submit
		if($('#senderName').val() == 'Chat Name' || $('#senderName').val() == '' || $('#senderName').val() == 'Enter a name') {
			$('#senderName').val('Enter a name');
			$('#senderName').select();
			return false;
		}
	  	var sentMessage = $('#sendMessage').val();	// get sent message value
		var sentName = $('#senderName').val();		// get username value
		$('#sendMessage').val('');  // clears the sendMessage textbox
		$('#sendMessage').focus();	// refocuses on sendMessage textbox
		var htmlBreak = "<br>";		// replace all newline chars with html break tags

		sentMessage = sentMessage.replace(/\r\n/g, htmlBreak);	// Windows encodes returns as \r\n hex
		sentMessage = sentMessage.replace(/\n/g, htmlBreak);	// Unix encodes returns as \n hex
		sentMessage = sentMessage.replace(/\r/g, htmlBreak);	// Macintosh encodes returns as \r hex

		$.get("chatHistory.txt?name="+sentName+"&send="+sentMessage, function(){	// send the request
			api.getContentPane().append(sentName+": "+sentMessage+" <br>\n");		// update chat window instantly
			api.reinitialise();
			api.scrollToPercentY(100);	// scroll to the bottom
		 });
	
		return false;
	});
		
	$('#sendMessage').shiftenter({
	    focusClass: 'shiftenter',             /* CSS class used on focus */
	    inactiveClass: 'shiftenterInactive',  /* CSS class used when no focus */
	    hint: '',   /* hint shown */
	    metaKey: 'shift',                     /* meta key that triggers a line-break, allowed values: 'shift', 'ctrl' */
	    pseudoPadding: '0 10'                 /* padding (bottom, right) of hint text */
	});		// makes enter submit form and shift+enter enter a new line
	
	$('#clearButton').click(function(){		// called when clearButton is pressed
		$.get("clearHistory");		// sends request to erase contents of chatHistory.txt
		api.getContentPane().empty();	// clears chat window instantly
		api.reinitialise();
	});

});
