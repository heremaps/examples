
function replaceAll(find, replace, str) {
	return str.replace(new RegExp(find, 'g'), replace);
}

$(function() {
	$('a[href*=#]:not([href=#])').click(function() {
		if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') || location.hostname == this.hostname) {

			var target = $(this.hash);
			target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
			var sc = target.offset().top - 75;
			if (target.length) {
				$('html,body').animate({
					scrollTop : sc
				}, 1000);
				return false;
			}
		}
	});
});

function bounce() {
	$('#pointer-inner').effect('bounce', {
		duration : 3500
	}, bounce);
}


$(document).ready(function() {

	var oldIE;
	if ($('html').is('.ie6, .ie7, .ie8')) {
		oldIE = true;
	}

	if (oldIE) {
		$('#ie-error').show();
	} else {
	}

	$('.section').css('max-height', $(window).height() * 0.89);
	
	captions = $('.span4.caption');
	
	maxHeightCaptions = Math.max.apply(Math, captions.map(function() {
		
		return $(this).height() + 25;
	}).get());
	captions.height(maxHeightCaptions);

	var num = Math.floor((Math.random() * 11) + 1);
	$('.masthead').addClass('masthead' + num);

	//testGit();
	bounce();
	$("#block").slideUp(1000);
	//testStack();

});

$(window).scroll(function() {
	$('#pointer').hide();
});

$('a').click(function() {
	$('html, body').animate({
		scrollTop : $($(this).attr('href')).offset().top
	}, 500);
	return false;
});
function hideInfo() {
	$('.info').hide();
	$('.navigation').show();
}


