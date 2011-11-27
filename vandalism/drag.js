"use strict";
/*global document,
         dragStop,
         window
 */
function hookEvent(element, eventName, callback) {
    if (typeof (element) === "string") {
        element = document.getElementById(element);
    }
    if (!element) {
        return;
    }
    if (element.addEventListener) {
        element.addEventListener(eventName, callback, false);
    } else if (element.attachEvent) {
        element.attachEvent("on" + eventName, callback);
    }
}

function unhookEvent(element, eventName, callback) {
    if (typeof (element) === "string") {
        element = document.getElementById(element);
    }
    if (!element) {
        return;
    }
    if (element.removeEventListener) {
        element.removeEventListener(eventName, callback, false);
    } else if (element.detachEvent) {
        element.detachEvent("on" + eventName, callback);
    }
}

function cancelEvent(e) {
    if (!e) {
        e = window.event;
    }
    if (e.stopPropagation) {
        e.stopPropagation();
    }
    if (e.preventDefault) {
        e.preventDefault();
    }
    e.cancelBubble = true;
    e.cancel = true;
    e.returnValue = false;
    return false;
}

function Position(x, y) {
    this.X = x;
    this.Y = y;

    this.Add = function (val) {
        var newPos = new Position(this.X, this.Y);
        if (val) {
            if (!isNaN(val.X)) {
                newPos.X += val.X;
            }
            if (!isNaN(val.Y)) {
                newPos.Y += val.Y;
            }
        }
        return newPos;
    };

    this.Subtract = function (val) {
        var newPos = new Position(this.X, this.Y);
        if (val) {
            if (!isNaN(val.X)) {
                newPos.X -= val.X;
            }
            if (!isNaN(val.Y)) {
                newPos.Y -= val.Y;
            }
        }
        return newPos;
    };

    this.Min = function (val) {
        var newPos = new Position(this.X, this.Y);
        if (!val) {
            return newPos;
        }

        if (!isNaN(val.X) && this.X > val.X) {
            newPos.X = val.X;
        }
        if (!isNaN(val.Y) && this.Y > val.Y) {
            newPos.Y = val.Y;
        }

        return newPos;
    };

    this.Max = function (val) {
        var newPos = new Position(this.X, this.Y);
        if (!val) {
            return newPos;
        }

        if (!isNaN(val.X) && this.X < val.X) {
            newPos.X = val.X;
        }
        if (!isNaN(val.Y) && this.Y < val.Y) {
            newPos.Y = val.Y;
        }

        return newPos;
    };

    this.Bound = function (lower, upper) {
        var newPos = this.Max(lower);
        return newPos.Min(upper);
    };

    this.Check = function () {
        var newPos = new Position(this.X, this.Y);
        if (isNaN(newPos.X)) {
            newPos.X = 0;
        }
        if (isNaN(newPos.Y)) {
            newPos.Y = 0;
        }
        return newPos;
    };

    this.Apply = function (element) {
        if (typeof (element) === "string") {
            element = document.getElementById(element);
        }
        if (!element) {
            return;
        }
        if (!isNaN(this.X)) {
            element.style.left = this.X + 'px';
        }
        if (!isNaN(this.Y)) {
            element.style.top = this.Y + 'px';
        }
    };
}

function absoluteCursorPostion(eventObj) {
    if (!eventObj) {
        eventObj = window.event;
    }

    if (isNaN(window.scrollX)) {
        var xCoord = eventObj.clientX + document.documentElement.scrollLeft + document.body.scrollLeft,
            yCoord = eventObj.clientY + document.documentElement.scrollTop + document.body.scrollTop;
        return new Position(xCoord, yCoord);
    } else {
        return new Position(eventObj.clientX + window.scrollX, eventObj.clientY + window.scrollY);
    }
}

function DragObject(element, attachElement, lowerBound, upperBound,
                    startCallback, moveCallback, endCallback, attachLater) {
    var cursorStartPos = null,
        disposed = false,
        dragging = false,
        elementStartPos = null,
        listening = false,
        temp = null;

    if (typeof (element) === "string") {
        element = document.getElementById(element);
    }
    if (!element) {
        return;
    }

    if (lowerBound && upperBound) {
        temp = lowerBound.Min(upperBound);
        upperBound = lowerBound.Max(upperBound);
        lowerBound = temp;
    }

    function dragGo(eventObj) {
        if (!dragging || disposed) {
            return;
        }

        var newPos = absoluteCursorPostion(eventObj);
        newPos = newPos.Add(elementStartPos).Subtract(cursorStartPos);
        newPos = newPos.Bound(lowerBound, upperBound);
        newPos.Apply(element);
        if (moveCallback) {
            moveCallback(newPos, element);
        }

        return cancelEvent(eventObj);
    }

    function dragStopHook(eventObj) {
        dragStop();
        return cancelEvent(eventObj);
    }

    function dragStart(eventObj) {
        if (dragging || !listening || disposed) {
            return;
        }
        dragging = true;

        if (startCallback) {
            startCallback(eventObj, element);
        }

        cursorStartPos = absoluteCursorPostion(eventObj);
        elementStartPos = new Position(parseInt(element.style.left, 10), parseInt(element.style.top, 10));
        elementStartPos = elementStartPos.Check();

        hookEvent(document, "mousemove", dragGo);
        hookEvent(document, "mouseup", dragStopHook);

        return cancelEvent(eventObj);
    }

    function dragStop() {
        if (!dragging || disposed) {
            return;
        }
        unhookEvent(document, "mousemove", dragGo);
        unhookEvent(document, "mouseup", dragStopHook);
        cursorStartPos = null;
        elementStartPos = null;
        if (endCallback) {
            endCallback(element);
        }
        dragging = false;
    }

    this.Dispose = function () {
        if (disposed) {
            return;
        }
        this.StopListening(true);
        element = null;
        attachElement = null;
        lowerBound = null;
        upperBound = null;
        startCallback = null;
        moveCallback = null;
        endCallback = null;
        disposed = true;
    };

    this.StartListening = function () {
        if (listening || disposed) {
            return;
        }
        listening = true;
        hookEvent(attachElement, "mousedown", dragStart);
    };

    this.StopListening = function (stopCurrentDragging) {
        if (!listening || disposed) {
            return;
        }
        unhookEvent(attachElement, "mousedown", dragStart);
        listening = false;

        if (stopCurrentDragging && dragging) {
            dragStop();
        }
    };

    this.IsDragging = function () {
        return dragging;
    };

    this.IsListening = function () {
        return listening;
    };

    this.IsDisposed = function () {
        return disposed;
    };

    if (typeof (attachElement) === "string") {
        attachElement = document.getElementById(attachElement);
    }
    if (!attachElement) {
        attachElement = element;
    }

    if (!attachLater) {
        this.StartListening();
    }
}
