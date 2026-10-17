declare let EVENT_SUPPORT_TOUCH: boolean;
declare const POINTER_EVENTS: {
    /**
     * Start pointer event (mousedown, touchstart, )
     * @name vs.POINTER_START
     * @type {String}
     * @const
     */
    POINTER_START: string;
    /**
     * Move pointer event (mousemove, touchmove, )
     * @name vs.POINTER_MOVE
     * @type {String}
     * @const
     */
    POINTER_MOVE: string;
    /**
     * End pointer event (mouseup, touchend, )
     * @name vs.POINTER_END
     * @type {String}
     * @const
     */
    POINTER_END: string;
    /**
     * Cancel pointer event (mouseup, touchcancel, )
     * @name vs.POINTER_CANCEL
     * @type {String}
     * @const
     */
    POINTER_CANCEL: string;
};
type PointerEventType = typeof POINTER_EVENTS[keyof typeof POINTER_EVENTS];
declare const isPointerEventType: (type: string) => type is PointerEventType;

declare enum GESTURE_EVENTS {
    GESTURE_START = "gesturestart",
    GESTURE_CHANGE = "gesturechange",
    GESTURE_END = "gestureend"
}

/**
 * Option 2: Replace addEventListener with a custom version.
 */
declare function addPointerListener(node: HTMLElement, type: PointerEventType, listener: EventListenerOrEventListenerObject, useCapture?: boolean): void;
declare function removePointerListener(node: HTMLElement, type: PointerEventType, listener: EventListenerOrEventListenerObject, useCapture?: boolean): void;

export { EVENT_SUPPORT_TOUCH, GESTURE_EVENTS, POINTER_EVENTS, addPointerListener, isPointerEventType, removePointerListener };
export type { PointerEventType };
