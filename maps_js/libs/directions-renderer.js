if(typeof String.prototype.trim !== 'function') {
  String.prototype.trim = function() {
    return this.replace(/^\s+|\s+$/g, ''); 
  }
}

(function(ctx) {
		// ensure CSS is injected
	var directionsStyleNode = ctx.createElement('style');
	directionsStyleNode.type = 'text/css';
	 var css = '.manuever_instruction{' +
			' line-height: 130%; ' +
			' font-size: 11px; '+
			' font-family: "Lucida Grande",'+
			'"Lucida Sans Unicode",Arial,Helvetica,sans-serif; '+		  	  
		'}' +
		'.manuever_instruction .heading, '+
		'.manuever_instruction .length, '+
		'.manuever_instruction .direction{' +
			' font-weight: bold; '+ 			  	  
		'}' ;

	if (directionsStyleNode.styleSheet) { // IE
	    directionsStyleNode.styleSheet.cssText = css;
	} else {
	    directionsStyleNode.appendChild(ctx.createTextNode(css));
	}	
	if (ctx.body){
		ctx.body.appendChild(directionsStyleNode);
	} else if(ctx.addEventListener) {
		ctx.addEventListener("DOMContentLoaded",  function() {
			ctx.body.appendChild(directionsStyleNode);
		}, false);
	} else {
		ctx.attachEvent("DOMContentLoaded",  function() {
			ctx.body.appendChild(directionsStyleNode);
		});
	}
	
})(document);



function extend(B, A) {
	function I() {}
	I.prototype = A.prototype;
	B.prototype = new I();
	B.prototype.constructor = B;
}


function  DirectionsRenderer(panel) {
	nokia.maps.map.component.Component.call(this);
	this.init(panel);
}
extend(DirectionsRenderer,
		nokia.maps.map.component.Component);


DirectionsRenderer.prototype.init = function (panel){
	var that = this;
	that.set("panel", panel);

	that.getInfobubbles = function() {
		return  (that.map !== undefined) ? 
			that.map.getComponentById("InfoBubbles") : undefined;
	};
	that.showImperialUnits = function() {
		var scaleBar =  (that.map !== undefined) ?  
			that.map.getComponentById("ScaleBar") : null;
		return (scaleBar != null) ?  
			scaleBar.showImperialUnits : false;
	};
	
	
	// The total journey time taken is defined in seconds.
	// This is a transformation function
	// to alter the units into a more reasonable hours:minutes
	// format.
	
	that.secondsToTime = function (secs)  {
		var hours = Math.floor(secs / (60 * 60));
		var divisor_for_minutes = secs % (60 * 60);
		var minutes = Math.floor(divisor_for_minutes / 60);
		return "" + hours + ":" + minutes;
	}
	
	//
	// The API returns all distances in meters (yards).
	// This should be altered to kilometers (miles) for longer 
	// distances.
	that.calculateDistance = function (distance, metricMeasurements){
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
	
	
	
	that.addBold = function (text){
		var bold = document.createElement('strong');
		bold.appendChild(document.createTextNode(text));
		return bold;
	}
	
	that.addText = function (text){
		var node = document.createElement("span");
		node.innerHTML = text;
		return node;
	}
	
	that.onClick = function(details) {
		return function (){
			var infoBubbles = that.getInfobubbles();
		
			if (infoBubbles !== undefined){
				that.bubble = infoBubbles.openBubble(
					details.innerHTML , details.position);
			}
		};
	}

}


DirectionsRenderer.prototype.attach = function(display) {
	this.map = display;
}

DirectionsRenderer.prototype.detach = function(display) {
	this.map = undefined;
}


DirectionsRenderer.prototype.setRoute = function  (route) {
	if (this.nodeOL !== undefined){
		this.nodeOL.parentNode.removeChild(this.nodeOL);
		if ((this.bubble !== undefined)&& 
			(this.bubble.getState() == "opened" )){
			this.bubble.close();
		}
	}
	this.nodeOL  = document.createElement("ol");

    
	var showImperialUnits = this.showImperialUnits();

	
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
					details.appendChild (document.createTextNode(' '));
					manueverText = this.addText(instructions);
					manueverText.className  ="manuever_instruction";
					details.appendChild (manueverText);
					details.onclick = new this.onClick(details);
					
					this.nodeOL.appendChild(details);
			  }
		}

	}
	this.panel.appendChild(this.nodeOL);
}


