// Function to open a popup window
	function popitup(url) {
	    newwindow = window.open(url,'{{title}}','height=400,width=700');
	    if (window.focus) {newwindow.focus()}
	    return false;
	}


	function myPopup(pageURL, title, wide, high) {
		var left = (screen.width/2)-(wide/2);
		var top = (screen.height/2)-(high/2);
		var newwindow = window.open (pageURL, title, 'toolbar=no, location=no, 
			directories=no, status=no, menubar=no, scrollbars=no, resizable=no, 
			copyhistory=no, width='+wide+', height='+high+', top='+top+', left='+left+); 
	}


function PopupCenter(pageURL, title,w,h) {
	var left = (screen.width/2)-(w/2);
	var top = (screen.height/2)-(h/2);
	var targetWin = window.open (pageURL, title, 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width='+w+', height='+h+', top='+top+', left='+left);
} 