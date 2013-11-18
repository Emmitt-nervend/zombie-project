$(document).ready(function(){

	$(".top-right img").click(function(){
		$(".top-right-form").toggle("slide", {direction: "right"});
		$(".top-right img").toggleClass("top-right-rotate");
		$(".top-right-panel").toggle("slide", {direction: "right"});
	});

	$("#password").keyup(function(e){
		if (e.keyCode == 13) {
			this.form.submit();
		}
	});
	
	var left = (screen.width/2)-300;
	var top = (screen.height/2)-300;

	$('#playGuest').popupWindow({centerScreen:1, height:600, width:600});

});

	