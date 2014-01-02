function extend(B, A) {
  function I() {}
  I.prototype = A.prototype;
  B.prototype = new I();
  B.prototype.constructor = B;
}

function Interactive(minZoom, maxZoom, boundingBox) {
  nokia.maps.map.component.Component.call(this);
  this.init(minZoom, maxZoom, boundingBox);
}

extend(Interactive,
  nokia.maps.map.component.Component);

Interactive.prototype.init =  function () {
  var that = this;
  that.changeCursor = function (target, cursor) {
    if (target.$href || target.$click) {
      document.body.style.cursor = cursor;
    }
  };

  that.eventHandlers = {
    onMouseOver : function (evt) {
      that.changeCursor(evt.target, 'pointer');
    },
    onMouseOut : function (evt) {
      that.changeCursor(evt.target, 'default');
    },
    onClick : function (evt) {
      that.changeCursor(evt.target, 'default');
      if (evt.target.$href) {
        window.location = evt.target.$href;
      } else if (evt.target.$click) {
        var onClickDo = new Function (String(evt.target.$click));
        onClickDo();
      }
    }
  };
};

Interactive.prototype.attach = function (map) {
  map.addListener('mouseover', this.eventHandlers.onMouseOver);
  map.addListener('mouseout', this.eventHandlers.onMouseOut);
  var TOUCH = nokia.maps.dom.Page.browser.touch,
    CLICK = TOUCH ? 'tap' : 'click';
  map.addListener(CLICK, this.eventHandlers.onClick);
};

Interactive.prototype.detach = function (map){
  map.removeListener('mouseover', this.eventHandlers.onMouseOver);
  map.removeListener('mouseout', this.eventHandlers.onMouseOut);
  var TOUCH = nokia.maps.dom.Page.browser.touch,
    CLICK = TOUCH ? 'tap' : 'click';
  map.removeListener(CLICK, this.eventHandlers.onClick);
};

Interactive.prototype.getId = function () {
  return 'Interactive';
};
Interactive.prototype.getVersion = function (){
  return '1.0.0';
}; 