export declare let EVENT_SUPPORT_TOUCH: boolean;
export declare const POINTER_EVENTS: {
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
export type PointerEventType = typeof POINTER_EVENTS[keyof typeof POINTER_EVENTS];
export declare const isPointerEventType: (type: string) => type is PointerEventType;
//# sourceMappingURL=POINTER_EVENTS.d.ts.map