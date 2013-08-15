function extend(B, A) {
	function I() {}
	I.prototype = A.prototype;
	B.prototype = new I();
	B.prototype.constructor = B;
}


function Tooltip() {
var tooltip; // Inject a tooltip DIV into the DOM
var map;

// ensure CSS is injected
 var tooltipStyleNode = document.createElement('style');
 tooltipStyleNode.type = 'text/css';
 var css = '#nm_tooltip{' +
		' position: absolute;' +
		' color:white;' +
		' background:black;' +
		' border: 1px solid grey;' +
		' padding-left: 1em; ' +
		' padding-right: 1em; ' +
		' display: none;	' +
		' min-width: 120px;	' +  			  	  
	'}';

if (tooltipStyleNode.styleSheet) { // IE
    tooltipStyleNode.styleSheet.cssText = css;
} else {
    tooltipStyleNode.appendChild(document.createTextNode(css));
}
document.body.appendChild(tooltipStyleNode);


var showTooltip = function (evt){
	
	if (( evt.target.title === undefined) == false){
			tooltip.innerHTML =  evt.target.title;
			tooltip.style.display ='block';
		
			var left = evt.target.getDisplayBoundingBox(map).getCenter().x - (tooltip.offsetWidth/2);
			var top =  evt.target.getDisplayBoundingBox(map).bottomRight.y + 1; // Slight offset to avoid flicker.
			
			document.getElementById("nm_tooltip").style.left = left + "px";
			document.getElementById("nm_tooltip").style.top = top + "px";
  }
}

var hideTooltip = function ( evt){
	if (( evt.target.title === undefined) == false){
				tooltip.style.display ='none';			
		}
}

var dragTooltip = function(evt) {	 
			 if (tooltip.style.display == 'block'){
			 	    map.dispatch( new nokia.maps.dom.Event({type: "mouseover", target: map.getObjectAt(evt.displayX, evt.displayY)}));
			 }
};


this.attach = function (mapDisplay) {

		map = mapDisplay;	
		tooltip  = document.createElement("div");
		tooltip.id = 'nm_tooltip';
		map.getUIContainer().appendChild(tooltip);

		//
		//  Show tooltip on Mouse Over.
		//
		//
		map.addListener("mouseover", showTooltip);
		//
		// Return the cursor to normal if the marker which has a click or an href
		// loses focus. Also clear the tooltip one was displayed.
		//
		map.addListener("mouseout", hideTooltip);
		//
		// On click we want to forward or do the "onclick" functiion
		//
		map.addListener("click", hideTooltip);
		//
		// If the map is draggable, and the tooltip is displayed, drag the tooltip
		// with the map.
		//
		map.addListener("drag", dragTooltip);

};

this.detatch = function(mapDisplay){
	
		mapDisplay.removeListener("mouseover", showTooltip);	
		mapDisplay.removeListener("mouseout" , hideTooltip);
		mapDisplay.removeListener("click" , hideTooltip);	
		mapDisplay.removeListener("drag", dragTooltip);
	
};

this.getId = function () {
	return 'Tooltip';
};


this.getVersion = function(){
		return '1.0.0';
}; 

};

