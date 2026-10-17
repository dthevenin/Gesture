// import { getElementAbsolutePosition, vsTestElem } from 'vs_ui_utils';
// import {
//   createCustomEvent, Pointer,
//
//   pointerEndHandler,
//   pointerMoveHandler,
//   pointerStartHandler,
// } from './PointerEvent';
// import { POINTER_EVENTS } from "./POINTER_EVENTS";
// import { GESTURE_EVENTS } from "./GESTURE_EVENTS";
//
// const support = {};
//
// const events = [
//   'gesturestart',
//   'gesturechange',
//   'gestureend',
// ];
//
// var el = document.createElement('div');
//
// for (var i = 0; i < events.length; i++) {
//   var eventName = events[i];
//   eventName = 'on' + eventName;
//   var isSupported = (eventName in vsTestElem);
//   if (!isSupported) {
//     vsTestElem.setAttribute(eventName, 'return;');
//     isSupported = typeof vsTestElem[eventName] == 'function';
//   }
//   support [events[i]] = isSupported;
// }
//
// /*************************************************************/
//
// /**
//  * calculate the distance between two Pointers
//  * @param pointer1
//  * @param pointer2
//  */
// function getDistance(pointer1: Pointer, pointer2: Pointer) {
//   if (!pointer1 || !pointer2) return 0;
//
//   var x = pointer2.pageX - pointer1.pageX, y = pointer2.pageY - pointer1.pageY;
//   return Math.sqrt((x * x) + (y * y));
// };
//
// /**
//  * calculate the angle between two points
//  * @param   Pointer  pointer1 { x: int, y: int }
//  * @param   Pointer  pointer2 { x: int, y: int }
//  */
// function getAngle(pointer1, pointer2) {
//   if (!pointer1 || !pointer2) return 0;
//
//   return Math.atan2(pointer2.pageY - pointer1.pageY, pointer2.pageX - pointer1.pageX) * 180 / Math.PI;
// };
//
// var __init_distance = 0, __init_angle = 0, __init_centroid, __init_pos;
//
// function getCentroid(pointers) {
//   var nb_pointer = pointers.length, index = 0, x = 0, y = 0;
//   if (nb_pointer === 0) return { X: 0, y: 0 };
//
//   for (; index < nb_pointer; index++) {
//     var pointer = pointers [index];
//
//     x += pointer.pageX;
//     y += pointer.pageY;
//   }
//
//   return { x: x / nb_pointer - __init_pos.x, y: y / nb_pointer - __init_pos.y };
// };
//
// function getTranslate(pos1, pos2) {
//   return [pos1.x - pos2.x, pos1.y - pos2.y];
// }
//
// var buildPaylaod = function(event, end) {
//   var centroid = (end) ? undefined : getCentroid(event.targetPointerList);
//
//   return {
//     scale: (end) ? undefined :
//       getDistance(event.targetPointerList [0], event.targetPointerList [1]) /
//       __init_distance,
//     rotation: (end) ? undefined :
//       getAngle(event.targetPointerList [0], event.targetPointerList [1]) -
//       __init_angle,
//     translation: (end) ? undefined : getTranslate(centroid, __init_centroid),
//     nbPointers: event.nbPointers,
//     pointerList: event.pointerList,
//     targetPointerList: event.targetPointerList,
//     centroid: centroid,
//     changedPointerList: event.changedPointerList,
//   };
// };
//
// var _gesture_follow = false;
// var gestureStartListener = function(event, listener) {
//   if (event.targetPointerList.length < 2) return;
//   event.preventDefault();
//
//   if (!_gesture_follow) {
//     __init_distance =
//       getDistance(event.targetPointerList [0], event.targetPointerList [1]);
//     __init_angle =
//       getAngle(event.targetPointerList [0], event.targetPointerList [1]);
//
//     var comp = event.targetPointerList[0].target._comp_;
//     __init_pos = getElementAbsolutePosition(event.targetPointerList[0].target, true);
// //    init_pos = init_pos.matrixTransform (comp.getParentCTM ());
//
//     __init_centroid = getCentroid(event.targetPointerList);
//
//     document.addEventListener(POINTER_EVENTS.POINTER_MOVE, gestureChangeListener);
//     document.addEventListener(POINTER_EVENTS.POINTER_UP, gestureEndListener);
//     document.addEventListener(POINTER_EVENTS.POINTER_CANCEL, gestureEndListener);
//     createCustomEvent(GESTURE_EVENTS.GESTURE_START, event.target, buildPaylaod(event));
//     _gesture_follow = true;
//   } else {
//     createCustomEvent(GESTURE_EVENTS.GESTURE_CHANGE, event.target, buildPaylaod(event));
//   }
// };
//
// var gestureChangeListener = function(event) {
//   event.preventDefault();
//
//   pointerMoveHandler(event, function(event) {
//     // bug with Android stock browser which does not generate POINTER_END event
//     // when a finger is removed and an other finger is still touching the screen.
//     // Then during the POINTER_MOVE event, test if a gesture is still possible,
//     // otherwise remove bindings.
//     if (event.targetPointerList.length < 2) {
//       document.removeEventListener(POINTER_EVENTS.POINTER_MOVE, gestureChangeListener);
//       document.removeEventListener(POINTER_EVENTS.POINTER_END, gestureEndListener);
//       document.removeEventListener(POINTER_EVENTS.POINTER_CANCEL, gestureEndListener);
//       _gesture_follow = false;
//       createCustomEvent(GESTURE_EVENTS.GESTURE_END, event.target, buildPaylaod(event, true));
//     } else {
//       createCustomEvent(GESTURE_EVENTS.GESTURE_CHANGE, event.target, buildPaylaod(event));
//     }
//   });
// };
//
// var gestureEndListener = function(event) {
//   event.preventDefault();
//
//   pointerEndHandler(event, function(event) {
//     if (event.targetPointerList.length < 2) {
//       document.removeEventListener(POINTER_EVENTS.POINTER_MOVE, gestureChangeListener);
//       document.removeEventListener(POINTER_EVENTS.POINTER_END, gestureEndListener);
//       document.removeEventListener(POINTER_EVENTS.POINTER_CANCEL, gestureEndListener);
//       _gesture_follow = false;
//       createCustomEvent(GESTURE_EVENTS.GESTURE_END, event.target, buildPaylaod(event, true));
//     } else {
//       createCustomEvent(GESTURE_EVENTS.GESTURE_CHANGE, event.target, buildPaylaod(event));
//     }
//   });
// };
//
// function buildGestureList(evt) {
//   evt.centroid = { x: evt.pageX, y: evt.pageY };
//   evt.translation = getTranslate(evt.centroid, __init_centroid);
//   evt.pointerList = [
//     new Pointer(evt, PointerTypes.TOUCH, MOUSE_ID),
//   ];
//   evt.targetPointerList = evt.pointerList;
//   evt.nbPointers = 1;
// }
//
// var gestureIOSStartListener = function(event, listener) {
//   __init_centroid = { x: event.pageX, y: event.pageY };
//   buildGestureList(event);
//   listener(event);
// };
//
// var gestureIOSChangeListener = function(event, listener) {
//   buildGestureList(event);
//   listener(event);
// };
//
// var gestureIOSEndListener = function(event, listener) {
//   buildGestureList(event);
//   listener(event);
// };
//
// function touchToGestureListenerAdd(node, type: GESTURE_EVENTS, func, binding) {
//   var target_id = (binding.listener) ? binding.listener.id : undefined;
//   switch (type) {
//     case GESTURE_EVENTS.GESTURE_START:
//       binding.gesture_handler =
//         function(e) {
//           pointerStartHandler(e, gestureStartListener, target_id)
//         };
//       node.addEventListener(POINTER_EVENTS.POINTER_DOWN, binding.gesture_handler);
//       binding.handler = func;
//
//       return true;
//       break;
//
//     case GESTURE_EVENTS.GESTURE_CHANGE:
//     case GESTURE_EVENTS.GESTURE_END:
//       binding.handler = func;
//       return true;
//       break;
//   }
//
//   return false;
// }
//
// function gestureEventListenerAdd(node, type: GESTURE_EVENTS, func, binding) {
//   var target_id = (binding.listener) ? binding.listener.id : undefined;
//   switch (type) {
//     case GESTURE_EVENTS.GESTURE_START:
//       binding.handler = (e) => gestureIOSStartListener(e, func, target_id);
//       return true;
//
//     case GESTURE_EVENTS.GESTURE_CHANGE:
//       binding.handler = (e) => gestureIOSChangeListener(e, func, target_id);
//       return true;
//
//     case GESTURE_EVENTS.GESTURE_END:
//       binding.handler = (e) => gestureIOSEndListener(e, func, target_id);
//       return true;
//   }
//
//   return false;
// }
//
// export const manageGestureListenerAdd =
//   (support.gestures || support.msGestures) ? gestureEventListenerAdd : touchToGestureListenerAdd;
//
// function touchToGestureListenerRemove(node, type: GESTURE_EVENTS, binding) {
//   var target_id = (binding.listener) ? binding.listener.id : undefined;
//   switch (type) {
//     case GESTURE_EVENTS.GESTURE_START:
//       node.removeEventListener(POINTER_EVENTS.POINTER_DOWN, binding.gesture_handler, target_id);
//
//       return true;
//       break;
//
//     case GESTURE_EVENTS.GESTURE_CHANGE:
//     case GESTURE_EVENTS.GESTURE_END:
//       return true;
//       break;
//   }
//
//   return false;
// }
//
// function gestureListenerRemove(node, type: GESTURE_EVENTS, binding) {
//   switch (type) {
//     case GESTURE_EVENTS.GESTURE_START:
//     case GESTURE_EVENTS.GESTURE_CHANGE:
//     case GESTURE_EVENTS.GESTURE_END:
//       return true;
//       break;
//   }
//
//   return false;
// }
//
// export const manageGestureListenerRemove =
//   (support.gestures || support.msGestures) ? gestureListenerRemove : touchToGestureListenerRemove;
//
