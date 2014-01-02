

(function (ctx) {
  // ensure CSS is injected
  var tooltipStyleNode = ctx.createElement('style'),
    css = '#nm_tooltip{' +
      ' color:white;' +
      ' background:black;' +
      ' border: 1px solid grey;' +
      ' padding-left: 1em; ' +
      ' padding-right: 1em; ' +
      ' display: none;  ' +
      ' min-width: 120px;  ' +
      '}';

  tooltipStyleNode.type = 'text/css';
  if (tooltipStyleNode.styleSheet) { // IE
    tooltipStyleNode.styleSheet.cssText = css;
  } else {
    tooltipStyleNode.appendChild(ctx.createTextNode(css));
  }
  if (ctx.body) {
    ctx.body.appendChild(tooltipStyleNode);
  } else if (ctx.addEventListener) {
    ctx.addEventListener('DOMContentLoaded',  function () {
      ctx.body.appendChild(tooltipStyleNode);
    }, false);
  } else {
    ctx.attachEvent('DOMContentLoaded',  function () {
      ctx.body.appendChild(tooltipStyleNode);
    });
  }
})(document);


function extend(B, A) {
  function I() {}
  I.prototype = A.prototype;
  B.prototype = new I();
  B.prototype.constructor = B;
}

function Tooltip() {
  nokia.maps.map.component.Component.call(this);
  this.init();
}
extend(Tooltip,
    nokia.maps.map.component.Component);


Tooltip.prototype.init = function () {
  var that = this;
  that.tooltip  = document.createElement('div');
  that.tooltip.id = 'nm_tooltip';
  that.tooltip.style.position = 'absolute';

  that.eventHandlers =  {
    showTooltip : function (evt) {
      if (evt.target.title) {
        that.tooltip.innerHTML =  evt.target.title;
        that.tooltip.style.display = 'block';
        var point = that.map.geoToPixel(evt.target.getBoundingBox().getCenter()),
          left = point.x - (that.tooltip.offsetWidth / 2),
          top = point.y + 1; // Slight offset to avoid flicker.

        that.tooltip.style.left = left + 'px';
        that.tooltip.style.top = top + 'px';
      }
    },
    hideTooltip : function (evt) {
      if (evt.target.title) {
        that.tooltip.style.display = 'none';
      }
    },
    dragTooltip : function (evt) {
      if (that.tooltip.style.display === 'block') {
        that.map.dispatch(
          new nokia.maps.dom.Event({
            type: 'mouseover',
            target: that.map.getObjectAt(evt.displayX, evt.displayY)
          })
        );
      }
    }
  };
};

Tooltip.prototype.attach = function (map) {
  this.map = map;

  var TOUCH = nokia.maps.dom.Page.browser.touch,
    CLICK = TOUCH ? 'tap' : 'click';

  map.getUIContainer().appendChild(this.tooltip);
  map.addListener('mouseover', this.eventHandlers.showTooltip);
  map.addListener('mouseout', this.eventHandlers.hideTooltip);
  map.addListener(CLICK, this.eventHandlers.hideTooltip);
  map.addListener('drag', this.eventHandlers.dragTooltip);

};

Tooltip.prototype.detach = function (map) {
  var TOUCH = nokia.maps.dom.Page.browser.touch,
    CLICK = TOUCH ? 'tap' : 'click';
  this.tooltip.parentNode.removeChild(this.tooltip);
  map.removeListener('mouseover', this.eventHandlers.showTooltip);
  map.removeListener('mouseout', this.eventHandlers.hideTooltip);
  map.removeListener(CLICK, this.eventHandlers.hideTooltip);
  map.removeListener('drag', this.eventHandlers.dragTooltip);
  this.map = null;
};

Tooltip.prototype.getId = function () {
  return 'Tooltip';
};

Tooltip.prototype.getVersion = function () {
  return '1.0.0';
};


