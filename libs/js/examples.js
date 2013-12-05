function activate(opt) {
	alert(opt);

	$('#' + opt + '-ext').toggleClass('hide show');
}

function toggleNavi() {

	if ($('#navi').hasClass('hide')) {
		$('#navi').slideDown("slow");
		$('#navi').toggleClass('hide show');
	} else {
		$('#navi').slideUp();
		$('#navi').toggleClass('hide show');
	}
}

function testGit() {

	var url;
	var res = $.getJSON('https://api.github.com/repos/heremaps/examples/contents/maps_js?ref=master', opt, function(data) {
		var items = [];
		//alert(req.getAllResponseHeaders());
		$.each(data, function(key, val) {
			txt=replaceAll('-',' ',val.name);
			txt=replaceAll('.html',' ',txt);
			items.push('<span class="span3"> <a href="#" class="iframelink" id="' + val.path + '">' + txt + '</a></span>');

			if ((key + 1) % 4 == 0) {

				$('<div />', {
					'class' : 'row-fluid span12',
					html : items.join('')
				}).appendTo('#examples');
				items = [];

			}

		});
		$('<div />', {
			'class' : 'row-fluid span12',
			html : items.join('')
		}).appendTo('#examples');

	});

}
function replaceAll(find, replace, str) {
  return str.replace(new RegExp(find, 'g'), replace);
}
var ifurl = 'https://rawgithub.com/heremaps/examples/master/';
$('body').on('click', '.iframelink', function() {
	var href = $(this).attr('id');
	var $iframe = $('#icontainer');
	if ($iframe.length) {
		alert(ifurl + href);
		$iframe.attr('src', ifurl + href);
		return false;
	}
	return true;
	//$('#icontainer').attr('src', ifurl + href);

});

$(document).ready(function() {
	//
	//  examples.js
	//  test
	//
	//  Created by j15singh on 2013-09-09.
	//  Copyright 2013 j15singh. All rights reserved.
	//
	var h = window.screen.height;
	var header = $('#header').height();
	var footer = $('.footer').height();
	alert(h);
	alert(document.body.scrollHeight);
	
	$('#icontainer').height(h*.75);

	testGit();

	$('#header').click(function() {
		alert('');
	});

	$('#main').click(function() {
		if ($('.footer').hasClass('opened')) {
			alert('');
			$('.footer').stop().animate({
				"top" : "0px",
			});
			$('.footer').removeClass('overflow');
			$('.hidebtn').toggleClass('hide show');
			$(".slider").removeClass('tester');
			$('.footer').toggleClass('closed opened');
		}
	});

	$(".slider").click(function() {
		if ($('.footer').hasClass('closed')) {
			$('.footer').stop().animate({
				"top" : "-41em"

			});

			$(this).toggleClass(' tester');
			//call func to populate
			$('.footer').addClass('overflow');
			
			$('.footer').toggleClass('closed opened');
			$('.hidebtn').toggleClass('hide show');

		} else {
			//call func to populte
			$(".slider").removeClass('tester');

			$(this).toggleClass(' tester');

		}

	});

	$(".hidebtn").click(function() {
		$('.footer').stop().animate({
			"top" : "0px",

		});
		$('.footer').removeClass('overflow');
		$('.hidebtn').toggleClass('hide show');
		$(".slider").removeClass('tester');
		$('.footer').toggleClass('closed opened');
	});

});

var opt = {
	client_id : "75078232e1b082bae407",
	client_secret : "3938326617c81c42d76c2e405a36c75616992f0a"
};

