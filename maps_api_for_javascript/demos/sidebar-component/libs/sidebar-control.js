(function (ctx) {

  var styleNode = document.createElement('style'),
    css = '.nm_sidebar{' +
      ' list-style: none' +
      '}' +
      '.nm_sidebar .highlight{' +
      'font-weight: bold;' +
      '}';
  styleNode.type = 'text/css';

  if (styleNode.styleSheet) { // IE
    styleNode.styleSheet.cssText = css;
  } else {
    styleNode.appendChild(ctx.createTextNode(css));
  }

  if (ctx.body) {
    ctx.body.appendChild(styleNode);
  } else if (ctx.addEventListener) {
    ctx.addEventListener('DOMContentLoaded',  function () {
      ctx.body.appendChild(styleNode);
    }, false);
  } else {
    ctx.attachEvent('DOMContentLoaded',  function () {
      ctx.body.appendChild(styleNode);
    });
  }

})(document);


function extend(B, A) {
  function I() {}
  I.prototype = A.prototype;
  B.prototype = new I();
  B.prototype.constructor = B;
}


function Sidebar(panel, options) {
  nokia.maps.map.Container.call(this);
  this.init(panel, options);
}
extend(Sidebar,
    nokia.maps.map.Container);


Sidebar.prototype.init = function (panel, options) {
  var that = this,
    TOUCH = nokia.maps.dom.Page.browser.touch,
    CLICK = TOUCH ? 'tap' : 'click';
  that.set('panel', panel);
  that.options = options;
  that.objects.addObserver(
    function (oList, operation, element, idx) {
      that.outputToPanel(oList, operation, element, idx);
    }
  );

  that.addListener(CLICK,  function (evt) {
    var i;
    if (that.olNode !== undefined) {
      for (i = 0; i < that.olNode.childNodes.length; i += 1) {
        that.olNode.childNodes[i].className =
          (that.olNode.childNodes[i].object === evt.target) ?
              'highlight' : '';
      }
    }
  }, false);

  that.getDefaultTitle = function (object) {
    if (object instanceof nokia.maps.map.Marker) {
      return 'Marker';
    }
    if (object instanceof nokia.maps.map.Polyline) {
      return 'Polyline';
    }
    if (object instanceof nokia.maps.map.Polygon) {
      return 'Polygon';
    }
    if (object instanceof nokia.maps.map.Container) {
      return 'Container';
    }
    return 'Object';
  };

  that.getTitle = function (object) {
    var parts = that.options.title.split('.'),
      curElement = object,
      i = 0;

    while (i < parts.length && curElement !== undefined) {
      curElement = curElement[parts[i]];
      i += 1;
    }
    return curElement;
  };

  that.outputToPanel = function (oList, operation, element, idx) {
    if (!that.olNode) {
      that.olNode = document.createElement('ol');
      that.olNode.className = 'nm_sidebar';
      that.panel.appendChild(that.olNode);
    }

    var liNode =  document.createElement('li'),
      text;
    liNode.object = element;
    liNode.onclick = function () {
      that.dispatch(
        new nokia.maps.dom.Event({type: CLICK, target: this.object})
      );
    };
    text =  (that.options.title !== undefined) ?
        that.getTitle(element) : that.getDefaultTitle(element);
    liNode.innerHTML = (text !== undefined) ? text : that.getDefaultTitle(element);

    if (operation === 'add') {
      if (idx === that.olNode.childNodes.length) {
        that.olNode.appendChild(liNode);
      } else if (idx === 0) {
        if (that.olNode.firstChild) {
          that.olNode.insertBefore(liNode, that.olNode.firstChild);
        } else {
          that.olNode.appendChild(liNode);
        }
      } else {
        that.insertAfter(liNode, that.olNode.childNodes[idx - 1]);
      }
    } else if (operation === 'remove') {
      that.olNode.childNodes[idx].parentNode.removeChild(that.olNode.childNodes[idx]);
    }
    if (that.olNode.childNodes.length === 0) {
      that.olNode.parentNode.removeChild(that.olNode);
      that.olNode = null;
    }
  };

  that.insertAfter = function (newElement, targetElement) {
    var parent = targetElement.parentNode;
    if (parent.lastchild === targetElement) {
      parent.appendChild(newElement);
    } else {
      parent.insertBefore(newElement, targetElement.nextSibling);
    }
  };

  that.getListElement = function (object) {
    var i;
    if (that.olNode) {
      for (i = 0; i < that.olNode.childNodes.length; i += 1) {
        if (that.olNode.childNodes[i].object === object) {
          return that.olNode.childNodes[i];
        }
      }
    }
    return null;
  };
};

