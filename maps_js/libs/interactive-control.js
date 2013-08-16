function extend(B, A) {
	function I() {}
	I.prototype = A.prototype;
	B.prototype = new I();
	B.prototype.constructor = B;
}

function Interactive() {
//
// If the object has a click or an href,
// change the cursor to give visual feedback.
//
function changeCursor(target, cursor){
	if ((( target.$href === undefined) == false) ||  
	   (( target.$click === undefined) == false)){
		document.body.style.cursor = cursor;	 
  }
}

var onMouseOver = function(evt) {
	  changeCursor(evt.target, 'pointer');
};

var onMouseOut = function(evt) {
	changeCursor(evt.target, 'default');
};
var onClick = function(evt) {
	changeCursor(evt.target, 'default');

	if (( evt.target.$href === undefined) == false){
		  window.location = evt.target.$href; 
	}  else if (( evt.target.$click === undefined) == false){
  		var onClickDo = new Function(evt.target.$click);
			onClickDo(); 
  }
};;

/////////////////////////////////////////////////////////////////////////
//
//   Now wire up the events by adding a single listener to the map.
//
//
this.attach = function (mapDisplay) {
		
		// If the marker has a click or an href change the cursor as well
		// to give more visual feedback.  
		//
		mapDisplay.addListener("mouseover", onMouseOver);
		//
		// Return the cursor to normal if the marker which has a click or an href
		// loses focus.
		//
		mapDisplay.addListener("mouseout", onMouseOut);
		//
		// On click we want to forward or do the "onclick" functiion
		//
		mapDisplay.addListener("click", onClick);
 
};

this.detach = function(mapDisplay){
	 mapDisplay.removeListener("mouseover", onMouseOver);
   mapDisplay.removeListener("mouseout", onMouseOut);
   mapDisplay.removeListener("click", onClick);
	
};

this.getId = function () {
	return 'Interactive';
};
this.getVersion = function(){
		return '1.0.0';
}; 

};