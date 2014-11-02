define(["jquery"], function($){
	"use strict";

	var navMenu = $("#navMenu"),
		header = $("header"),
		headerButtons = $("#notificationBttn, #settingsBttn"),
		logoImg = header.find(".logo img");

	// Set tabindex on skip link(s) so IE knows they are focusable, and so Webkit browsers will focus() them.
	$("#contents").attr("tabindex", -1);

	// Apply focus when clicking on skip link
	$(".skip").click(function() {
		$( "#contents" ).focus();
	});

	// Show notification/settings flyouts
	headerButtons.click(function(e){
		// Hide all in the beginning
		$("#notificationsBox, #settingsBox").hide();
		if(this.id === "notificationBttn" ) {
			$("#notificationsBox").show();
			$("#notificationsBox").addClass('animated zoomIn');
			$("#settingsBox").removeClass('animated zoomIn');
		}
		else if(this.id === "settingsBttn" ) {
			$("#settingsBox").show();
			$("#settingsBox").addClass('animated zoomIn');
			$("#notificationsBox").removeClass('animated zoomIn');
		}
	});

	// hide on clicking X icon on the right corner
	$("header").find("#closeNotifications, #closeSettings").click(function(e){
		if(this.id === "closeNotifications" ) {
			$("#notificationsBox").hide();
		}
		else if(this.id === "closeSettings" ) {
			$("#settingsBox").hide();
		}
	});

	// Hamburger icon event handler
	$("#hamburger-button").on("click", function(e){
		if(!navMenu.expanded){
			expandMenu();
		}
		else{
			collapseMenu();
		}
	});

	//emulate hover for mobile devices
	$("li", "#navMenu").find("a").on("touchstart", function(e){
		$(this).addClass("hovered");
	}).on("touchend", function(e){
		$(this).removeClass("hovered");
	});

	//reset the menu state on orientation change
	$(window).on("orientationchange resize", function(e) {
		if(logoImg.is(':visible')){ // if payPal logo image is visible so it's non mobile view
			navMenu.show();
		}else{
			navMenu.hide();
		}
		collapseMenu(true);
		$("html, body").stop().animate({scrollTop: 0}, "80"); // could be deleted for some uses cases
	});


	function expandMenu() {
		navMenu.addClass("expanded").attr("aria-expanded", "true");
		navMenu.stop().slideDown(250, function() {
			$("#contents").wrap('<div class="content-overlay disable-select" />');
			header.css("position", "absolute");
			navMenu.css("overflow","visible");
			navMenu.expanded = true;
			window.scrollTo(0,0); // needed since the header position changes from fixed to absolute
		});
	}

	function collapseMenu(noSlide){
		$("#contents").unwrap();
		if(noSlide){
			navMenu.expanded = false;
			header.css("position", "fixed");
			navMenu.css("overflow","inherit");
			navMenu.removeClass("expanded").attr("aria-expanded", "false");
		}
		else{
			navMenu.stop().slideUp(250, function() {
				navMenu.expanded = false;
				header.css("position", "fixed");
				navMenu.css("overflow","inherit");
				navMenu.removeClass("expanded").attr("aria-expanded", "false");
			});
		}
	}

});
