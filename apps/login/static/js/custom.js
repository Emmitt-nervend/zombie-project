$(document).ready(function(){
	$(".top-right img").mouseover(function(){
		$(".top-right-form").show("slide", {direction: "right"});

	});
	$(".top-right-form").mouseleave(function(){
		$(".top-right-form").hide("slide", {direction: "right"});
	});
	$("#password").keyup(function(e){
		if (e.keyCode == 13) {
			this.form.submit();
		}
	})
	$("#signIn").click(function(){
		$(".top-right-form").show("slide", {direction: "right"});
	});
});