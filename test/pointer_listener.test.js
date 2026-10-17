import assert from 'node:assert/strict';
import { addPointerListener, removePointerListener, POINTER_EVENTS } from '../dist/vs_gesture.es.js';

const { POINTER_START, POINTER_END } = POINTER_EVENTS;

describe('addPointerListener', () => {
  let node;
  beforeEach(() => { node = new EventTarget(); });

  it('calls a function listener when the event fires', () => {
    const received = [];
    addPointerListener(node, POINTER_START, (e) => received.push(e));

    const event = new Event(POINTER_START);
    node.dispatchEvent(event);

    assert.deepEqual(received, [event]);
  });

  it('calls handleEvent on an object listener with the object as this', () => {
    const listener = {
      calls: 0,
      handleEvent() { this.calls++; },
    };
    addPointerListener(node, POINTER_START, listener);

    node.dispatchEvent(new Event(POINTER_START));

    assert.equal(listener.calls, 1);
  });

  it('only fires for the registered type', () => {
    let calls = 0;
    addPointerListener(node, POINTER_START, () => calls++);

    node.dispatchEvent(new Event(POINTER_END));

    assert.equal(calls, 0);
  });

  it('does nothing when type is empty', () => {
    let calls = 0;
    addPointerListener(node, '', () => calls++);

    node.dispatchEvent(new Event(''));

    assert.equal(calls, 0);
  });

  it('throws when no listener is given', () => {
    assert.throws(
      () => addPointerListener(node, POINTER_START, undefined),
      { message: 'addPointerListener no listener' },
    );
  });

  it('passes useCapture through to addEventListener', () => {
    const calls = [];
    const spy = { addEventListener: (...args) => calls.push(args) };
    const fn = () => {};

    addPointerListener(spy, POINTER_START, fn, true);
    addPointerListener(spy, POINTER_END, fn);

    assert.deepEqual(calls, [[POINTER_START, fn, true], [POINTER_END, fn, false]]);
  });
});

describe('removePointerListener', () => {
  let node;
  beforeEach(() => { node = new EventTarget(); });

  it('stops a previously added listener from firing', () => {
    let calls = 0;
    const fn = () => calls++;
    addPointerListener(node, POINTER_START, fn);
    removePointerListener(node, POINTER_START, fn);

    node.dispatchEvent(new Event(POINTER_START));

    assert.equal(calls, 0);
  });

  it('only removes the given listener', () => {
    const calls = [];
    const a = () => calls.push('a');
    const b = () => calls.push('b');
    addPointerListener(node, POINTER_START, a);
    addPointerListener(node, POINTER_START, b);
    removePointerListener(node, POINTER_START, a);

    node.dispatchEvent(new Event(POINTER_START));

    assert.deepEqual(calls, ['b']);
  });

  it('must match the capture flag used when adding', () => {
    let calls = 0;
    const fn = () => calls++;
    addPointerListener(node, POINTER_START, fn, true);
    removePointerListener(node, POINTER_START, fn, false);

    node.dispatchEvent(new Event(POINTER_START));
    assert.equal(calls, 1);

    removePointerListener(node, POINTER_START, fn, true);
    node.dispatchEvent(new Event(POINTER_START));
    assert.equal(calls, 1);
  });

  it('does nothing when type is empty', () => {
    const calls = [];
    const spy = { removeEventListener: (...args) => calls.push(args) };

    removePointerListener(spy, '', () => {});

    assert.deepEqual(calls, []);
  });

  it('throws when no listener is given', () => {
    assert.throws(
      () => removePointerListener(node, POINTER_START, null),
      { message: 'removePointerListener no listener' },
    );
  });
});
