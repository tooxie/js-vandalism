=========
Vandalism
=========

Vandalize the web, make it yours.


Description
===========

Vandalism is an application that lets you scribble on web pages. You can draw
figures like rectangles and circles, draw freehand and write text. This is
useful for web development teams, to make annotations on web sites. With the
help of an addon like Abduction! [0] you can save the page with its annotations
as an image.

[0] https://addons.mozilla.org/en-US/firefox/addon/abduction/


Design
======

The app right now is not very pretty. I'm looking for a designer who may want
to contribute to the project. If you want to help please contact me.


On the soulders of giants
=========================

This app is based on Rafael Robayna's "Canvas Painter" [1] and on
switchonthecode.com's tutorial "Draggable Elements". Nevertheless it has a lot
of work on top of it.

[1] http://caimansys.com/painter/

[2] http://www.switchonthecode.com/tutorials/javascript-draggable-elements


Features added
--------------

 * Drag and drop for the toolbars.
 * Text writing.
 * Undo and redo.


Features dropped
----------------

 * IE support.
 * Canvas animator.
 * "New" button.


Changes and bugfixes
--------------------

 * Many UI features that were applied through JS were reimplemented on CSS.
 * Some buttons get selected when clicked, other don't.
 * All the code was JSLint'ed.
 * The mousedown event got captured when mousemove began, not when mouse was clicked.
 * Widgets no longer needs to be positioned absolutly and referenced absolutly.

TODO list
---------

 * If you just click and release (no drag) nothing gets drawn but an entry in history is created.
 * A color picker would be nice.
 * Prettier design. Anyone wants to help? =)
 * The logic is highly coupled to the GUI. When you add a button to the toolbar you can break everything.


I hope you find it useful.
