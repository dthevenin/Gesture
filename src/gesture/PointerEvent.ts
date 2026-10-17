import { isFunction } from "vs_utils";
import { PointerEventType } from "./POINTER_EVENTS";

type Binding = {
  target: HTMLElement;
  type: PointerEventType;
  listener: any;
  handler?: EventListenerOrEventListenerObject;
}

/**
 * Option 2: Replace addEventListener with a custom version.
 */
export function addPointerListener (node: HTMLElement, type: PointerEventType, listener: EventListenerOrEventListenerObject, useCapture = false) {
  if (!type) return;
  
  if (!listener) {
    throw new Error("addPointerListener no listener");
  }
  var func = listener;
  if (!isFunction (listener)) {
    func = listener.handleEvent;
    if (isFunction (func)) func = func.bind (listener);
  }

  node.addEventListener (type, listener, useCapture);

  // if (getBindingIndex (node, type, listener) !== -1) {
  //   throw new Error("addPointerListener binding already existing");
  // }

  // if (!listener.__event_listeners) listener.__event_listeners = [];

  // const binding = {
  //   target: node,
  //   type: type,
  //   listener: listener
  // };
  // listener.__event_listeners.push (binding);

  // if (!managePointerListenerAdd (node, type, func, binding)) {
  //   if (!manageGestureListenerAdd (node, type, func, binding))
  //   {
  //     binding.handler = func;
  //   }
  // }

  // node.addEventListener (type, binding.handler, useCapture);
}

export function removePointerListener (node: HTMLElement, type: PointerEventType, listener: EventListenerOrEventListenerObject, useCapture = false){
  if (!type) return;
  
  if (!listener) {
    throw new Error("removePointerListener no listener");
  }

  node.removeEventListener (type, listener, useCapture);


  // const index = getBindingIndex (node, type, listener);
  // if (index === -1)
  // {
  //   throw new Error("removePointerListener no binding");
  //   return;
  // }
  // const binding = listener.__event_listeners [index];
  // listener.__event_listeners.splice(index, 1);

  // if (!managePointerListenerRemove (node, type, binding))
  // {
  //   if (!manageGestureListenerRemove (node, type, binding))
  //   {}
  // }

  // node.removeEventListener (type, binding.handler, useCapture);
}
