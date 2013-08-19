if(typeof String.prototype.trim !== 'function') {
  String.prototype.trim = function() {
    return this.replace(/^\s+|\s+$/g, ''); 
  }
}


function extend(B, A) {
	function I() {}
	I.prototype = A.prototype;
	B.prototype = new I();
	B.prototype.constructor = B;
}


function  DirectionsRenderer(panel) {
	this.panel = panel;
	that = this;
	var map,nodeOL,bubble;


this.getInfobubbles = function() {
	return  (that.map !== undefined) ? 
		that.map.getComponentById("InfoBubbles") : undefined;
};
this.showImperialUnits = function() {
	var scaleBar =  (that.map !== undefined) ?  
		that.map.getComponentById("ScaleBar") : null;
	return (scaleBar != null) ?  
		scaleBar.showImperialUnits : false;
};


// The total journey time taken is defined in seconds.
// This is a transformation function
// to alter the units into a more reasonable hours:minutes
// format.

function secondsToTime(secs)  {
	var hours = Math.floor(secs / (60 * 60));
	var divisor_for_minutes = secs % (60 * 60);
	var minutes = Math.floor(divisor_for_minutes / 60);
	return "" + hours + ":" + minutes;
}

//
// The API returns all distances in meters (yards).
// This should be altered to kilometers (miles) for longer 
// distances.
function calculateDistance(distance, metricMeasurements){
	if (metricMeasurements){
		if (distance < 1000){
			return "" + maneuver.length 
				+ " m.";
		} else {
			return "" + Math.floor(distance/100)/10 
				+ " km.";
		}
} else {
		if (distance < 1610){
			return "" + Math.floor(distance/1.0936) 
				+ " yards";
		} else {
			return "" + Math.floor(distance/160.934)/10 
				+ " miles";
		}
	}
}



function addBold(text){
	var bold = document.createElement('strong');
	bold.appendChild(document.createTextNode(text));
	return bold;
}

function addText(text){
	var node = document.createElement("span");
	node.innerHTML = text;
	return node;
}


this.attach = function(display) {
	this.map = display;
}
this.detach = function(display) {
	this.map = undefined;
}


this.setRoute = function  (route) {
	
	if (nodeOL !== undefined){
		nodeOL.parentNode.removeChild(nodeOL);
		if ((this.bubble !== undefined)&& 
			(this.bubble.getState() == "opened" )){
			debugger;
			this.bubble.close();
		}
	}
	nodeOL  = document.createElement("ol");

	var showImperialUnits = that.showImperialUnits();
	
	for (var i = 0;  i < route.legs.length; i++){
		for (var j = 0;  j < 
			route.legs[i].maneuvers.length; j++){
			var details =  document.createElement("li");

			// Get the next maneuver.
			maneuver = route.legs[i].maneuvers[j];
			var instructions = maneuver.instruction;
			// For imperial measurements, extract the
			// distance span

			  if (showImperialUnits == true){
				   var ls = instructions.indexOf
				   		("<span class=\"length\">")
				   var ln = instructions.indexOf
				   		("</span>" , ls);
				   if (ls > -1 && ln > -1){
						distNode = instructions.substring(ls + 21, ln);
						var n=distNode.split(" ");
						if (n[1] == "meters"){
							imperialText = 
							 	calculateDistance(n[0], false);
						} else {
							 imperialText = 
							 	calculateDistance(n[0] * 1000, false);
					}
						instructions = instructions.substring(0, ls + 21)
							+  imperialText + instructions.substring(ln);
				   }
			  }

			  if (instructions.trim() != ""){
					  // Finally add the instruction
					  // to the list along with a link back to 
					  // infobubble.
					details.position = route.legs[i].maneuvers[j].position;
					details.onclick = function() {
							var infoBubbles = that.getInfobubbles();
							if (infoBubbles !== undefined){
							that.bubble = infoBubbles.openBubble(
								this.innerHTML , this.position);
						}
					};
					details.appendChild (document.createTextNode(' '));
					details.appendChild (addText(instructions));
					nodeOL.appendChild(details);
			  }
		}

	}
	this.panel.appendChild(nodeOL);
}
};

