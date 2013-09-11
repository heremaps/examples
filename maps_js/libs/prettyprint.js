



(function(exports, ctx) {
	$((function(){
		$("<link href='./css/prism.css' rel='stylesheet'>").appendTo('head');
		$("<script type='text/javascript' src='libs/prism.js' >").appendTo('head');

		var codeStyleNode = ctx.createElement('style');
		codeStyleNode.type = 'text/css';
		var css = 'code.prettyprint{' +
				' display: block;' +
				' margin-left:1em;' +
				' padding: 1em;' +
				' white-space: pre-wrap;' +
				' word-wrap: break-word; ' +
				' background-color: #f5f2f0; ' +		
				' font-size:12px; ' +		  	  
			'}';
			
		if (codeStyleNode.styleSheet) { // IE
		    codeStyleNode.styleSheet.cssText = css;
		} else {
		    codeStyleNode.appendChild(ctx.createTextNode(css));
		}
		if (ctx.body){
			ctx.body.appendChild(codeStyleNode);
		} else if(ctx.addEventListener) {
			ctx.addEventListener("DOMContentLoaded",  function() {
				ctx.body.appendChild(codeStyleNode);
			}, false);
		} else {
			ctx.attachEvent("DOMContentLoaded",  function() {
				ctx.body.appendChild(codeStyleNode);
			});
		}
		
		var script = null,
		baseNS = null,
		mapsNS = null;
	
	// Iterate through the <SCRIPT> Tags to find the loader
	// Then use the element to obtain additional constants
	// such as the name of the DOM element that displays the
	// map	
	$(ctx.getElementsByTagName('script')).each(function(index, value) {
    	if ($(this).attr('id') == 'HereMapsPrettyPrint'){
    		script = $(this);
    		return false;
    	}
    	return true;
	});
		
	var functions = $(script).data('display-functions');
	functionsArr = functions.split(',');
	$.each(functionsArr , function(index, value) {
		var functionToDisplay = exports[value];	
		if (functionToDisplay !== undefined){
			var text = functionToDisplay.toString();
			var textNode = ctx.createTextNode(text);
			var preNode = $("<pre></pre>");
			var spanNode =  $("<span></span>"); 
			var codeNode =  $("<code class='prettyprint language-javascript'></code>");
			
			codeNode.append(textNode);
			spanNode.append(codeNode);
			preNode.append (spanNode)
			$('#src').append(preNode)
		}
    	
	});
	Prism.highlightAll();
	}));
})(window, document);