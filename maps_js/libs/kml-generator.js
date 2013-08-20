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

function  KMLGenerator(panel) {
	this.panel = panel;
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

var getMarkerData = function(){
	markers = new Array();

	for (i=0; i< that.map.objects.getLength(); i++) {
		if ( that.map.objects.get(i) instanceof nokia.maps.map.Marker ) {
			 // Retrieve all the Marker data and add it to an array
			 var markerData = new Object();
			 markerData.id = toUnicode("&amp;#",that.map.objects.get(i).$data.id);
			 markerData.latitude = that.map.objects.get(i).coordinate.latitude;
			 markerData.longitude = that.map.objects.get(i).coordinate.longitude;

			 markerData.description =  toUnicode("&#", that.map.objects.get(i).$data.description);    //map.objects.get(i).$data.description.toUnicodeCDATA();
			 markerData.name = toUnicode("&amp;#",that.map.objects.get(i).$data.name);
			 markerData.address = toUnicode("&amp;#",that.map.objects.get(i).$data.address);

			  markerData.styleURL = that.map.objects.get(i).$data.styleURL;

			markers.push(markerData);

		}
	}
}

this.generateKML = function() {

	getMarkerData();	

	// Now output the KML, start with the header.
	 kmlOutput = "<?xml version='1.0' encoding='UTF-8'?><"+"kml xmlns='http://www.opengis.net/kml/2.2'><"+"Document>\n";



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

		if ( markers[i].styleURL === undefined ){
			// Do Nothing if no style URL entered as it is optional
		} else if  ( markers[i].styleURL == ""){
			// Do Nothing if no style URL  entered as it is optional
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

