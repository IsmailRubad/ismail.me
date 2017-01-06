var timer;

function setTimer() {
  timer = setTimeout(showPage, 2000);
}

function showPage() {
  // document.getElementById("loader")
  document.querySelector(".loader").style.display = "none";
  // document.querySelector(".App").style.display = "block";
  document.querySelector(".App").style.visibility = "visible";
}


$(function(){

	$("a").click(function(){
		if(this.hash){
			// get rid of hash sign
			var hash = this.hash.substr(1);

			// get the position of the <a name>
			var $toElement = $("a[name="+hash+"]");
			console.log("toElement"+$toElement);
			var toPosition = $toElement.position().top;
			console.log("toPosition"+toPosition);
			// scroll and animate
			$("body,html").animate({
				scrollTop : toPosition
			},700);

			// do not jump
			return false;
		}
		return true;
	});


	if(location.hash){
		var hash = location.hash;
		window.scroll(0,0);
		$('a[href="'+ hash +'"]').click();
		// $("a[href="+hash+"]").click();
	}


	/*$('.animated_element').on('click',function(){
	  $(this).toggleClass('effect');
	});*/

	var $animation_elements = $('.animated_element');
	var $window = $(window);

	function check_if_in_view() {
	  var window_height = $window.height();
	  var window_top_position = $window.scrollTop();
	  var window_bottom_position = (window_top_position + window_height);

	  $.each($animation_elements, function() {
	    var $element = $(this);
	    var element_height = $element.outerHeight();
	    var element_top_position = $element.offset().top;
	    var element_bottom_position = (element_top_position + element_height);

	    //check to see if this current container is within viewport
	    if ((element_bottom_position >= window_top_position) &&
	      (element_top_position <= window_bottom_position)) {
	      	console.log("inview");
	      $element.addClass('effect');
	    } else {
	      $element.removeClass('');
	    }
	  });
	}

	$window.on('scroll resize', check_if_in_view);
	$window.trigger('scroll');

});
