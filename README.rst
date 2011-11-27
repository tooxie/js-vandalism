=========
Vandalism
=========

Vandalize the web, make it yours.


Description
===========

Vandalism is an application that lets you scribble on web pages. You can draw figures like rectangles and circles, draw freehand and write text. This is useful for web development teams, to make annotations on web sites. With the help of an addon like Abduction! [0] you can save the page with its annotations as an image.

[0] https://addons.mozilla.org/en-US/firefox/addon/abduction/


How does it work?
=================

Open the file index.html (or launch the demo if you are on Mozilla's Demo Studio.) You'll see an image, drag it to your bookmarks tab and drop it there. Now go to another web page, any, and click the brand new bookmark. You should be able to make annotations on the web page.


Design
======

The app right now is not very pretty. I'm looking for a designer who may want to contribute to the project. If you want to help please contact me.

On the shoulders of giants
=========================

This app is based on Rafael Robayna's "Canvas Painter" [1] and on switchonthecode.com's tutorial "Draggable Elements" [2]. Nevertheless it has a lot of work on top of it.

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
* Some buttons, like brushes, get selected when clicked, other, such as undo, don't.
* All the code was JSLint'ed.
* The mousedown event got captured when mousemove began, not when mouse was clicked.
* Widgets no longer needs to be positioned absolutely and referenced absolutely.


TODO list
---------

* If you just click and release (no drag) nothing gets drawn but an entry in history is created.
* A color picker would be nice.
* Prettier design. Anyone wants to help? =)
* The logic is highly coupled to the GUI. When you add a button to the toolbar you can break everything.


I hope you find it useful. Fork it: https://github.com/tooxie/js-vandalism

Happy hacking!
