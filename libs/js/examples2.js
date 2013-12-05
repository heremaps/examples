var prev = 'null';
var ifurl = 'https://rawgithub.com/heremaps/examples/master/';

function bounce() {
	$('#octocat').effect('bounce', {
		duration : 3500
	}, bounce);
}


$(window).on('hashchange',function(){
	checkURLforParams();
});

var opt = {
	client_id : "75078232e1b082bae407",
	client_secret : "3938326617c81c42d76c2e405a36c75616992f0a"
};

var repo= {
	repo_id: 'examples',
	user: 'heremaps',
	folder: 'maps_api_for_javascript',
	url: 'https://github.com/heremaps/examples/blob/master/maps_api_for_javascript/',
	raw_url:'http://rawgithub.com/heremaps/examples/master/maps_api_for_javascript/'
};


function testGit() {
	var countex = 0;
	var res1 = $.getJSON('https://api.github.com/repos/'+repo.user+'/'+repo.repo_id, opt, function(data) {

		var url = data.contributors_url;
		$('#count-watch').append(data.watchers);
		$.when(addlevel2(url)).then(function(level2) {
			$('#count-contributors').append(level2.length);
		});
	});
	var demosfolder;
	var simple_examples_list;
	var advanced_examples_list;
	var deferredCollection=[];
	var res2 = $.getJSON('https://api.github.com/repos/'+repo.user+'/'+repo.repo_id+'/contents/'+repo.folder+'?ref=master', opt, function(data) {
		$.each(data, function(key, val) {
			if (val.name == 'simple-examples') {
				simple_examples_list = $.getJSON(val.url, opt, function(examples){
					addToMenu(examples,'simple-examples')
				} );
			}
			if (val.name == 'advanced-examples') {
				advanced_examples_list = $.getJSON(val.url, opt, function(examples){
					addToMenu(examples,'advanced-examples')});
			}
			if (val.name == 'demos') {
				var items = [];
				demosfolder = $.getJSON(val.url, opt, function(examples) {
					$.each(examples, function(num, folder) {
						if (folder.name == 'css' || folder.name == 'img' || folder.name == 'libs' || folder.name == 'kml' || folder.name == 'data' || folder.name == 'geojson') {
							return;
						}
						var demos= $.ajax({
							url:    folder.url
							+ '&client_id='+opt.client_id
							+ '&client_secret='+opt.client_secret
							,
							success: function(example){
								$.each(example, function(num, file) {
									if (file.name.indexOf('.html') !== -1) {
										var txt = replaceAll('-', ' ', folder.name);
										if(file.name !=='index.html')
										{
											txt+=': '+replaceAll('-', ' ', capitaliseFirstLetter(file.name));
										}
										txt = replaceAll('.html', '', txt);
										classname = replaceAll('.html', '', folder.name+'__'+file.name);
										console.log(txt);
										countex++;

										items.push('<li><i class="icon-angle-right arrow-menu-icon"></i><a style="" class="iframelink ' + classname + ' menu-entry" id="' + file.sha + '">' + capitaliseFirstLetter(txt) + '</a></li>');

									}
								});
							},
							async:   false
						});
					});
console.log("demos");
$('<ul />', {
	'class' : '',
	'style' : 'margin:0',
	html : items.join('')
}).appendTo('#demos');

});

}

});
deferredCollection.push(demosfolder);
deferredCollection.push(simple_examples_list);
deferredCollection.push(advanced_examples_list);
$.when.apply( $, deferredCollection ).then(function(){

	$("#block").slideUp(800);
	$('#count-ex').append($('.accordion li').size());
	console.log('time to check url');
	checkURLforParams();
}, function(){
	$('#fail').show();
});

	});


}


var addToMenu=function(examples,type) {
	var items = [];
	$.each(examples, function(num, ex) {
		if (ex.name == 'css' || ex.name == 'img' || ex.name == 'libs' || ex.name == 'kml' || ex.name == 'data' || ex.name == 'geojson') {
			return;
		}
		txt = replaceAll('-', ' ', ex.name);
		txt = replaceAll('.html', '', txt);
		classname = replaceAll('.html', '', ex.name);
		items.push('<li><i class="icon-angle-right arrow-menu-icon"></i><a class="iframelink ' + classname + ' menu-entry" id="' + ex.sha + '">' + capitaliseFirstLetter(txt) + '</a></li>');

	});
	console.log(type);
	$('<ul />', {
		'class' : '',
		'style' : 'margin:0',
		html : items.join('')
	}).appendTo('#'+type);

}

function updateGetStarted() {
	$('#blob').hide();
	$('#text').show();
	$('#heading').text('Lets start with some examples');

}

function checkURLforParams() {
	var category;
	var hash = window.location.hash;

	if (hash != '') {
		if (hash=='#beginner' || hash=='#advanced' || hash=='#demo') {

			$(hash).click();
		}
		else {
			styleClass = replaceAll('/', '--', hash);
			styleClass = replaceAll('#', '', styleClass);
			styleClass = replaceAll('.html', '', styleClass);

			$('.iframelink.' + styleClass).click();
			$(".nano").nanoScroller({
				scrollTo : $('.iframelink.' + styleClass),
			});

		}

	}

}

var prevHeading = null;
$('.accordion-heading a').click(function() {

	if (prevHeading != null) {
		$(prevHeading).parents(".accordion-heading").removeClass('current_heading');
	}
	if (prevHeading == this) {
		$(prevHeading).parents(".accordion-heading").removeClass('current_heading');
		prevHeading = null;
		return;
	}
	prevHeading = this;
	$(".nano").nanoScroller();

	$(this).parents(".accordion-heading").addClass('current_heading');

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


$.getGithubFileAuth = opt;

function removeFromContent(src, content, type) {
	if(type=='demos')
	{
		return replaceAll('<scr' + 'ipt type="text/javascript" src="../libs/' + src + '"></scr' + 'ipt>', '', content);
	}
	return replaceAll('<scr' + 'ipt type="text/javascript" src="libs/' + src + '"></scr' + 'ipt>', '', content);

}



$('body').on('click', '.iframelink', function() {

	$('.breadcrumb').show();
	$('.breadcrumb').css('display', 'inline');

	window.history.pushState('string', 'Title', '#' + $(this).attr('class').split(' ')[1]);
	if (prev.text != this.text) {

		$(prev).parent().removeClass('link-selected');
		$(this).parent().addClass('link-selected');

	}
	var category_of_example;
	category_of_example=$(this).parents('.examples').attr('id');
	if ($(this).parents('.accordion-group').find('.accordion-heading').attr('class').indexOf('current_heading')==-1) {
		$(this).parents('.accordion-group').find('.accordion-heading a').click();
		prevHeading = $(this).parents('.accordion-group').find('.accordion-heading a');
	}

	$('#text').hide();

	var sha = $(this).attr('id');
	var classList = $(this).attr('class').split(/\s+/);
	var path = classList[1];
	var demofolder;
	if(path.indexOf('__')!== -1)
	{
		demofolder=path.split('__')[0];
	}
	path= replaceAll("__","/",path);
	


	//path= replaceAll('--','/',path);

	txt = replaceAll('-', ' ', path);
	//class

	txt = replaceAll('maps_js', ' ', txt);
	txt = replaceAll('Examples', '', txt);
	$('#child').html('\'' + capitaliseFirstLetter(txt) + '\'');
	$('#githtml').show();
	var heading = $('.link-selected').parents('.accordion-group').find('.accordion-heading h4').html();
	$('#parent').html(heading);

	
	path = repo.url + category_of_example + '/'+ path + '.html';

	//path
	//setHeightIF();
	$.getGithubFile(repo.user, repo.repo_id, sha, function(contents) {

		contents = redoBoilerPlate(contents,category_of_example,demofolder);
		contents = addGithubLinkToTitle(contents, path);

		iframe = document.getElementById('icontainer');
		blob = document.getElementById('blob');
		if (iframe != null) {
			blob.removeChild(iframe);
			iframe = null;
		}

		// Finnaly attach it into the DOM
		$('<iframe id="icontainer" class="noborder" src="" width="104%">').appendTo('#blob');
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

function addGithubLinkToTitle(content, path) {

	str = '<a style="padding-left:8px; " href="' + path + '" id="githtml" class="hide well-small lightblue" target="_blank" > <i class="icon-github"></i> View source </a>';
	content = replaceAll('</h4>', '</h4>' + str, content);
	return content;
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

	setHeightScroll();
	testGit();
	

});
var newHead = '<head>' + '<link href="css/iframe.css" rel="stylesheet"><link href="libs/fonts/others/font-awesome/css/font-awesome.css" rel="stylesheet">' + getScriptInclude("libs/jquery/jquery.js") + getScriptInclude("libs/github-examples-script/hereAppIdAndToken.js");

function redoBoilerPlate(contents,type,folder) {

	var new_url= repo.raw_url+type+'/';
	contents= replaceAll("<body",'<body class="other"', contents);
	if(type=='demos')
	{
		new_url+=folder+'/';
		if(folder.indexOf('directions')!== -1 || folder.indexOf('sidebar')!== -1)
		{
			contents= replaceAll('class="other"','class="smallmap"', contents);
		}
	}
	

	contents = removeFromContent('jQl.min.js', contents,type);

	contents = removeFromContent('prettyprint.js', contents,type);
	contents = removeFromContent('hereAppIdAndToken.js', contents,type);
	contents = removeFromContent('prism.js', contents,type);
	contents = removeFromContent('jquery-1.10.2.min.map', contents,type);
	if (contents.indexOf("random-point-generator") != -1) {
		contents=removeFromContent('random-point-generator.js', contents,type);
		var scripts = getScriptInclude("libs/github-examples-script/random-point-generator.js");
		newHead+=scripts;
	}

	contents = replaceAll('src="(?!http)', 'src="'+new_url, contents);
	contents = replaceAll('h1', 'h4', contents);
	contents = replaceAll(new_url+'/libs/prettyprint.js', 'libs/github-examples-script/prettyprint.js', contents);
	if(type=='demos')
	{
		contents = replaceAll(new_url+'../libs/hereAsyncLoader.js', 'libs/github-examples-script/hereAsyncLoader.js', contents);
	}
	else
	{
		contents = replaceAll(new_url+'libs/hereAsyncLoader.js', 'libs/github-examples-script/hereAsyncLoader.js', contents);
	}
	contents = replaceAll('a href="(?!http)', 'a href="'+new_url, contents);
	contents = replaceAll('a href=', 'a target=\'_blank\' href=', contents);
	contents = replaceAll('= \'\\./kml/', '= \''+new_url+'kml/', contents);
	contents = replaceAll('\\./kml/', new_url+'kml/', contents);
	contents = replaceAll('= \'\\./img/', '= \''+new_url+'img/', contents);
	contents = replaceAll('\\./img/', new_url+'img/', contents);
	contents = replaceAll('= \'\\./geojson/', '= \''+new_url+'geojson/', contents);
	contents = replaceAll('\\./geojson/', new_url+'geojson/', contents);
	contents = replaceAll('= \'\\./data/', '= \''+new_url+'data/', contents);
	contents = replaceAll('= \'data/', '= \''+new_url+'data/', contents);
	contents = replaceAll('"data/', '"'+new_url+'data/', contents);
	//contents = replaceAll('src="data/', 'src="http://rawgithub.com/'+repo.user+'/'+repo.repo_id+'/master/'+repo.folder+'/+type+/data/', contents);
	contents = replaceAll('<head>', newHead, contents);
	contents = replaceAll('</body>', getScriptInclude("libs/github-examples-script/prettyprint.js") + '</body>', contents);

	//  contents = replaceAll('./data/', 'https://raw.github.com/heremaps/examples/master/maps_js/data/', contents);
	
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

function capitaliseFirstLetter(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}

function setHeightScroll() {
	var h = $(document).height();

	var header = $('#header').height();
	var footer = $('.footer').height();
	var accheader = $($('.accordion-heading').get(1)).height();
	h = h - header * 2 - footer * 2 - accheader * 4;

	$('.nano').height(h * .94);
	$('#text').height(h*1.2);

	//$('#examples').height(h * .8);

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

