
function extend(B, A) {
	function I() {}
	I.prototype = A.prototype;
	B.prototype = new I();
	B.prototype.constructor = B;
}


	



function  Sidebar(panel, options) {
	this.panel = panel;
	this.options = options;
	var that = this;
	var olNode;
	
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
		if (olNode !== undefined){
			for (var i = 0; i < olNode.childNodes.length; i++){
				olNode.childNodes[i].className =
					(olNode.childNodes[i].object == evt.target) ?
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
		
		
		if (!olNode){
			olNode = document.createElement("ol");
			olNode.className = "nm_sidebar";
			that.panel.appendChild(olNode);
		}
		
		var liNode =  document.createElement("li"); 
		liNode.object = element;
		liNode.onclick = function() {
			that.dispatch(
				 new nokia.maps.dom.Event(
				 	{type: "click", 
				 	target: this.object}));
		};
		var text =  (that.options.title !== undefined) ?  
			element[that.options.title] : getType(element);
		liNode.innerHTML= (text !== undefined) ? text : getType(element);
		
		if (operation == "add"){
			if (idx == olNode.childNodes.length){
				olNode.appendChild(liNode);
			} else if (idx == 0){
				if(olNode.firstChild) {
					olNode.insertBefore(liNode,pa.firstChild);
				}else{
					 olNode.appendChild(liNode);
				}
			} else {
				insertAfter(liNode, olNode.childNodes[idx-1]);
			}
		} else if (operation == "remove"){
			olNode.childNodes[idx].parentNode.removeChild(olNode.childNodes[idx]);			
		}
		if (olNode.childNodes.length == 0){
			olNode.parentNode.removeChild(olNode);
			olNode = null;
		}
	}
	
	var insertAfter = function (newElement,targetElement) {
		var parent = targetElement.parentNode;
		if(parent.lastchild == targetElement) {
			parent.appendChild(newElement);
		} else {
			parent.insertBefore(newElement, targetElement.nextSibling);
		}
	}
	
	this.getListElement = function(object){
		if (olNode){
			for (var i = 0; i < olNode.childNodes.length; i++){
				if (olNode.childNodes[i].object == object) {
					return olNode.childNodes[i];
				}
			}
		}
		return null;
	}
};

