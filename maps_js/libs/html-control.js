function extend(B, A) {
	function I() {}
	I.prototype = A.prototype;
	B.prototype = new I();
	B.prototype.constructor = B;
}

HtmlControl = function (myHTML, id) {
	that = this;
	this.id = id
	
	this.getId = function() { return "HtmlControl";
	};	
	this.attach = function(display) {
		var node = document.createElement("div");	
		node.innerHTML = myHTML;
		display.getUIContainer().appendChild(node);
	};
	this.detach = function(display) {
		display.getUIContainer().removeChild(node);
	};
	nokia.maps.map.component.Component.call(this);
};
