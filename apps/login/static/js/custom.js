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
	
	// var left = (screen.width/2)-300;
	// var top = (screen.height/2)-300;
	// $('#playGuest').popupWindow({centerScreen:1, height:600, width:600});


	$("#guest").click(function(e){	
		e.preventDefault();

		$.get("/rest/random-map", function(response){
			console.log(response);
			var $dialog = $('<div></div>')
               .html('<iframe style="border: 0px;" src="'+ response.url +'" width="600" height="600"></iframe>')

               .dialog({
                   autoOpen: false,
                   modal: true,
                   height: "auto",
                   width: "auto",
                   title: "Zombie Attack"



               });
			$dialog.dialog('open');
		});


	});

});

	