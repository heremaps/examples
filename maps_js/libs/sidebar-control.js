
function extend(B, A) {
	function I() {}
	I.prototype = A.prototype;
	B.prototype = new I();
	B.prototype.constructor = B;
}


	



function  Sidebar(panel, options) {
	this.panel = panel;
	this.options = options;
	that = this;
	var ulNode;
	
	var styleNode = document.createElement('style');
	styleNode.type = 'text/css';
	var css = '.nm_sidebar{'+			
		' list-style: none'+  	  			  	  
	'}' +
	'.nm_sidebar .highlight{' +
	'font-weight: bold;'+	  	  			  	  
	'}';
	
	if (styleNode.styleSheet) { // IE
		styleNode.styleSheet.cssText = css;
	} else {
		styleNode.appendChild(document.createTextNode(css));
	}
	document.body.appendChild(styleNode);
	
	nokia.maps.map.Container.call(this);
	this.objects.addObserver (
		function(oList, operation, element, idx){
			outputToPanel(oList, operation, element, idx);
		}
	);
	this.addListener("click" ,  function(evt) {
		if (ulNode !== undefined){
			for (var i = 0; i < ulNode.childNodes.length; i++){
				ulNode.childNodes[i].className =
					(ulNode.childNodes[i].object == evt.target) ?
					"highlight":	"";
			}
		}
	}, false);
	
	var getType = function(object){
		if(object instanceof nokia.maps.map.Marker ){
			return "Marker";
		} else if(object instanceof nokia.maps.map.Polyline ){
			return "Polyline";
		} else if(object instanceof nokia.maps.map.Polygon ){
			return "Polygon";
		} else {
			return "Object";
		}
	}
	var outputToPanel = function (oList, operation, element, idx){
		
		
		if (ulNode !== undefined){
			ulNode.parentNode.removeChild(ulNode);
		}
		
		var titleDefined = (that.options.title !== undefined);
		
		ulNode = document.createElement("ul");
		ulNode.className = "nm_sidebar";
		for (var i = 0; i < oList.getLength(); i++){
			var liNode =  document.createElement("li"); 
			liNode.object = oList.get(i);
			liNode.onclick = function() {
				that.dispatch(
					 new nokia.maps.dom.Event(
					 	{type: "click", 
					 	target: this.object}));
			};
			var text =  titleDefined ?  
				oList.get(i)[that.options.title] : getType(oList.get(i));
			var textNode = (text !== undefined)?
				 document.createTextNode(text): document.createTextNode(getType(oList.get(i)));
			liNode.appendChild(textNode);
			ulNode.appendChild(liNode);
		}
		
		
		that.panel.appendChild(ulNode);
	}
};

