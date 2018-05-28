/*global $,WOW*/
/*
===========================================================================
 EXCLUSIVE ON themeforest.net
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 Project Name       : BeeGees - MultiPurpose Responsive template
 Author             : Ismail Bin Dawud
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 Copyright (c) 2017 -  Ismail Bin Dawud - https://themeforest.net/user/nivodev
===========================================================================
*/


"use strict";


$(function(){

	// ======================================
	// Change carousel interval time
	// ======================================

	// interval is in milliseconds. 1000 = 1 second - so 1000 * 3 = 3 seconds
    $("#myCarousel").carousel({interval: 1000 * 3});
    $("#myCarousel2").carousel({interval: 1000 * 3});
    $("#myCarousel3").carousel({interval: 1000 * 3});


    // =================================
	// Change header
	// =================================
    
	// Cache reference to window
	var $window = $(window);

	$window.on('scroll', switchHeader);
	function switchHeader(){
		if ($window.scrollTop()==0) {
			initHeader();
			$('.go_top').removeClass('show');
		}
		else{
			changeHeader();
			$('.go_top').addClass('show');
		}
	}

	function initHeader(){
		$(".navbar-inverse .navbar-nav>li>a,#header .navbar-brand a,#header .social_link li a").css({"color": "#fff"});
		
		// logo size change
		$("#header .navbar-brand a").css({"font-size": "40px"});

		$(".navbar-inverse .navbar-toggle .icon-bar").css({"background-color": "#fff"});
		
		$("#header nav").removeClass("changeHeader");
		$("#header nav").addClass("initHeader");
		$("#header .social_link").removeClass("social_link_scroll");
	}

	function changeHeader(){
		$(".navbar-inverse .navbar-nav>li>a,#header .navbar-brand a,#header .social_link li a").
		css({"color": "#000"});

		// logo initial size
		$("#header .navbar-brand a").css({"font-size": "30px"});

		$(".navbar-inverse .navbar-toggle .icon-bar").css({"background-color": "#000"});

		$("#header nav").addClass("changeHeader");
		$("#header .social_link").addClass("social_link_scroll");
	}


	// =================================
	// Expertise cicle animation
	// =================================

	$('.circle').appear(function () {
		
		$('.circle').circleProgress();

	});


	// =================================
	// What we offer animation
	// =================================
	$("#offer").appear(function () {
		
		var animationDelay = 300;

		$('#offer .animated_element').appear(function () {
			$(this).addClass('fadeIn');
			$(this).css("animation-delay", animationDelay+"ms");
			animationDelay+=200;
		});

	});



	// =================================
	// number-counter animation
	// =================================
	$("#number_counter").appear(function () {
		
		var animationDelay = 300;

		$('#number_counter .animated_element').appear(function () {

			$(this).addClass('fadeIn');

			$(this).css("animation-delay", animationDelay+"ms");
			animationDelay+=200;
		});

		// count to animation
		$(".timer").each(function () {
			var e = $(this).attr("data-to");
			$(this).delay(6e3).countTo({
				from: 50,
				to: e,
				speed: 3e3,
				refreshInterval: 50
			})
		})
	});


	// =================================
	// What We Do animation
	// =================================

	$("#we_do").appear(function () {
		
		var animationDelay = 300;

		$('#we_do .animated_element').appear(function () {

			$(this).addClass('fadeIn');

			$(this).css("animation-delay", animationDelay+"ms");
			animationDelay+=200;
		});
	});



	// =================================
	// Creative Thinkers animation
	// =================================

	$("#team_sect").appear(function () {
		
		var animationDelay = 300;

		$('#team_sect .animated_element').appear(function () {

			$(this).addClass('scaleIt');

			$(this).css("animation-delay", animationDelay+"ms");
			animationDelay+=200;
		});
	});


	// =================================
	// Latest Projects animation
	// =================================

	$("#work_sect").appear(function () {
		$(this).addClass('fadeOut');
		$(this).css("animation-delay", "500ms");

	});

	// ======================================
	// Projects filter
	// ======================================

    var $container = $('.portfolioContainer');
    $container.isotope({
        filter: '*',
        animationOptions: {
            duration: 750,
            easing: 'linear',
            queue: false
        }
    });
 
    $('.portfolioFilter a').click(function(){
        $('.portfolioFilter .current').removeClass('current');
        $(this).addClass('current');
 
        var selector = $(this).attr('data-filter');
        $container.isotope({
            filter: selector,
            animationOptions: {
                duration: 750,
                easing: 'linear',
                queue: false
            }
         });
         return false;
    });


	
	// =================================
	// Our Publications & Why Us animation
	// =================================

	$("#blog_sect .blog_area").appear(function () {
		$(this).addClass('fadeRight');
	});

	$("#blog_sect .why_us_area").appear(function () {
		$(this).addClass('fadeLeft');
	});

	
	// =================================
	// We're Here & Contact Us animation
	// =================================

	$("#contact_sect .address").appear(function () {
		$(this).addClass('fadeRight');
	});

	$("#contact_sect .form_area").appear(function () {
		$(this).addClass('fadeLeft');
	});


	// ================================
	//	Same page menu link
	// ================================

	// Cache selectors
	var lastId,
	    topMenu = $("#top_menu"),
	    topMenuHeight = topMenu.outerHeight()+15,
	    // All list items
	    menuItems = topMenu.find("a"),
	    // Anchors corresponding to menu items
	    scrollItems = menuItems.map(function(){
	    	var item = $($(this).attr("href"));
	    	if (item.length) { return item; }
	    });

	// Bind click handler to menu items
	// so we can get a fancy scroll animation

	menuItems.on('click', function (e) {
        var href = $(this).attr("href"),
		    offsetTop = href === "#" ? 0 : $(href).offset().top-topMenuHeight+1;
		$('html, body').stop().animate({ 
		  scrollTop: offsetTop
		}, 300);
		e.preventDefault();
    });


	// Bind to scroll
	$window.scroll(function(){
	   // Get container scroll position
	   var fromTop = $(this).scrollTop()+topMenuHeight;
	   
	   // Get id of current scroll item
	   var cur = scrollItems.map(function(){
	       if ($(this).offset().top < fromTop)
	       return this;
	   });
	   // Get the id of the current element
	   cur = cur[cur.length-1];
	   var id = cur && cur.length ? cur[0].id : "";
	   
	   if (lastId !== id) {
	       lastId = id;
	       // Set/remove active class
	       if(id=="home_sect"){
	       		menuItems.parent().removeClass("active");
	       }
	       else{
	       		menuItems
	         		.parent().removeClass("active")
	         		.end().filter("[href='#"+id+"']").parent().addClass("active");
	       }
	   }                   
	});


	
	// ================================
	//	Go back to top
	// ================================

	$('.go_top').on('click', function (e) {
        e.preventDefault();
        $('html,body').animate({
            scrollTop: 0
        }, 700);
    });
		
});





