define(['exports', 'vs_utils'], (function (exports, vs_utils) { 'use strict';

  exports.EVENT_SUPPORT_TOUCH = false;
  if (typeof document != "undefined" && "createTouch" in document) {
    exports.EVENT_SUPPORT_TOUCH = true;
  } else if (typeof document != "undefined" && window.navigator && window.navigator.userAgent) {
    if (window.navigator.userAgent.indexOf("iPhone") !== -1 || window.navigator.userAgent.indexOf("iPad") !== -1 || window.navigator.userAgent.indexOf("Android") !== -1 || window.navigator.userAgent.indexOf("BlackBerry") !== -1) {
      exports.EVENT_SUPPORT_TOUCH = true;
    }
  }
  const POINTER_EVENTS = {
    /** 
     * Start pointer event (mousedown, touchstart, )
     * @name vs.POINTER_START
     * @type {String}
     * @const
     */
    POINTER_START: exports.EVENT_SUPPORT_TOUCH ? "touchstart" : "pointerdown",
    /** 
     * Move pointer event (mousemove, touchmove, )
     * @name vs.POINTER_MOVE 
     * @type {String}
     * @const
     */
    POINTER_MOVE: exports.EVENT_SUPPORT_TOUCH ? "touchmove" : "pointermove",
    /** 
     * End pointer event (mouseup, touchend, )
     * @name vs.POINTER_END 
     * @type {String}
     * @const
     */
    POINTER_END: exports.EVENT_SUPPORT_TOUCH ? "touchend" : "pointerup",
    /** 
     * Cancel pointer event (mouseup, touchcancel, )
     * @name vs.POINTER_CANCEL 
     * @type {String}
     * @const
     */
    POINTER_CANCEL: exports.EVENT_SUPPORT_TOUCH ? "touchcancel" : "pointercancel"
  };
  const isPointerEventType = (type) => {
    return Object.values(POINTER_EVENTS).includes(type);
  };

  var GESTURE_EVENTS = /* @__PURE__ */ ((GESTURE_EVENTS2) => {
    GESTURE_EVENTS2["GESTURE_START"] = "gesturestart";
    GESTURE_EVENTS2["GESTURE_CHANGE"] = "gesturechange";
    GESTURE_EVENTS2["GESTURE_END"] = "gestureend";
    return GESTURE_EVENTS2;
  })(GESTURE_EVENTS || {});

  function addPointerListener(node, type, listener, useCapture = false) {
    if (!type)
      return;
    if (!listener) {
      throw new Error("addPointerListener no listener");
    }
    var func = listener;
    if (!vs_utils.isFunction(listener)) {
      func = listener.handleEvent;
      if (vs_utils.isFunction(func))
        func = func.bind(listener);
    }
    node.addEventListener(type, listener, useCapture);
  }
  function removePointerListener(node, type, listener, useCapture = false) {
    if (!type)
      return;
    if (!listener) {
      throw new Error("removePointerListener no listener");
    }
    node.removeEventListener(type, listener, useCapture);
  }

  exports.GESTURE_EVENTS = GESTURE_EVENTS;
  exports.POINTER_EVENTS = POINTER_EVENTS;
  exports.addPointerListener = addPointerListener;
  exports.isPointerEventType = isPointerEventType;
  exports.removePointerListener = removePointerListener;

}));
//# sourceMappingURL=vs_gesture.amd.js.map
