var prev = 'null';
var ifurl = 'https://rawgithub.com/heremaps/examples/master/';
var giturl = 'https://github.com/heremaps/examples/blob/master/';

function testGit() {

	var res1 = $.getJSON('https://api.github.com/repos/heremaps/examples', opt, function(data) {
		$('#count-watch').append(data.watchers);
		var url = data.contributors_url;

		$.when(addlevel2(url)).then(function(level2) {

			$('#count-contributors').append(level2.length);
		});
	});

	var res2 = $.getJSON('https://api.github.com/repos/heremaps/examples/contents/maps_js?ref=master', opt, function(data) {
		var items = [];
		var countex = data.length;

		$('#count-ex').append(countex);
		$('#count-ex').prop('href', 'https://github.com/heremaps/examples');
		//need to template
		$.each(data, function(key, val) {
			txt = replaceAll('-', ' ', val.name);
			txt = replaceAll('.html', '', txt);
			modifiedpath = replaceAll('/', '--', val.path);
			modifiedpath = replaceAll('.html', 'html', modifiedpath);

			items.push('<li><a href="#" class="iframelink ' + modifiedpath + '" id="' + val.sha + '">' + txt + '</a></li>');

		});
		$('<ul />', {
			'class' : '',
			'style' : 'margin:0',
			html : items.join('')
		}).appendTo('.examples');

	});
	var ajaxRequests = [res1, res2];
	$.when.apply($, ajaxRequests).done(function() {
		checkURLforParams();
		$("#block").slideUp(800);

	});

}

function updateGetStarted()
{
	$('#blob').hide();
	$('#text').show();
	$('#heading').text('Lets start with some examples');
	
}


function checkURLforParams() {
	var category;
	if (getUrlVars()['cat'] == 'simple') {

		$('#beginner').click();
		category = "#beginnerex";

	}
	if (getUrlVars()['cat'] == 'advanced') {

		$('#advanced').click();
		category = "#advancedex";

	}
	if (getUrlVars()['cat'] == 'demos') {

		$('#demos').click();
		category = "#demoex";

	}

	if (getUrlVars()['example'] != null) {

		styleClass = replaceAll('/', '--', getUrlVars()['example']);

		styleClass = replaceAll('.html$', 'html', styleClass);

		$(category + ' .iframelink.' + styleClass).click();
		$(".nano").nanoScroller({
			scrollTo : $('.iframelink.' + styleClass),
			offsetY : '200'
		});

	}

}

var prevHeading = null;
$('.accordion-heading a').click(function() {
	//$('#beginner-list').toggleClass('show hide');
	if (prevHeading != null) {
		$(prevHeading).find('h4').removeClass('current_heading');
	}
	if (prevHeading == this) {
		$(prevHeading).find('h4').removeClass('current_heading');
		prevHeading = null;
		return;
	}
	prevHeading = this;
	$(".nano").nanoScroller();

	$(this).find('h4').addClass('current_heading');

	//$(this).find('i').toggleClass('icon-double-angle-down icon-double-angle-up');
});

function addlevel2(val) {

	var secondlevel = $.getJSON(val, opt);

	return secondlevel;

}

function replaceAll(find, replace, str) {
	return str.replace(new RegExp(find, 'g'), replace);
}

function getScriptInclude(src) {
	return '<scr' + 'ipt src="' + src + '"></scr' + 'ipt>';
}

var opt = {
	client_id : "75078232e1b082bae407",
	client_secret : "3938326617c81c42d76c2e405a36c75616992f0a"
};

$.getGithubFileAuth = opt;

function removeFromContent(src, content) {
	return replaceAll('<scr' + 'ipt type="text/javascript" src="libs/' + src + '"></scr' + 'ipt>', '', content);

}


$('body').on('click', '.iframelink', function() {

	$('.breadcrumb').show();
	$('.breadcrumb').css('display', 'inline');

	if (prev.text != this.text) {

		$(prev).parent().removeClass('link-selected');
		$(this).parent().addClass('link-selected');

	}

	$('#text').hide();
	$('#blob').show();
	var sha = $(this).attr('id');
	var classList = $(this).attr('class').split(/\s+/);
	var path = 'nothing yet';
	$.each(classList, function(index, item) {
		if (item.indexOf('html') != -1) {
			path = item;

		}
	});
	//path= replaceAll('--','/',path);

	txt = replaceAll('-', ' ', path);
	//class
	txt = replaceAll('html$', '', txt);
	txt = replaceAll('maps_js', ' ', txt);
	$('#child').html(txt);
	$('#githtml').show();
	var heading = $('.link-selected').parents('.accordion-group').find('.accordion-heading h4').html();
	$('#parent a').html(heading);

	path = replaceAll('--', '/', path);
	path = replaceAll('html$', '.html', path);
	$('#githtml a').prop('href', giturl + path);
	//path
	//setHeightIF();
	$.getGithubFile("heremaps", "examples", sha, function(contents) {

		contents = redoBoilerPlate(contents);

		iframe = document.getElementById('icontainer');
		if (iframe != null) {
			iframe.remove();
			iframe = null;
		}

		// Finnaly attach it into the DOM
		$('<iframe id="icontainer" class="noborder" src="" width="101%">').appendTo('#blob');
		setHeightIF();
		iframe = document.getElementById('icontainer');
		iframe.contentWindow.document.open();

		iframe.contentWindow.document.write(contents);

		iframe.contentWindow.document.close();

	});
	setHeightIF();
	setHeightScroll();
	prev = this;
	return true;

});
$(document).ready(function() {
	setHeightScroll();
	testGit();
	
});
var newHead = '<head>' + '<base href="http://rawgithub.com/heremaps/examples/master/maps_js/"></base><link href="/main/css/iframe.css" rel="stylesheet">' + getScriptInclude("/main/libs/jquery/jquery.js") + getScriptInclude("/main/libs/github-examples-script/hereAppIdAndToken.js");

function redoBoilerPlate(contents) {
	contents = removeFromContent('jQl.min.js', contents);
	contents = removeFromContent('prettyprint.js', contents);
	contents = removeFromContent('hereAppIdAndToken.js', contents);
	//https://raw.github.com/heremaps/examples/master/maps_js/data/
	contents = replaceAll('<script type="text/javascript" src="libs/hereAsyncLoader.js"', '<scr' + 'ipt type="text/javascript" src="/main/libs/github-examples-script/hereAsyncLoader.js"', contents);
	//contents = replaceAll('src="data/', 'src="http://rawgithub.com/heremaps/examples/master/maps_js/data/', contents);
	contents = replaceAll('<head>', newHead, contents);
	contents = replaceAll('</body>', getScriptInclude("/main/libs/github-examples-script/prettyprint.js") + '</body>', contents);

	return contents;
}

function setHeightIF() {
	var h = $(document).height();

	var header = $('#header').height();
	var footer = $('.footer').height();
	h = h - header * 2 - footer * 2;

	$('#icontainer').height(h * .94);

	//$('#examples').height(h * .8);

}

function setHeightScroll() {
	var h = $(document).height();

	var header = $('#header').height();
	var footer = $('.footer').height();
	var accheader = $($('.accordion-heading').get(1)).height();
	h = h - header * 2 - footer * 2 - accheader * 4;

	$('.nano').height(h * .85);

	//$('#examples').height(h * .8);

}

function refresh_page() {
	alert('woooo');
}

function getUrlVars() {
	var vars = [], hash;
	var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
	for (var i = 0; i < hashes.length; i++) {
		hash = hashes[i].split('=');
		vars.push(hash[0]);
		vars[hash[0]] = hash[1];
	}
	return vars;
}

function getFile() {
	var res = 'hello';
	$.ajaxSetup({
		async : false
	});
	$.ajax({
		url : "basic-map-with-components.html",
		success : function(result) {
			alert(result);
			res = result;
		}
	});
	$.ajaxSetup({
		async : true
	});
	return res;
}


$('#back').click(function() {
	//alert();
	$('#dev-ent').hide();
	$('#options').slideDown('slow');

	//$('#dev-ent').css('display','inline-block');
});

$('#dev').click(function() {
	//alert();
	$('#options').hide();
	$('#dev-ent').slideDown('slow');
	//$('#dev-ent').css('display','inline-block');
});

