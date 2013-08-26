function extend(B, A) {
	function I() {}
	I.prototype = A.prototype;
	B.prototype = new I();
	B.prototype.constructor = B;
}

if (!document.getElementsByClassName) {
	document.getElementsByClassName = function(class_name) {
		var docList = this.all || this.getElementsByTagName('*');
		var matchArray = new Array();
		
		/*Create a regular expression object for class*/
		var re = new RegExp("(?:^|\\s)"+class_name+"(?:\\s|$)");
		for (var i = 0; i < docList.length; i++) {
			if (re.test(docList[i].className) ) {
				matchArray[matchArray.length] = docList[i];
			}
		}
		return matchArray;
	} 
}

function TabbedInfoBubbles(backgroundColor, color, tabColor) {

if(	color === undefined){
	color = "white";
}
if(	backgroundColor === undefined){
	backgroundColor = "rgb(0, 15, 26)";
}
if(	tabColor === undefined){
	tabColor = "silver";
}


var tabbedStyleNode = document.createElement('style');
tabbedStyleNode.type = 'text/css';
var css = 'ul.nm_tabnav {' +
		' position: relative;' +
		' top: -39px;' +
		' color:'+ color +';' +	
		' text-align: left;' + 
		' margin: 0px -1em 1em 0px;' + 
		' list-style-type: none;' +
		' padding: 3px 10px 0.1em 10px;' +
		' font-size:small;' +
	'}' +
	'ul.nm_tabnav li {' +
		' display: inline;' +
		' background: '+ backgroundColor +';' +
		' border: 0.1em solid black;' +
		' position: relative;' +
		' top: 1px;' +
		' padding: 3px 1em;' +
		' color:'+ tabColor +';' +
	'}' +
	' ul.nm_tabnav li.nm_tab_current {' +
		' border-bottom: 0.3em solid '+ backgroundColor +';' +
		' font-weight:bold;' +
		' color:'+ color +';' +
	'}' +				
	'.nm_bubble_content > div{' +
	' display: block;' + 
	'}' +
	
	'.nm_bubble_content > div + div{' +
	' display: none;' +
	' }';

	if (tabbedStyleNode.styleSheet) { // IE
	    tabbedStyleNode.styleSheet.cssText = css;
	} else {
	    tabbedStyleNode.appendChild(document.createTextNode(css));
	}
	document.body.appendChild(tabbedStyleNode);
	nokia.maps.map.component.InfoBubbles.call(this);

/////////////////////////////////////////////////////////////////////////
//
// Set up the click event on the infoBubble display. This uses the standard DOM event
// handling technique. The Listener is set up on the containing DIV rather than requiring
// separate handlers for each LI element.
//



var clickFunction =  function (evt) {

	if(evt.target.className == "nm_tab"){
		var offset = 0;
		var tabs = evt.target.parentNode.children;
		var tabContent = this.children;

		while (offset < tabContent.length) {
			if (tabContent[offset].nodeName== "DIV" ) {
					break;
			}
			offset++;
		}
		// Loop through all the LI elements and set the clicked on to current,
		// At the same time ensure only the nth DIV associated with the Nth Tab
		// is visible - all other are set to display:none.

		for (var i = 0, len = tabs.length; i < len; i++){
			if ( tabs[i] == evt.target){
				tabs[i].className = 'nm_tab_current';
				tabContent[i+ offset].style.display ='block';
			} else {
				tabs[i].className = 'nm_tab';
				tabContent[i + offset].style.display ='none';
			}
		}
	}
};

this.attach = function (mapDisplay) {
	nokia.maps.map.component.InfoBubbles.prototype.attach.call(this, mapDisplay);
};

this.addTabbedBubble = function(tabs, content, title, coordinate){
	this.openBubble(tabbedContent(tabs, content, title), coordinate)	;
};


this.openBubble = function(content, coordinate){
	divLength = document.getElementsByClassName("nm_bubble_content").length;
	nokia.maps.map.component.InfoBubbles.prototype.openBubble.call(this, content, coordinate)	;
	wireUp(1);
	wireUp(0);
};


function wireUp(index){
    	var Page = nokia.maps.dom.Page;
		var EventTarget = nokia.maps.dom.EventTarget;
		// This element will only exist once the map has been displayed.
		var infoBubbleDisplay = document.getElementsByClassName("nm_bubble_content")[index];


		// Query Page support for the node.
		Page(infoBubbleDisplay);

		// Attach EventTarget interface to the document.
		EventTarget(infoBubbleDisplay);


		// Add a listener for the click event to the node and show an alert if clicked.
		infoBubbleDisplay.addListener("click", clickFunction , false);
};

//
//  A function transform  the array of Tab Headers,
//  array of Tab Content and an optional Title into a single string of HTML Content.
//
var tabbedContent = function (tabs, content, title){
	var myHTMLcontent = "<ul class=\"nm_tabnav\">";
	for (var i = 0; i < tabs.length; i++){
			if (i==0){
			 	myHTMLcontent = myHTMLcontent + "<li class=\"nm_tab_current\">"+ tabs[i] + "</li>";
			} else {
			 	myHTMLcontent = myHTMLcontent + "<li class=\"nm_tab\">"+ tabs[i] + "</li>";
			}
	}
	myHTMLcontent = myHTMLcontent + "</ul>" + title;
	for (var i = 0; i < content.length; i++){
		if (i==0){
			 	myHTMLcontent = myHTMLcontent + "<div>"+ content[i] + "</div>";
			} else {
			 	myHTMLcontent = myHTMLcontent + "<div>"+ content[i] + "</div>";
			}
  }
	return myHTMLcontent;
}


this.getVersion = function(){
	return '1.0.1';
};



};

