"use strict";
/*global CanvasWidget */

/*
    Copyright (c) 2005, 2006 Rafael Robayna

    Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

    Additional Contributions by: Morris Johns
*/

/*
    todo:
    need to fix the error with drawing the function
    need to write tutorial for using CanvasWidget

    CanvasWidget is a base class that handles all event listening and triggering.  A person who wishes to write
    a widget for Canvas can easily extend CanvasWidget and the few simple methods deling with drawing the widget.

    Handles checking for the canvas element and the initalization of mouse event listeners.
    to use, the drawWidget and widgetActionPerformed functions need to be extended.
*/

var ColorWidget = CanvasWidget.extend({
    color_red: 0,
    color_green: 0,
    color_blue: 0,
    color_alpha: 1,
    colorString: "",
    constructor: function (canvasName, position) {
        this.inherit(canvasName, position);
    },

    drawWidget: function () {
        var alphaPosition,
            linGradRed,
            linGradGreen,
            linGradBlue,
            linGradAlpha;

        this.context.clearRect(0, 0, 255, 120);
        linGradRed = this.context.createLinearGradient(0, 0, 255, 0);
        linGradRed.addColorStop(0, 'rgba(0, ' + this.color_green + ', ' + this.color_blue + ', 1)');
        linGradRed.addColorStop(1, 'rgba(255,' + this.color_green + ',' + this.color_blue + ', 1)');

        linGradGreen = this.context.createLinearGradient(0, 0, 255, 0);
        linGradGreen.addColorStop(0, 'rgba(' + this.color_red + ', 0,' + this.color_blue + ', 1)');
        linGradGreen.addColorStop(1, 'rgba(' + this.color_red + ', 255,' + this.color_blue + ', 1)');

        linGradBlue = this.context.createLinearGradient(0, 0, 255, 0);
        linGradBlue.addColorStop(0, 'rgba(' + this.color_red + ',' + this.color_green + ', 0, 1)');
        linGradBlue.addColorStop(1, 'rgba(' + this.color_red + ',' + this.color_green + ', 255, 1)');

        linGradAlpha = this.context.createLinearGradient(0, 0, 255, 0);
        linGradAlpha.addColorStop(0, 'rgba(' + this.color_red + ',' + this.color_green + ',' + this.color_blue + ', 1)');
        linGradAlpha.addColorStop(1, 'rgba(' + this.color_red + ',' + this.color_green + ',' + this.color_blue + ', 0)');

        this.context.fillStyle = linGradRed;
        this.context.fillRect(0, 0, 255, 20);
        this.drawColorWidgetPointer(this.color_red, 20, this.context);

        this.context.fillStyle = linGradGreen;
        this.context.fillRect(0, 20, 255, 20);
        this.drawColorWidgetPointer(this.color_green, 40, this.context);

        this.context.fillStyle = linGradBlue;
        this.context.fillRect(0, 40, 255, 20);
        this.drawColorWidgetPointer(this.color_blue, 60, this.context);

        this.context.fillStyle = linGradAlpha;
        this.context.fillRect(0, 60, 255, 20);
        alphaPosition = Math.floor((1 - this.color_alpha) * 255);
        this.drawColorWidgetPointer(alphaPosition, 80, this.context);

        this.context.fillStyle = "black";
        this.context.fillRect(255, 0, 275, 40);

        this.context.fillStyle = "white";
        this.context.fillRect(255, 40, 275, 40);
    },

    drawColorWidgetPointer: function (xPos, yPos) {
        this.context.fillStyle = "white";
        this.context.beginPath();
        this.context.moveTo(xPos - 6, yPos);
        this.context.lineTo(xPos, yPos - 5);
        this.context.lineTo(xPos + 6, yPos);
        this.context.fill();

        this.context.strokeWidth = 1;
        this.context.fillStyle = "black";

        this.context.beginPath();
        this.context.arc(xPos, yPos - 7.5, 2.5, 0, Math.PI * 2, true);
        this.context.fill();
        this.context.closePath();
    },

    checkWidgetEvent: function (e) {
        var mousePos = this.getCanvasMousePos(e);

        if (mousePos.x > 255) {
            if (mousePos.y > 0 && mousePos.y <= 40) {
                this.color_red = 0;
                this.color_green = 0;
                this.color_blue = 0;
            } else {
                this.color_red = 255;
                this.color_green = 255;
                this.color_blue = 255;
            }
        } else {
            if (mousePos.y > 0 && mousePos.y <= 20) {
                this.color_red = mousePos.x;
            } else if (mousePos.y > 20 && mousePos.y <= 40) {
                this.color_green = mousePos.x;
            } else if (mousePos.y > 40 && mousePos.y <= 60) {
                this.color_blue = mousePos.x;
            } else {
                this.color_alpha = 1 - mousePos.x / 255;
            }
        }

        this.colorString = 'rgba(' + this.color_red + ',' + this.color_green + ',' + this.color_blue + ',' + this.color_alpha + ')';
        this.drawWidget();
        this.callWidgetListeners();
    }
});

var LineWidthWidget = CanvasWidget.extend({
    lineWidth: null,

    constructor: function (canvasName, lineWidth, position) {
        this.lineWidth = lineWidth;
        this.inherit(canvasName, position);
    },

    drawWidget: function () {
        this.context.clearRect(0, 0, 275, 120);

        this.context.fillStyle = 'rgba(0, 0, 0, 0.2)';
        this.context.fillRect(0, 0, 275, 76);

        this.context.strokeStyle = 'rgba(255, 255, 255, 1)';
        this.context.moveTo(1, 38);
        this.context.lineTo(274, 38);
        this.context.stroke();

        this.context.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        this.context.moveTo(1, 19);
        this.context.lineTo(274, 19);
        this.context.moveTo(1, 57);
        this.context.lineTo(274, 57);
        this.context.stroke();

        this.context.beginPath();
        var linePosition = Math.floor((this.lineWidth * 255) / 76);
        this.context.fillStyle = 'rgba(0, 0, 0, 1)';
        this.context.arc(linePosition, 38, this.lineWidth / 2, 0, Math.PI * 2, true);
        this.context.fill();
        this.context.closePath();
    },

    checkWidgetEvent: function (e) {
        var mousePos = this.getCanvasMousePos(e);

        if (mousePos.x >= 0 && mousePos.x <= 255) {
            this.lineWidth = Math.floor(((mousePos.x) * 76) / 255) + 1;
            this.drawWidget();
            this.callWidgetListeners();
        }
    }
});
