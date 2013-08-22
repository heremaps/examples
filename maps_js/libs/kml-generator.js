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

function  KMLGenerator(panel, options) {
	this.panel = panel;
	this.options = options;
	that = this;

var toUnicode = function  (prefix, input){
		var output = "";

		var splitInput = input.split("");
		for (var i = 0; i < splitInput.length; i++){
				var currentChar = splitInput[i];
				// Encode any extended character plus &
				if (currentChar.charCodeAt()> 128 ||  currentChar.charCodeAt()== 38  || currentChar.charCodeAt()== 39 ) {
						output = output +  prefix + currentChar.charCodeAt() + ";";
				} else {
						output = output + currentChar;
				}
		}

		return output;
};

var getMarkerData = function(objects){
	

	for (i=0; i< objects.getLength(); i++) {
		if ( objects.get(i) instanceof nokia.maps.map.Marker ) {
			// Retrieve all the Marker data and add it to an array
			var markerData = new Object();
			var dataSource = (that.options.datasource !== undefined) ?
				objects.get(i)[that.options.datasource] : objects.get(i);
			if (that.options.id !== undefined){
				markerData.id = toUnicode("&amp;#",
					dataSource[that.options.id]);
			}
			markerData.latitude = objects.get(i).coordinate.latitude;
			markerData.longitude = objects.get(i).coordinate.longitude;
			if (that.options.description !== undefined){
				markerData.description =  toUnicode("&#", 
					dataSource[that.options.description]);    //map.objects.get(i).$data.description.toUnicodeCDATA();
			}
			if (that.options.name !== undefined){
				markerData.name = toUnicode("&amp;#",
				dataSource[that.options.name]);
			}
			if (that.options.address !== undefined){
				markerData.address = toUnicode("&amp;#",
					dataSource[that.options.address]);
			}
			if (that.options.styleURL !== undefined){
				markerData.styleURL = dataSource[that.options.styleURL];
			} else {
				if (dataSource.icon  !== undefined && dataSource.icon.src  !== undefined ){
					markerData.href = dataSource.icon.src;
				} else if (dataSource.brush !== undefined) {
			 		markerData.color = dataSource.brush.color;
				}
			}
			markers.push(markerData);

		} else if ( objects.get(i) instanceof nokia.maps.map.Container ) {
			getMarkerData(objects.get(i).objects);
		}
	}
}

this.generateKML = function() {

	markers = new Array();
	getMarkerData(that.map.objects);	

	// Now output the KML, start with the header.
	 kmlOutput = "<?xml version='1.0' encoding='UTF-8'?><"+"kml xmlns='http://www.opengis.net/kml/2.2'><"+"Document>\n";

	if (that.options.defaultStyles !== undefined){
		kmlOutput = kmlOutput + that.options.defaultStyles;
	}

	// Loop nthrough the markers and add Point Placemarks
	for (i=0; i< markers.length; i ++){

		if ( markers[i].id === undefined ){
				kmlOutput = kmlOutput + "<"+"Placemark>\n";
		} else if  ( markers[i].id == ""){
				kmlOutput = kmlOutput + "<"+"Placemark>\n";
		} else {
			  kmlOutput = kmlOutput + "<"+"Placemark id=\"" +
				 markers[i].id +"\">\n";
		}

		if ( markers[i].name === undefined ){
			// Do Nothing  if no name entered as it is optional
		} else if  ( markers[i].name == ""){
		   // Do Nothing if no name entered as it is optional
		} else {
				kmlOutput = kmlOutput + "   <"+"name>" +  markers[i].name +"<\/name>\n";
		}

		if ( markers[i].description === undefined ){
			// Do Nothing if no description entered as it is optional
		} else if  ( markers[i].description == ""){
			kmlOutput = kmlOutput + "   <"+"description/>\n";
		} else {
			kmlOutput = kmlOutput + "   <"+"description><![CDATA[" +  markers[i].description +"]]><\/description>\n";
		}

		if ( markers[i].address === undefined ){
			// Do Nothing if no address entered as it is optional
		} else if  ( markers[i].address == ""){
		   // Do Nothing if no address entered as it is optional
		} else {
		   kmlOutput = kmlOutput + "   <"+"address>" +  markers[i].address +"<\/address>\n";
		}

		kmlOutput = kmlOutput + "    <"+"Point><"+"coordinates>"  + markers[i].longitude + "," + markers[i].latitude + ",0<\/coordinates><\/Point>\n";

		if ( markers[i].styleURL === undefined ||  markers[i].styleURL == ""){
			if ( markers[i].href === undefined ){
				kmlOutput = kmlOutput + "    <styleUrl>" +  markers[i].color + "</styleUrl>\n";						
			}  else {	
				kmlOutput = kmlOutput + "    <Style><IconStyle><Icon>";
				kmlOutput = kmlOutput + "<href>" +  markers[i].href + "</href>";
				kmlOutput = kmlOutput + "	</Icon></IconStyle></Style>\n";
			}
		} else {
			kmlOutput = kmlOutput + "    <"+"styleUrl>#" + markers[i].styleURL +"<\/styleUrl>\n";
		}

		kmlOutput = kmlOutput + "<\/Placemark>\n\n";
	}

	// Close the < document> element to ensure the KML is well formed.
	kmlOutput = kmlOutput + "<\/Document><\/kml>";
	outputToPanel(kmlOutput)
  }
  
var outputToPanel = function (text){
	textNode = document.createTextNode(text);
	var preNode = document.createElement("pre");
	var spanNode =  document.createElement("span"); 
	var codeNode =  document.createElement("code");

	codeNode.appendChild(textNode);
	spanNode.appendChild(codeNode);
	preNode.appendChild(spanNode)
	
	that.panel.appendChild(preNode);
}


this.attach = function(display) {
	this.map = display;
}
this.detach = function(display) {
	this.map = undefined;
}


};

