$(document).ready(function(){

	$(".top-right img").click(function(){
		$(".top-right-form").show("slide", {direction: "right"});
		$(".top-right img").toggleClass("top-right-rotate");
		$(".top-right-form").toggle("slide", {direction: "right"});
	});

	$(".top-right img").mouseover(function(){
		$(".top-right-form").show("slide", {direction: "right"});
		$(".top-right-panel").show("slide", {direction: "right"});
		$(".top-right img").addClass("top-right-rotate");
	});

	$(".top-right-form").mouseleave(function(){
		$(".top-right-form").hide("slide", {direction: "right"});
		$(".top-right img").toggleClass("top-right-rotate");
	});

	$(".top-right-panel").mouseleave(function(){
		$(".top-right-panel").hide("slide", {direction: "right"});
		$(".top-right img").toggleClass("top-right-rotate");
	});

	$("#password").keyup(function(e){
		if (e.keyCode == 13) {
			this.form.submit();
		}
	});
	
	$("#signIn").click(function(){
		$(".top-right-form").show("slide", {direction: "right"});
		$(".top-right img").addClass("top-right-rotate");
	});

	var left = (screen.width/2)-300;
	var top = (screen.height/2)-300;

	$('#playGuest').popupWindow({centerScreen:1, height:600, width:600});

});


	