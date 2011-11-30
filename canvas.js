"use strict";
/*global alert,
         CanvasPainter,
         ColorWidget,
         document,
         DragObject,
         LineWidthWidget,
         prompt
 */

/*
   TODO list
   =========

 * If you just click and release (no drag) nothing gets drawn. Fix that.
 * Color picker.
 * Prettier design. Anyone wants to help? =)

 */
var mozDevDerby = {
        host: 'http://tooxie.github.com/js-vandalism/vandalism/'
    },
    body = document.body,
    head = document.head;

mozDevDerby.loadExternals = function () {
    var canvas = document.createElement('canvas'),
        canvasInterface = document.createElement('canvas'),
        styles = document.createElement('link');

    // stylesheet
    styles.rel = 'stylesheet';
    styles.href = mozDevDerby.host + 'styles.css';
    styles.media = 'screen';
    head.appendChild(styles);

    // canvas
    canvas.id = 'mddcanvas';
    canvas.style.height = body.parentNode.scrollHeight + 'px';
    canvas.style.width = body.parentNode.scrollWidth + 'px';
    // The use of the setAttribute method is mandatory for the CanvasPainter
    // widget constructor to work.
    canvas.setAttribute('height', body.parentNode.scrollHeight);
    canvas.setAttribute('width', body.parentNode.scrollWidth);
    canvas.style.position = 'absolute';
    canvas.style.top = 0;
    canvas.style.left = 0;
    canvas.style.zIndex = 1001;
    body.appendChild(canvas);

    // canvasInterface
    canvasInterface.id = 'mddcanvasInterface';
    canvasInterface.style.height = body.parentNode.scrollHeight + 'px';
    canvasInterface.style.width = body.parentNode.scrollWidth + 'px';
    // If size not set like this the contents of the canvas gets stretched
    // and it's proportions not kept.
    canvasInterface.setAttribute('height', body.parentNode.scrollHeight);
    canvasInterface.setAttribute('width', body.parentNode.scrollWidth);
    canvasInterface.style.position = 'absolute';
    canvasInterface.style.top = 0;
    canvasInterface.style.left = 0;
    canvasInterface.style.zIndex = 1001;
    body.appendChild(canvasInterface);
};

mozDevDerby.injectHTML = function () {
    // HTML
    var body = document.body,
        html = '<div class="mdddragme mddtoolbar" style="left: 15px; top: 15px;">' +
               '    <div class="mdddragginghandler">' +
               '        <span class="mddsocket"></span>' +
               '    </div>' +
               '    <ul id="mddcontrols">' +
               '        <li id="mddbtn_0" class="mddctr_btn mddselected">Circular brush</li>' +
               '        <li id="mddbtn_1" class="mddctr_btn">Linear brush</li>' +
               '        <li id="mddbtn_2" class="mddctr_btn">Line</li>' +
               '        <li id="mddbtn_3" class="mddctr_btn">Rectangle</li>' +
               '        <li id="mddbtn_4" class="mddctr_btn">Circle</li>' +
               '        <li id="mddbtn_text" class="mddctr_btn mddlast">Text</li>' +

               '        <li id="mddbtn_undo" class="mddctr_btn mdddisbled mddnotselectable">Undo</li>' +
               '        <li id="mddbtn_redo" class="mddctr_btn mdddisbled mddnotselectable">Redo</li>' +
               '        <li id="mddbtn_clear" class="mddctr_btn mddnotselectable">Clear</li>' +
               '        <li id="mddbtn_about" class="mddctr_btn mddnotselectable">About</li>' +
               '    </ul>' +
               '</div>' +
               '<div class="mdddragme mddchoosers" style="left: 145px; top: 15px;">' +
               '    <div class="mdddragginghandler">' +
               '        <span class="mddsocket"></span>' +
               '    </div>' +
               '    <div id="mddchooserWidgets">' +
               '        <canvas id="mddcolorChooser" width="275" height="80"></canvas>' +
               '        <canvas id="mddlineWidthChooser" width="275" height="76"></canvas>' +
               '    </div>' +
               '</div>';
    body.innerHTML += html;
};

// scripts
mozDevDerby.loadedScriptIndex = 0;
mozDevDerby.scripts = ['cp_depends.js', 'CanvasWidget.js', 'CanvasPainter.js', 'CPWidgets.js', 'CPDrawing.js', 'drag.js'];
mozDevDerby.loadScript = function () {
    if (mozDevDerby.loadedScriptIndex === mozDevDerby.scripts.length) {
        return mozDevDerby.init();
    }
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.onload = mozDevDerby.loadScript;
    script.src = mozDevDerby.host + mozDevDerby.scripts[mozDevDerby.loadedScriptIndex];
    head.appendChild(script);
    mozDevDerby.loadedScriptIndex += 1;
};

// Init
mozDevDerby.init = function () {
    var draggables = null,
        menu = document.getElementById('mddcontrols'),
        text = null,
        TEXT_INDEX = 5,
        x = 0;

    mozDevDerby.canvasPainter = new CanvasPainter('mddcanvas', 'mddcanvasInterface');

    //init widgets
    mozDevDerby.colorWidget = new ColorWidget('mddcolorChooser');
    mozDevDerby.colorWidget.addWidgetListener(function () {
        mozDevDerby.canvasPainter.setColor(mozDevDerby.colorWidget.colorString);
    });

    mozDevDerby.lineWidthWidget = new LineWidthWidget('mddlineWidthChooser', 10);
    mozDevDerby.canvasPainter.setLineWidth(10);
    mozDevDerby.lineWidthWidget.addWidgetListener(function () {
        mozDevDerby.canvasPainter.setLineWidth(mozDevDerby.lineWidthWidget.lineWidth);
    });

    for (x = 0; x < menu.children.length; x += 1) {
        // There are some buttons that don't get the 'selected' class when
        // clicked. The ignore flag is used to know if the current element is
        // one of those or not.
        menu.children[x].addEventListener('click', function () {
            var ignore = false,
                re = new RegExp("(^|\\s)mddselected(\\s|$)"),
                reSelect = new RegExp("(^|\\s)mddnotselectable(\\s|$)"),
                node = null,
                y = 0;

            if (reSelect.test(this.className)) {
                ignore = true;
            }

            for (y = 0; y < menu.children.length; y += 1) {
                node = menu.children[y];

                if (!ignore) {
                    // Remove 'selected' class from every element.
                    node.className = node.className.replace(re, '');
                }

                if (node === this && node.id !== 'mddbtn_about') {
                    // Activate tool.
                    mozDevDerby.setCPDrawAction(y);
                }
            }

            if (!ignore) {
                // Set 'selected' class for the clicked element.
                this.className += ' mddselected';
            }
        });
    }

    text = document.getElementById('mddbtn_text');
    text.addEventListener('click', function () {
        mozDevDerby.setCPDrawAction(TEXT_INDEX, prompt('Text to write', ''));
    });

    // DragObject(element, attachElement, lowerBound, upperBound, startCallback, moveCallback, endCallback, attachLater)
    draggables = document.getElementsByClassName('mdddragme');
    for (x = 0; x < draggables.length; x += 1) {
        new DragObject(draggables[x], draggables[x].children[0]);
    }

    // About
    document.getElementById('mddbtn_about').addEventListener('click', function () {
        alert("Made by Alvaro Mouri&ntilde;o for the canvas' Mozilla Dev Derby.\nBased on Rafael Robayna's 'Canvas Painter' application and switchonthecode.com's 'Draggable Elements' tutorial.");
    }, false);
};

mozDevDerby.setCPDrawAction = function (action, input) {
    if (input) {
        mozDevDerby.canvasPainter.textToWrite = input;
    }
    mozDevDerby.canvasPainter.setDrawAction(action);
};

if (document.getElementById('mddcanvas')) {
    var toolbars = document.getElementsByClassName('mdddragme'),
        x = null;
    for (x = 0; x < toolbars.length; x += 1) {
        // When the element is visibile visibility can be '' or 'visible'.
        if (toolbars[x].style.visibility === "hidden") {
            toolbars[x].style.visibility = "visible";
        } else {
            toolbars[x].style.visibility = "hidden";
        }
    }
} else {
    mozDevDerby.loadExternals();
    mozDevDerby.injectHTML();
    mozDevDerby.loadScript();
}
// :wq
