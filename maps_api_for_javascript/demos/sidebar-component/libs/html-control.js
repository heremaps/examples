function extend(B, A) {
  function I() {}
  I.prototype = A.prototype;
  B.prototype = new I();
  B.prototype.constructor = B;
}

function HtmlControl(html, id) {
  nokia.maps.map.component.Component.call(this);
  this.init(html, id);
}

extend(HtmlControl,
    nokia.maps.map.component.Component);


HtmlControl.prototype.init = function (html, id) {
  var that = this;
  that.id = id;
  that.set('node', document.createElement('div'));
  that.node.innerHTML = html;
};

HtmlControl.prototype.getId = function () {
  return 'HtmlControl.' + this.id;
};

HtmlControl.prototype.attach = function (map) {
  map.getUIContainer().appendChild(this.node);
};

HtmlControl.prototype.detach = function (map) {
  map.getUIContainer().removeChild(this.node);
};
