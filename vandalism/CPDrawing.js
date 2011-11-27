"use strict";
/*global Base,
         canvasPainter
 */
/*
    Copyright (c) 2005, 2006 Rafael Robayna

    Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

    Additional Contributions by: Morris Johns
*/
var CPDrawing = Base.extend({
    canvasPainter: null,  // a reference to the instance of the canvasPainter it is going to manipulate
    drawing: null, // the drawing data
    undoNodes: null, // undone drawing data nodes
    lastClear: null,

    constructor: function (canvasPainter) {
        this.canvasPainter = canvasPainter;
        this.drawing = [];
        this.undoNodes = [];
        this.canvasPainter.addWidgetListener(this.recordAction.bindAsEventListener(this));
    },

    recordAction: function () {
        if (this.drawing.length !== 0 && this.canvasPainter.cpMouseDownState === true && (this.canvasPainter.curDrawAction === 0 || this.canvasPainter.curDrawAction === 1)) {
            var currentNode = this.drawing[this.drawing.length - 1];
            currentNode.p[currentNode.p.length] = this.canvasPainter.curPos;
        } else {
            if (this.canvasPainter.curDrawAction === 5) {
                this.lastClear = this.drawing.length;
            }
            this.drawing.push(this.addNode());
            this.undoNodes = [];
        }
    },

    addNode: function () {
        var drawingNode = {};
        drawingNode.p = [
            this.canvasPainter.startPos,
            this.canvasPainter.curPos
        ];
        drawingNode.a = this.canvasPainter.curDrawAction; //action
        //color and line width should stored and recalled independantly for both this and animator
        drawingNode.c = this.canvasPainter.drawColor; //color
        drawingNode.w = this.canvasPainter.context.lineWidth; //width
        return drawingNode;
    },

    removeLastNode: function () {
        if (this.drawing.length === 0) {
            return;
        }
        this.undoNodes.push(this.drawing.pop());
        this.paintDrawing();
    },

    addLastRemovedNode: function () {
        if (this.undoNodes.length === 0) {
            return;
        }
        this.drawing.push(this.undoNodes.pop());
        this.paintDrawing();
    },

    paintDrawing: function () {
        var drawingNode,
            i = 0,
            n = 0;
        this.canvasPainter.clearCanvas(canvasPainter);
        for (i = 0; i < this.drawing.length; i += 1) {
            drawingNode = this.drawing[i];
            this.canvasPainter.context.fillStyle = drawingNode.c;
            this.canvasPainter.context.strokeStyle = drawingNode.c;
            this.canvasPainter.context.lineWidth = drawingNode.w;

            if (drawingNode.p.length === 2) {
                this.canvasPainter.drawActions[drawingNode.a](drawingNode.p[0], drawingNode.p[1], this.canvasPainter.context, false);
            } else {
                for (n = 0; n < (drawingNode.p.length - 1); n += 1) {
                    this.canvasPainter.drawActions[drawingNode.a](drawingNode.p[n], drawingNode.p[n + 1], this.canvasPainter.context, false);
                }
            }
        }
    }
});
