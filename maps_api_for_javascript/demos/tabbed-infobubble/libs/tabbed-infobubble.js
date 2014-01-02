function extend(B, A) {
  function I() {}
  I.prototype = A.prototype;
  B.prototype = new I();
  B.prototype.constructor = B;
}

if (!document.getElementsByClassName) {
  document.getElementsByClassName = function (class_name) {
    var docList = this.all || this.getElementsByTagName('*'),
      matchArray = [],
      // Create a regular expression object for class
      re = new RegExp('(?:^|\\s)' + class_name + '(?:\\s|$)'),
      i;

    for (i = 0; i < docList.length; i += 1) {
      if (re.test(docList[i].className)) {
        matchArray[matchArray.length] = docList[i];
      }
    }
    return matchArray;
  };
}


function TabbedInfoBubbles(backgroundColor, color, tabColor) {
  nokia.maps.map.component.InfoBubbles.call(this);
  this.init(backgroundColor, color, tabColor);
}

extend(TabbedInfoBubbles,
    nokia.maps.map.component.InfoBubbles);

TabbedInfoBubbles.prototype.init = function (backgroundColor, color, tabColor) {

  var that = this,
    tabbedStyleNode = document.createElement('style'),
    css;

  if (color === undefined) {
    color = 'white';
  }
  if (backgroundColor === undefined) {
    backgroundColor = 'rgb(0, 15, 26)';
  }
  if (tabColor === undefined) {
    tabColor = 'silver';
  }

  tabbedStyleNode.type = 'text/css';
  css = 'ul.nm_tabnav {' +
    ' position: relative;' +
    ' top: -39px;' +
    ' color:' + color + ';' +
    ' text-align: left;' +
    ' margin: 0px -1em 1em 0px;' +
    ' list-style-type: none;' +
    ' padding: 3px 10px 0.1em 10px;' +
    ' font-size:small;' +
    '}' +
    'ul.nm_tabnav li {' +
    ' display: inline;' +
    ' background: ' + backgroundColor + ';' +
    ' border: 0.1em solid black;' +
    ' position: relative;' +
    ' top: 1px;' +
    ' padding: 3px 1em;' +
    ' color:' + tabColor + ';' +
    '}' +
    ' ul.nm_tabnav li.nm_tab_current {' +
    ' border-bottom: 0.3em solid ' + backgroundColor + ';' +
    ' font-weight:bold;' +
    ' color:' + color + ';' +
    '}' +
    '.nm_bubble_content > div{' +
    ' display: block;' +
    '}' +
    '.nm_bubble_content > div + div{' +
    ' display: none;' +
    ' }';

  if (tabbedStyleNode.styleSheet) { // IE
    tabbedStyleNode.styleSheet.cssText = css;
  } else {
    tabbedStyleNode.appendChild(document.createTextNode(css));
  }
  document.body.appendChild(tabbedStyleNode);

  that.clickFunction =  function (evt) {
    if (evt.target.className === 'nm_tab') {
      var offset = 0,
        tabs = evt.target.parentNode.children,
        tabContent = this.children,
        i,
        len = tabs.length;

      while (offset < tabContent.length) {
        if (tabContent[offset].nodeName === 'DIV') {
          break;
        }
        offset += 1;
      }
      // Loop through all the LI elements and set the clicked on to current,
      // At the same time ensure only the nth DIV associated with the Nth Tab
      // is visible - all other are set to display:none.
      for (i = 0; i < len; i += 1) {
        if (tabs[i] === evt.target) {
          tabs[i].className = 'nm_tab_current';
          tabContent[i + offset].style.display = 'block';
        } else {
          tabs[i].className = 'nm_tab';
          tabContent[i + offset].style.display = 'none';
        }
      }
    }
  };

  that.wireUp = function (index) {
    var EventTarget = nokia.maps.dom.EventTarget,
    // This element will only exist once the map has been displayed.
      infoBubbleDisplay = document.getElementsByClassName('nm_bubble_content')[index],
      TOUCH = nokia.maps.dom.Page.browser.touch,
      CLICK = TOUCH ? 'tap' : 'click';

    // Attach EventTarget interface to the document.
    EventTarget(infoBubbleDisplay);
    // Add a listener for the click event to the node and show an alert if clicked.
    infoBubbleDisplay.addListener(CLICK, that.clickFunction, false);
  };

  that.tabbedContent = function (tabs, content, title) {
    var myHTMLcontent = '<ul class=\'nm_tabnav\'>',
      i;
    for (i = 0; i < tabs.length; i += 1) {
      if (i === 0) {
        myHTMLcontent = myHTMLcontent + '<li class=\'nm_tab_current\'>' + tabs[i] + '</li>';
      } else {
        myHTMLcontent = myHTMLcontent + '<li class=\'nm_tab\'>' + tabs[i] + '</li>';
      }
    }
    myHTMLcontent = myHTMLcontent + '</ul>' + title;
    for (i = 0; i < content.length; i += 1) {
      if (i === 0) {
        myHTMLcontent = myHTMLcontent + '<div>' + content[i] + '</div>';
      } else {
        myHTMLcontent = myHTMLcontent + '<div>' + content[i] + '</div>';
      }
    }
    return myHTMLcontent;
  };
};

TabbedInfoBubbles.prototype.addTabbedBubble = function (tabs, content, title, coordinate) {
  this.openBubble(this.tabbedContent(tabs, content, title), coordinate);
};

TabbedInfoBubbles.prototype.openBubble = function (content, coordinate) {
  nokia.maps.map.component.InfoBubbles.prototype.openBubble.call(this, content, coordinate);
  var i = document.getElementsByClassName('nm_bubble_content').length;
  while (i > 0) {
    i -= 1;
    this.wireUp(i);
 }
};






