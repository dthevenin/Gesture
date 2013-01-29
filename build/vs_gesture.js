(function(){ 
 if (typeof exports === 'undefined') { exports = this; }
 var vs = exports.vs, util = vs.util;

/**
  Copyright (C) 2009-2012. David Thevenin, ViniSketch SARL (c), and 
  contributors. All rights reserved
  
  This program is free software: you can redistribute it and/or modify
  it under the terms of the GNU Lesser General Public License as published
  by the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.
  
  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
  GNU Lesser General Public License for more details.
  
  You should have received a copy of the GNU Lesser General Public License
  along with this program. If not, see <http://www.gnu.org/licenses/>.
*/

/* touch event messages */
/**
 * @name vs.core.EVENT_SUPPORT_TOUCH
 */
var EVENT_SUPPORT_TOUCH = false;
var EVENT_SUPPORT_GESTURE = false;
var hasMSPointer = window.navigator.msPointerEnabled;

if (typeof document != "undefined" && 'createTouch' in document)
  EVENT_SUPPORT_TOUCH = true;

else if (hasMSPointer) { EVENT_SUPPORT_TOUCH = true; }

else if (typeof document != "undefined" &&
    window.navigator && window.navigator.userAgent)
{
  if (window.navigator.userAgent.indexOf ('Android') !== -1 ||
      window.navigator.userAgent.indexOf ('BlackBerry') !== -1)
  { EVENT_SUPPORT_TOUCH = true; }
}


var POINTER_START, POINTER_MOVE, POINTER_END, POINTER_CANCEL;

if (EVENT_SUPPORT_TOUCH)
{
  POINTER_START = hasMSPointer ? 'MSPointerDown' : 'touchstart';
  POINTER_MOVE = hasMSPointer ? 'MSPointerMove' : 'touchmove';
  POINTER_END = hasMSPointer ? 'MSPointerUp' : 'touchend';
  POINTER_CANCEL = hasMSPointer ? 'MSPointerCancel' : 'touchcancel';
}
else
{
  POINTER_START = 'mousedown';
  POINTER_MOVE = 'mousemove';
  POINTER_END = 'mouseup';
  POINTER_CANCEL = 'mouseup';
}

// TODO(smus): Come up with a better solution for this. This is bad because
// it might conflict with a touch ID. However, giving negative IDs is also
// bad because of code that makes assumptions about touch identifiers being
// positive integers.
var MOUSE_ID = 31337;

function Pointer (event, type, identifier)
{
  this.configureWithEvent (event)
  this.type = type;
  this.identifier = identifier;
}

Pointer.prototype.configureWithEvent = function (evt)
{
  this.pageX = evt.pageX;
  this.pageY = evt.pageY;
  this.clientX = evt.clientX;
  this.clientY = evt.clientY;
  this.target = evt.target;
  this.currentTarget = evt.currentTarget;
}

var PointerTypes = {
  TOUCH: 2,
  PEN: 3,
  MOUSE: 4
};

/**
 * Returns an array of all pointers currently on the screen.
 */

var pointerEvents = [];

function buildTouchList (evt, target_id)
{
  var pointers = [];
  evt.nbPointers = evt.touches.length;
  for (var i = 0; i < evt.nbPointers; i++)
  {
    var touch = evt.touches[i];
    var pointer = new Pointer (touch, PointerTypes.TOUCH, touch.identifier);
    pointers.push (pointer);
  }
  evt.pointerList = pointers;
  pointers = [];
  for (var i = 0; i < evt.targetTouches.length; i++)
  {
    var touch = evt.targetTouches[i];
    if (target_id && pointerEvents [touch.identifier] != target_id) continue;
    var pointer = new Pointer (touch, PointerTypes.TOUCH, touch.identifier);
    pointers.push (pointer);
  }
  evt.targetPointerList = pointers;
  pointers = [];
  for (var i = 0; i < evt.changedTouches.length; i++)
  {
    var touch = evt.changedTouches[i];
    var pointer = new Pointer (touch, PointerTypes.TOUCH, touch.identifier);
    pointers.push (pointer);
  }
  evt.changedPointerList = pointers;
}

function buildMouseList (evt, remove)
{
  var pointers = [];
  pointers.push (new Pointer (evt, PointerTypes.MOUSE, MOUSE_ID));
  if (!remove)
  {
    evt.nbPointers = 1;
    evt.pointerList = pointers;
    evt.targetPointerList = pointers;
    evt.changedPointerList = [];
  }
  else
  {
    evt.nbPointers = 0;
    evt.pointerList = [];
    evt.targetPointerList = pointers;
    evt.changedPointerList = pointers;
  }
}

var all_pointers = {};
var removed_pointers = {};

function buildMSPointerList (evt, remove, target_id)
{
  // Note: "this" is the element.
  var pointers = [];
  var removePointers = [];
  var id = evt.pointerId, pointer = all_pointers [id];

  if (remove)
  {
    if (pointer)
    {
      removed_pointers [id] = pointer;
      delete (all_pointers [id]);
    }
    else
    {
      pointer = removed_pointers [id];
      if (!pointer)
      {
        pointer = new Pointer (evt, evt.pointerType, id);
        removed_pointers [id] = pointer;
      }
    }
    for (id in removed_pointers) { removePointers.push (removed_pointers [id]); }
    removed_pointers = {};
  }
  else
  {
    if (pointer) {
      pointer.configureWithEvent (evt);
    }
    else
    {
      pointer = new Pointer (evt, evt.pointerType, id);
      all_pointers [id] = pointer;
    }
  }
  for (id in all_pointers) { pointers.push (all_pointers [id]); }
  evt.nbPointers = pointers.length;
  evt.pointerList = pointers;
  pointers = [];
  for (id in all_pointers)
  {
    var pointer = all_pointers [id];
//    if (target_id && pointerEvents [pointer.identifier] != target_id) continue;
    pointers.push (pointer);
  }
  evt.targetPointerList = pointers;
  evt.changedPointerList = removePointers;
}

/*************** Mouse event handlers *****************/

function mouseDownHandler (event, listener)
{
  buildMouseList (event);
  listener (event);
}

function mouseMoveHandler(event, listener)
{
  buildMouseList (event);
  listener (event);
}

function mouseUpHandler (event, listener)
{
  buildMouseList (event, true);
  listener (event);
}

/*************** Touch event handlers *****************/

function touchStartHandler (event, listener, target_id)
{
  var pointer, l = event.targetTouches.length;
  for (var i = 0; i < l; i++)
  {
    pointer = event.targetTouches [i];
    pointerEvents [pointer.identifier] = target_id;
  }
  buildTouchList (event);
  listener (event);
}

function touchMoveHandler (event, listener, target_id)
{
  buildTouchList (event, target_id);
  listener (event);
}

function touchEndHandler (event, listener)
{
  var pointer, l = event.targetTouches.length;
  for (var i = 0; i < l; i++)
  {
    pointer = event.changedTouches [i];
    pointerEvents [pointer.identifier] = undefined;
  }
  buildTouchList (event);
  listener (event);
}

function touchCancelHandler (event, listener)
{
  buildTouchList (event);
  listener (event, listener);
}

/*************** MSIE Pointer event handlers *****************/

// remove the pointer from the list of availables pointer
var nbPointerListener = 0;
var msRemovePointer = function (evt) {
  var id = evt.pointerId, pointer = all_pointers [id];

  if (pointer)
  {
    removed_pointers [pointer.identifier] = pointer;
    delete (all_pointers [pointer.identifier]);
  }
  nbPointerListener --;

  if (nbPointerListener === 0)
  {
    document.removeEventListener ('MSPointerUp', msRemovePointer);
    document.removeEventListener ('MSPointerCancel', msRemovePointer);
  }
}

function msPointerDownHandler (event, listener, target_id)
{
  pointerEvents [event.pointerId] = target_id;
  buildMSPointerList (event, false, target_id);
  listener (event);

  if (nbPointerListener === 0)
  {
    document.addEventListener ('MSPointerUp', msRemovePointer);
    document.addEventListener ('MSPointerCancel', msRemovePointer);
  }
  nbPointerListener ++;
}

function msPointerMoveHandler (event, listener, target_id)
{
  buildMSPointerList (event, false, target_id);
  listener (event);
}

function msPointerUpHandler (event, listener)
{
  buildMSPointerList (event, true);
  listener (event);
}

function msPointerCancelHandler (event, listener)
{
  buildMSPointerList (event, true);
  listener (event);
}

/*************************************************************/

var pointerStartHandler, pointerMoveHandler, pointerEndHandle, pointerCancelHandler;

if (EVENT_SUPPORT_TOUCH)
{
  if (hasMSPointer)
  {
    pointerStartHandler = msPointerDownHandler;
    pointerMoveHandler = msPointerMoveHandler;
    pointerEndHandler = msPointerUpHandler;
    pointerCancelHandler = msPointerCancelHandler;
  }
  else
  {
    pointerStartHandler = touchStartHandler;
    pointerMoveHandler = touchMoveHandler;
    pointerEndHandler = touchEndHandler;
    pointerCancelHandler = touchCancelHandler;
  }
}
else
{
  pointerStartHandler = mouseDownHandler;
  pointerMoveHandler = mouseMoveHandler;
  pointerEndHandler = mouseUpHandler;
  pointerCancelHandler = mouseUpHandler;
}

function getBindingIndex (target, type, listener)
{
  if (!type || !listener || !listener.__event_listeners) return -1;
  for (var i = 0; i < listener.__event_listeners.length; i++)
  {
    var binding = listener.__event_listeners [i];
    if (binding.target === target && binding.type === type && binding.listener === listener)
      return i;
  }
  return -1;
}

function managePointerListenerAdd (node, type, func, binding)
{
  var target_id = (binding.listener)?binding.listener.id:undefined;
  switch (type)
  {
    case POINTER_START:
      binding.handler = function (e) {pointerStartHandler (e, func, target_id);};
      return true;
    break;

    case POINTER_MOVE:
    
      binding.handler = function (e) {pointerMoveHandler (e, func, target_id);};
      return true;
    break;

    case POINTER_END:
      binding.handler = function (e) {pointerEndHandler (e, func);};
      return true;
    break;

    case POINTER_CANCEL:
      binding.handler = function (e) {pointerCancelHandler (e, func);};
      return true;
    break;
  }
  return false;
}

function managePointerListenerRemove (node, type, binding)
{
  switch (type)
  {
    case POINTER_START:
    case POINTER_MOVE:
    case POINTER_END:
    case POINTER_CANCEL:
      return true;
    break;
  }
  return false;
}

/**
 * Option 2: Replace addEventListener with a custom version.
 */
function addPointerListener (node, type, listener, useCapture)
{
  if (!listener) {
    console.error ("addPointerListener no listener");
    return;
  }
  var func = listener;
  if (!util.isFunction (listener))
  {
    func = listener.handleEvent;
    if (util.isFunction (func)) func = func.bind (listener);
  }

  if (getBindingIndex (node, type, listener) !== -1)
  {
    console.error ("addPointerListener binding already existing");
    return;
  }

  if (!listener.__event_listeners) listener.__event_listeners = [];

  var binding = {
    target: node,
    type: type,
    listener: listener
  };
  listener.__event_listeners.push (binding);

  if (!managePointerListenerAdd (node, type, func, binding))
  {
    if (!manageGestureListenerAdd (node, type, func, binding))
    {
      binding.handler = func;
    }
  }

  node.addEventListener (type, binding.handler, useCapture);
}

function removePointerListener (node, type, listener, useCapture)
{
  if (!listener) {
    console.error ("removePointerListener no listener");
    return;
  }

  var index = getBindingIndex (node, type, listener);
  if (index === -1)
  {
    console.error ("removePointerListener no binding");
    return;
  }
  var binding = listener.__event_listeners [index];
  listener.__event_listeners.remove (index);

  if (!managePointerListenerRemove (node, type, binding))
  {
    if (!manageGestureListenerRemove (node, type, binding))
    {}
  }

  node.removeEventListener (type, binding.handler, useCapture);
  delete (binding);
}

function createCustomEvent (eventName, target, payload)
{
  var event = document.createEvent ('Event');
  event.initEvent (eventName, true, true);
  for (var k in payload) {
    event[k] = payload[k];
  }
  target.dispatchEvent (event);
};

/********************************************************************
                      Export
*********************************************************************/
/** @private */
vs.createCustomEvent = createCustomEvent;
vs.removePointerListener = removePointerListener;
vs.addPointerListener = addPointerListener;
vs.PointerTypes = PointerTypes;

/** 
 * Start pointer event (mousedown, touchstart, )
 * @name vs.POINTER_START
 * @type {String}
 * @const
 */ 
vs.POINTER_START = POINTER_START;

/** 
 * Move pointer event (mousemove, touchmove, )
 * @name vs.POINTER_MOVE 
 * @type {String}
 * @const
 */ 
vs.POINTER_MOVE = POINTER_MOVE;

/** 
 * End pointer event (mouseup, touchend, )
 * @name vs.POINTER_END 
 * @type {String}
 * @const
 */ 
vs.POINTER_END = POINTER_END;

/** 
 * Cancel pointer event (mouseup, touchcancel, )
 * @name vs.POINTER_CANCEL 
 * @type {String}
 * @const
 */ 
vs.POINTER_CANCEL = POINTER_CANCEL;/**
  Copyright (C) 2009-2012. David Thevenin, ViniSketch SARL (c), and 
  contributors. All rights reserved
  
  This program is free software: you can redistribute it and/or modify
  it under the terms of the GNU Lesser General Public License as published
  by the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.
  
  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
  GNU Lesser General Public License for more details.
  
  You should have received a copy of the GNU Lesser General Public License
  along with this program. If not, see <http://www.gnu.org/licenses/>.
*/

var GESTURE_START, GESTURE_CHANGE, GESTURE_END;

var support = {};

var events = [
  'gesturestart',
  'gesturechange',
  'gestureend'
];

var el = document.createElement ('div');

for (var i = 0; i < events.length; i++)
{
  var eventName = events[i];
  eventName = 'on' + eventName;
  var isSupported = (eventName in util.vsTestElem);
  if (!isSupported)
  {
    util.vsTestElem.setAttribute(eventName, 'return;');
    isSupported = typeof util.vsTestElem[eventName] == 'function';
  }
  support [events[i]] = isSupported;
}

support.gestures =
  support.gesturestart && 
  support.gesturechange && 
  support.gestureend;

if ('MSGestureEvent' in window) support.msGestures = true;

// for now force non gesture native events
support.gestures = false;
support.msGestures = false;

/*************************************************************/

/**
 * calculate the distance between two Pointers
 * @param   Pointer  pos1 { x: int, y: int }
 * @param   Pointer  pos2 { x: int, y: int }
 */
function getDistance (pointer1, pointer2)
{
  var x = pointer2.pageX - pointer1.pageX, y = pointer2.pageY - pointer1.pageY;
  return Math.sqrt ((x * x) + (y * y));
};

/**
 * calculate the angle between two points
 * @param   Pointer  pointer1 { x: int, y: int }
 * @param   Pointer  pointer2 { x: int, y: int }
 */
function getAngle (pointer1, pointer2 )
{
  return Math.atan2 (pointer2.pageY - pointer1.pageY, pointer2.pageX - pointer1.pageX) * 180 / Math.PI;
};

function getBarycentre (pointers)
{
  var nb_pointer = pointers.length, index = 0, x = 0, y = 0;
  if (nb_pointer === 0) return {X: 0, y: 0};
  var dec = pointers[0].target.__init_pos;
 
  for (;index < nb_pointer; index++)
  {
    var pointer = pointers [index];
    
    x += pointer.pageX;
    y += pointer.pageY;
  }
  
  return {x: x / nb_pointer - dec.x, y: y / nb_pointer - dec.y};
};

function getTranslate (pos1, pos2)
{
  return [pos1.x - pos2.x, pos1.y - pos2.y];
}

var buildPaylaod = function (event, end)
{
  var barycentre = (end)?undefined:getBarycentre (event.targetPointerList);

  return {
    scale: (end)?undefined:
      getDistance (event.targetPointerList [0], event.targetPointerList [1]) / 
      event.target.__init_distance,
    rotation: (end)?undefined:
      getAngle (event.targetPointerList [0], event.targetPointerList [1]) - 
      event.target.__init_angle,
    translation: (end)?undefined:
      getTranslate (barycentre, event.target.__init_barycentre),
    nbPointers : event.nbPointers,
    pointerList : event.pointerList,
    targetPointerList: event.targetPointerList,
    barycentre : barycentre,
    changedPointerList: event.changedPointerList
  };
};

var _gesture_follow = false;
var gestureStartListener = function (event, listener)
{
  if (event.targetPointerList.length < 2) return;
  if (!_gesture_follow)
  {
    event.target.__init_distance =
      getDistance (event.targetPointerList [0], event.targetPointerList [1]);
    event.target.__init_angle =
      getAngle (event.targetPointerList [0], event.targetPointerList [1]);
    
    var comp = event.targetPointerList[0].target._comp_;
    var init_pos = util.getElementAbsolutePosition (event.targetPointerList[0].target, true);
//    init_pos = init_pos.matrixTransform (comp.getParentCTM ());
    
    event.target.__init_pos = init_pos;
    var init_barycentre = getBarycentre (event.targetPointerList);
    event.target.__init_barycentre = init_barycentre;
       
    document.addEventListener (vs.POINTER_MOVE, gestureChangeListener);
    document.addEventListener (vs.POINTER_END, gestureEndListener);
    document.addEventListener (vs.POINTER_CANCEL, gestureEndListener);
    createCustomEvent (GESTURE_START, event.target, buildPaylaod (event));
    _gesture_follow = true;
  }
  else
  {
    createCustomEvent (GESTURE_CHANGE, event.target, buildPaylaod (event));
  }
};

var gestureChangeListener = function (event)
{
  pointerMoveHandler (event, function (event)
  {
    createCustomEvent (GESTURE_CHANGE, event.target, buildPaylaod (event));
  });
};

var gestureEndListener = function (event)
{
  pointerEndHandler (event, function (event)
  {
    if (event.targetPointerList.length < 2)
    {
      document.removeEventListener (vs.POINTER_MOVE, gestureChangeListener);
      document.removeEventListener (vs.POINTER_END, gestureEndListener);
      document.removeEventListener (vs.POINTER_CANCEL, gestureEndListener);
      _gesture_follow = false;
      createCustomEvent (GESTURE_END, event.target, buildPaylaod (event, true));
    }
    else
    {
      createCustomEvent (GESTURE_CHANGE, event.target, buildPaylaod (event));
    }
  });
};

function buildGestureList (evt)
{
  evt.barycentre = {x: evt.pageX, y: evt.pageY};
  evt.translation =
      getTranslate (evt.barycentre, event.target.__init_barycentre);
  evt.pointerList = [
    new Pointer (evt, PointerTypes.TOUCH, MOUSE_ID)
  ];
  evt.targetPointerList = evt.pointerList;
  evt.nbPointers = 1;
}

var gestureIOSStartListener = function (event, listener)
{
  event.target.__init_barycentre = {x: event.pageX, y: event.pageY};
  buildGestureList (event);
  listener (event);
};

var gestureIOSChangeListener = function (event, listener)
{
  buildGestureList (event);
  listener (event);
};

var gestureIOSEndListener = function (event, listener)
{
  buildGestureList (event);
  listener (event);
};

if (support.msGestures)
{
  GESTURE_START = 'MSGestureStart';
  GESTURE_CHANGE = 'MSGestureChange';
  GESTURE_END = 'MSGestureEnd';
}
else if (support.gestures)
{
  GESTURE_START = 'gesturestart';
  GESTURE_CHANGE = 'gesturechange';
  GESTURE_END = 'gestureend';
}
else
{
  GESTURE_START = '_gesture_start';
  GESTURE_CHANGE = '_gesture_change';
  GESTURE_END = '_gesture_end';
}

function touchToGestureListenerAdd (node, type, func, binding)
{
  var target_id = (binding.listener)?binding.listener.id:undefined;
  switch (type)
  {
    case GESTURE_START:
      binding.gesture_handler =
        function (e) {pointerStartHandler (e, gestureStartListener, target_id)};
      node.addEventListener (vs.POINTER_START, binding.gesture_handler);
      binding.handler = func;

      return true;
    break;

    case GESTURE_CHANGE:
    case GESTURE_END:
      binding.handler = func;
      return true;
    break;
  }

  return false;
}

function gestureEventListenerAdd (node, type, func, binding)
{
  var target_id = (binding.listener)?binding.listener.id:undefined;
  switch (type)
  {
    case GESTURE_START:
      binding.handler = function (e) {gestureIOSStartListener (e, func, target_id);};
      return true;
    break;

    case GESTURE_CHANGE:
      binding.handler = function (e) {gestureIOSChangeListener (e, func, target_id);};
      return true;
    break;

    case GESTURE_END:
      binding.handler = function (e) {gestureIOSEndListener (e, func, target_id);};
      return true;
    break;
  }

  return false;
}

var manageGestureListenerAdd =
  (support.gestures || support.msGestures)?gestureEventListenerAdd:touchToGestureListenerAdd;

function touchToGestureListenerRemove (node, type, binding)
{
  var target_id = (binding.listener)?binding.listener.id:undefined;
  switch (type)
  {
    case GESTURE_START:
      node.removeEventListener (vs.POINTER_START, binding.gesture_handler, target_id);

      return true;
    break;

    case GESTURE_CHANGE:
    case GESTURE_END:
      return true;
    break;
  }

  return false;
}

function gestureListenerRemove (node, type, binding)
{
  switch (type)
  {
    case GESTURE_START:
    case GESTURE_CHANGE:
    case GESTURE_END:
      return true;
    break;
  }

  return false;
}

var manageGestureListenerRemove =
  (support.gestures || support.msGestures)?gestureListenerRemove:touchToGestureListenerRemove;
  
/** 
 * Start gesture event
 * @name vs.GESTURE_START
 * @type {String}
 * @const
 */ 
vs.GESTURE_START = GESTURE_START;

/** 
 * Move gesture event
 * @name vs.GESTURE_CHANGE 
 * @type {String}
 * @const
 */ 
vs.GESTURE_CHANGE = GESTURE_CHANGE;

/** 
 * End gesture event
 * @name vs.GESTURE_END 
 * @type {String}
 * @const
 */ 
vs.GESTURE_END = GESTURE_END;

}).call(this);
