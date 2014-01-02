if (typeof String.prototype.trim !== 'function') {
  String.prototype.trim = function () {
    return this.replace(/^\s+|\s+$/g, '');
  };
}

(function (ctx) {
  // ensure CSS is injected
  var directionsStyleNode = ctx.createElement('style'),
    css = '.manuever_instruction{' +
      ' line-height: 130%; ' +
      ' font-size: 11px; ' +
      ' font-family: "Lucida Grande",' +
      '"Lucida Sans Unicode",Arial,Helvetica,sans-serif; ' +
      '}' +
      '.manuever_instruction .heading, ' +
      '.manuever_instruction .length, ' +
      '.manuever_instruction .direction{' +
      ' font-weight: bold; ' +
      '}';
  directionsStyleNode.type = 'text/css';

  if (directionsStyleNode.styleSheet) { // IE
    directionsStyleNode.styleSheet.cssText = css;
  } else {
    directionsStyleNode.appendChild(ctx.createTextNode(css));
  }
  if (ctx.body) {
    ctx.body.appendChild(directionsStyleNode);
  } else if (ctx.addEventListener) {
    ctx.addEventListener('DOMContentLoaded',  function () {
      ctx.body.appendChild(directionsStyleNode);
    }, false);
  } else {
    ctx.attachEvent('DOMContentLoaded',  function () {
      ctx.body.appendChild(directionsStyleNode);
    });
  }

})(document);



function extend(B, A) {
  function I() {}
  I.prototype = A.prototype;
  B.prototype = new I();
  B.prototype.constructor = B;
}


function DirectionsRenderer(panel, route, showImperialUnits) {
  nokia.maps.map.component.Component.call(this);
  this.init(panel, route, showImperialUnits);
}
extend(DirectionsRenderer,
    nokia.maps.map.component.Component);


DirectionsRenderer.prototype.init = function (panel, route, showImperialUnits) {
  var that = this,
    // The total journey time taken is defined in seconds.
    // This is a transformation function
    // to alter the units into a more reasonable hours:minutes
    // format.
    secondsToTime = function (secs) {

      var hours   = Math.floor(secs / 3600),
        minutes = Math.floor((secs - (hours * 3600)) / 60),
        seconds = secs - (hours * 3600) - (minutes * 60),
        time;

      if (hours   < 10) {
        hours   = '0' + hours;
      }
      if (minutes < 10) {
        minutes = '0' + minutes;
      }
      if (seconds < 10) {
        seconds = '0' + seconds;
      }
      time    = hours + ':' + minutes + ':' + seconds;
      return time;
    },

  //
  // The API returns all distances in meters (yards).
  // This should be altered to kilometers (miles) for longer
  // distances.
    calculateDistance = function (distance, imperial) {
      if (imperial) {
        return (distance < 800) ?
            String(Math.floor(distance / 1.0936) + ' yards')
          : String(Math.floor(distance / 160.934) / 10 + ' miles');
      }
      return (distance < 1000) ?
          String(distance + ' m.')
        : String(Math.floor(distance / 100) / 10 + ' km.');
    },

    addText = function (text) {
      var node = document.createElement('span');
      node.innerHTML = text;
      return node;
    };

  that.set('panel', panel);
  that.set('route', route);
  that.set('showImperialUnits', showImperialUnits !== undefined ? showImperialUnits : false);


  that.getInfobubbles = function () {
    return (that.map !== undefined) ?
        that.map.getComponentById('InfoBubbles') : undefined;
  };

  that.onClick = function (details) {
    return function () {
      var infoBubbles = that.getInfobubbles();

      if (infoBubbles !== undefined) {
        that.bubble = infoBubbles.openBubble(
          details.innerHTML,
          details.position
        );
      }
    };
  };

  that.update = function () {
    if (that.nodeOL !== undefined) {
      that.nodeOL.parentNode.removeChild(that.nodeOL);
      if ((that.bubble !== undefined) &&
          (that.bubble.getState() === 'opened')) {
        that.bubble.close();
      }
    }

    var currentRoute = that.get('route'),
      isImperial = that.get('showImperialUnits'),
      maneuver,
      details,
      instructions,
      imperialText,
      manueverText,
      distNode,
      span,
      ls,
      ln,
      i,
      j,
      n;

    if (currentRoute === undefined) {
      return;
    }

    that.nodeOL = document.createElement('ol');
    that.nodeOL.className = 'directions';

    for (i = 0;  i < currentRoute.legs.length; i += 1) {
      for (j = 0;  j < currentRoute.legs[i].maneuvers.length; j += 1) {
        // Get the next maneuver.
        maneuver = currentRoute.legs[i].maneuvers[j];
        details = document.createElement('li');
        instructions = maneuver.instruction;

        // For imperial measurements, extract the
        // distance span

        if (isImperial) {
          ls = instructions.indexOf('<span class="length">');
          ln = instructions.indexOf('</span>', ls);
          if (ls > -1 && ln > -1) {
            distNode = instructions.substring(ls + 21, ln);
            n = distNode.split(' ');
            if (n[1] === 'meters') {
              imperialText = calculateDistance(n[0], true);
            } else {
              imperialText = calculateDistance(n[0] * 1000, true);
            }
            instructions = instructions.substring(0, ls + 21)
              + imperialText + instructions.substring(ln);
          }
        }

        if (instructions.trim() !== '') {
          // Finally add the instruction
          // to the list along with a link back to
          // infobubble.
          details.position = maneuver.position;
          span = document.createElement('span');
          span.className = 'arrow '  + maneuver.action;
          details.appendChild(span);
          manueverText = addText(instructions);
          manueverText.className  = 'manuever_instruction';
          details.appendChild(manueverText);
          details.onclick = new that.onClick(details);

          that.nodeOL.appendChild(details);
        }
      }
    }
    that.panel.appendChild(that.nodeOL);
    that.baseTime = secondsToTime(currentRoute.summary.baseTime);
    that.distance = calculateDistance(currentRoute.summary.distance, showImperialUnits);
  };


  that.addObserver('route', that.update);
  that.addObserver('panel', that.update);
  that.addObserver('showImperialUnits', that.update);
};


DirectionsRenderer.prototype.attach = function (display) {
  this.map = display;
};

DirectionsRenderer.prototype.detach = function (display) {
  this.map = undefined;
};



