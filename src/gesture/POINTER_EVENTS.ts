import { isPowerOfTwo } from "vs_utils";

/* touch event messages */
export let EVENT_SUPPORT_TOUCH = false;

if (typeof document != "undefined" && 'createTouch' in document) {
  EVENT_SUPPORT_TOUCH = true;
} else if (typeof document != "undefined" && window.navigator && window.navigator.userAgent){
  if (window.navigator.userAgent.indexOf ('iPhone') !== -1 ||
      window.navigator.userAgent.indexOf ('iPad') !== -1 ||
      window.navigator.userAgent.indexOf ('Android') !== -1 ||
      window.navigator.userAgent.indexOf ('BlackBerry') !== -1)
  {
    EVENT_SUPPORT_TOUCH = true;
  }
}

// export const POINTER_EVENTS = {
//   POINTER_DOWN: 'pointerdown',
//   POINTER_MOVE: 'pointermove',
//   POINTER_UP: 'pointerup',
//   POINTER_OVER: 'pointerover',
//   POINTER_ENTER: 'pointerenter',
//   POINTER_CANCEL: 'pointercancel',
//   POINTER_OUT: 'pointerout',
//   POINTER_LEAVE: 'pointerleave',
// };


export const POINTER_EVENTS = {
  /** 
   * Start pointer event (mousedown, touchstart, )
   * @name vs.POINTER_START
   * @type {String}
   * @const
   */
  POINTER_START: EVENT_SUPPORT_TOUCH ?  'touchstart' : 'pointerdown',

  /** 
   * Move pointer event (mousemove, touchmove, )
   * @name vs.POINTER_MOVE 
   * @type {String}
   * @const
   */
  POINTER_MOVE: EVENT_SUPPORT_TOUCH ?  'touchmove' : 'pointermove',
  /** 
   * End pointer event (mouseup, touchend, )
   * @name vs.POINTER_END 
   * @type {String}
   * @const
   */
  POINTER_END: EVENT_SUPPORT_TOUCH ?  'touchend' : 'pointerup',

  /** 
   * Cancel pointer event (mouseup, touchcancel, )
   * @name vs.POINTER_CANCEL 
   * @type {String}
   * @const
   */
  POINTER_CANCEL: EVENT_SUPPORT_TOUCH ?  'touchcancel' : 'pointercancel',
}

export type PointerEventType = typeof POINTER_EVENTS[keyof typeof POINTER_EVENTS];

export const isPointerEventType = (type: string): type is PointerEventType => {
  return Object.values(POINTER_EVENTS).includes(type as PointerEventType);
}
