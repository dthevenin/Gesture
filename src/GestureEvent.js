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

var __init_distance = 0, __init_angle = 0, __init_centroid, __init_pos;

function getCentroid (pointers)
{
  var nb_pointer = pointers.length, index = 0, x = 0, y = 0;
  if (nb_pointer === 0) return {X: 0, y: 0};
 
  for (;index < nb_pointer; index++)
  {
    var pointer = pointers [index];
    
    x += pointer.pageX;
    y += pointer.pageY;
  }
  
  return {x: x / nb_pointer - __init_pos.x, y: y / nb_pointer - __init_pos.y};
};

function getTranslate (pos1, pos2)
{
  return [pos1.x - pos2.x, pos1.y - pos2.y];
}

var buildPaylaod = function (event, end)
{
  var centroid = (end)?undefined:getCentroid (event.targetPointerList);

  return {
    scale: (end)?undefined:
      getDistance (event.targetPointerList [0], event.targetPointerList [1]) /
        __init_distance,
    rotation: (end)?undefined:
      getAngle (event.targetPointerList [0], event.targetPointerList [1]) - 
        __init_angle,
    translation: (end)?undefined: getTranslate (centroid, __init_centroid),
    nbPointers : event.nbPointers,
    pointerList : event.pointerList,
    targetPointerList: event.targetPointerList,
    centroid : centroid,
    changedPointerList: event.changedPointerList
  };
};

var _gesture_follow = false;
var gestureStartListener = function (event, listener)
{
  if (event.targetPointerList.length < 2) return;
  if (!_gesture_follow)
  {
    __init_distance =
      getDistance (event.targetPointerList [0], event.targetPointerList [1]);
    __init_angle =
      getAngle (event.targetPointerList [0], event.targetPointerList [1]);
    
    var comp = event.targetPointerList[0].target._comp_;
    __init_pos = util.getElementAbsolutePosition (event.targetPointerList[0].target, true);
//    init_pos = init_pos.matrixTransform (comp.getParentCTM ());
    
    __init_centroid = getCentroid (event.targetPointerList);
       
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
  evt.centroid = {x: evt.pageX, y: evt.pageY};
  evt.translation = getTranslate (evt.centroid, __init_centroid);
  evt.pointerList = [
    new Pointer (evt, PointerTypes.TOUCH, MOUSE_ID)
  ];
  evt.targetPointerList = evt.pointerList;
  evt.nbPointers = 1;
}

var gestureIOSStartListener = function (event, listener)
{
  __init_centroid = {x: event.pageX, y: event.pageY};
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

