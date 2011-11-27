"use strict";
/*global window */
/*
    Base, version 1.0.1
    Copyright 2006, Dean Edwards
    License: http://creativecommons.org/licenses/LGPL/2.1/
*/
function Base() {
}
Base.version = "1.0.1";
Base.prototype = {
    extend: function (source, value) {
        var _prototype = {},
            _protected = [],
            ancestor = null,
            ancestorAndValue = false,
            extend = Base.prototype.extend,
            i = 0,
            method = null,
            name = '',
            previous = null,
            returnValue = null;
        if (arguments.length === 2) {
            ancestor = this[source];
            ancestorAndValue = (ancestor instanceof Function) && (value instanceof Function);
            // overriding?
            if (ancestorAndValue && ancestor.valueOf() !== value.valueOf() && /\binherit\b/.test(value)) {
                method = value;
                value = function () {
                    previous = this.inherit;
                    this.inherit = ancestor;
                    returnValue = method.apply(this, arguments);
                    this.inherit = previous;
                    return returnValue;
                };
                // point to the underlying method
                value.valueOf = function () {
                    return method;
                };
                value.toString = function () {
                    return String(method);
                };
            }
            this[source] = value;
            return value;
        } else if (source) {
            _prototype = {
                toSource: null
            };
            // do the "toString" and other methods manually
            _protected = ["toString", "valueOf"];
            // if we are prototyping then include the constructor
            if (Base._prototyping) {
                _protected[2] = "constructor";
            }
            for (i = 0; i < _protected.length; i += 1) {
                name = _protected[i];
                if (source[name] !== _prototype[name]) {
                    extend.call(this, name, source[name]);
                }
            }
            // copy each of the source object's properties to this object
            for (name in source) {
                if (!_prototype[name]) {
                    extend.call(this, name, source[name]);
                }
            }
        }
        return this;
    },

    inherit: function () {
        // call this method from any other method to invoke that method's ancestor
    }
};

Base.extend = function (_instance, _static) {
    var _prototype,
        constructor,
        extend = Base.prototype.extend,
        klass,
        object;
    if (!_instance) {
        _instance = {};
    }
    // create the constructor
    if (_instance.constructor === Object) {
        _instance.constructor = function () {};
    }
    // build the prototype
    Base._prototyping = true;
    _prototype = new this();
    extend.call(_prototype, _instance);
    constructor = _prototype.constructor;
    _prototype.constructor = this;
    delete Base._prototyping;
    // create the wrapper for the constructor function
    klass = function () {
        if (!Base._prototyping) {
            constructor.apply(this, arguments);
        }
        this.constructor = klass;
    };
    klass.prototype = _prototype;
    // build the class interface
    klass.extend = this.extend;
    klass.toString = function () {
        return String(constructor);
    };
    extend.call(klass, _static);
    // support singletons
    if (constructor) {
        object = klass;
    } else {
        object = _prototype;
    }
    // class initialisation
    if (object.init instanceof Function) {
        object.init();
    }
    return object;
};

/*  Prototype JavaScript framework, version 1.4.0
 *  (c) 2005 Sam Stephenson <sam@conio.net>
 *
 *  Prototype is freely distributable under the terms of an MIT-style license.
 *  For details, see the Prototype web site: http://prototype.conio.net/
 *
 *--------------------------------------------------------------------------*/
Function.prototype.bindAsEventListener = function (object) {
    var __method = this;
    return function (event) {
        return __method.call(object, event || window.event);
    };
};
