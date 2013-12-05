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


$(document).ready(function() {
	testGit();

	boxes = $('.box-repo');

	maxHeight = Math.max.apply(Math, boxes.map(function() {

		return $(this).height();
	}).get());

	boxes.height(maxHeight);

	/*$.getGithubFile("heremaps", "examples", "30715115dd737d69b95ea718c86b8689a8f9060a", function(contents) {
	 console.log(contents);
	 });*/

});
$(window).load(function() {
	bounce();
});
function bounce() {
	$('#marker').effect('bounce', {
		duration : 5000
	}, bounce);
}

var opt = {
	client_id : "75078232e1b082bae407",
	client_secret : "3938326617c81c42d76c2e405a36c75616992f0a"
};

function replaceAll(find, replace, str) {
	return str.replace(new RegExp(find, 'g'), replace);
}

function testGit() {
	
	var url;
	var header = $.getJSON('https://api.github.com/repos/heremaps/examples/events', opt, function(data) {
		var url = data[0].actor.url;
		var repo = replaceAll('heremaps/', '', data[0].repo.name);
		$('#repository').append(repo);
		$('#repository').prop('href', 'https://github.com/' + data[0].repo.name);
		$('#repository').addClass('lightblue');
		$.when(addlevel2(url)).then(function(person) {
			$('#name').append(person.name);
			$('#name').addClass('lightblue');
			$('#name').prop('href', person.html_url);
			$('#place').append(person.location);
			$('#place').addClass('lightblue');
		});

	});

	var res = $.getJSON('https://api.github.com/users/heremaps', opt, function(data) {
		var items = [];
		//alert(req.getAllResponseHeaders());
		$.each(data, function(key, val) {

			if (key == 'repos_url') {
				url = val;

			}

		});
		//level2
		$.when(addlevel2(url)).then(function(level2) {

			var c = 1;
			var row = [];
			for (d in level2) {

				var items = [];
				var items_minute = [];

				row.push('<div class="span3 box-repo" id="repo_' + level2[d].id + '">');
				row.push('<div class="well-small"><div class="well-small pull-left"> <img src="img/icongit.png" /></div>');
				row.push('<div class="well-small">');
				row.push('<h4 ><a href="' + level2[d].html_url + '"> ' + level2[d].name + '</a>  </h4>');
				row.push('<p >' + level2[d].description + '</p>');
				row.push('</div>');
				row.push('</div>');

				row.push('<div class= "show minutedetails row-fluid greyHEREbackground">');
				row.push('<ul class="" style="list-style: none;">');
				row.push('<li class="span4"  id="repo_watchers"> Watchers: ' + level2[d].watchers + ' </li>');
				row.push('<li class="span4" id="repo_fork"> forks: ' + level2[d].forks_count + ' </li>');
				row.push('<li class="span4" id="repo_language"> <b> ' + level2[d].language + '</b> </li>');
				row.push('</ul>');
				row.push('</div>');

				row.push('</div>');

				if (c % 4 == 0) {

					$('<div/>', {
						'class' : 'row-fluid well-large',
						'style' : 'width: 95%;',
						'id' : 'row-' + c,
						html : row.join('')
					}).appendTo('#repos_list');

					row = [];
				}
				c++;

			}
			$('<div/>', {
				'class' : 'row-fluid well-large',
				'style' : 'width: 95%;',
				'id' : 'row-' + c,
				html : row.join('')
			}).appendTo('#repos_list');

			boxes = $('.box-repo');

			maxHeight = Math.max.apply(Math, boxes.map(function() {

				return $(this).height();
			}).get());

			boxes.height(maxHeight);

		});
	});

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

function addlevel2(val) {

	var secondlevel = $.getJSON(val, opt);

	return secondlevel;

}

function completeList(st) {

	$('<ul/>', {
		'class' : 'my-new-list ',
		html : items.join('')
	}).appendTo('#info');
}


$("#head").fitText(4);

