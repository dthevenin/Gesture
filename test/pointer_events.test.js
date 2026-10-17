import assert from 'node:assert/strict';

const BUNDLE = '../dist/vs_gesture.es.js';

// Touch support is detected when the module is evaluated, so each scenario
// imports a fresh copy of the bundle (a distinct query string bypasses the
// ESM cache) with the globals it needs.
async function loadWith(globals, tag) {
  const saved = {};
  for (const key of Object.keys(globals)) {
    saved[key] = Object.getOwnPropertyDescriptor(globalThis, key);
    Object.defineProperty(globalThis, key, { value: globals[key], configurable: true, writable: true });
  }
  try {
    return await import(`${BUNDLE}?${tag}`);
  } finally {
    for (const key of Object.keys(globals)) {
      if (saved[key]) Object.defineProperty(globalThis, key, saved[key]);
      else delete globalThis[key];
    }
  }
}

describe('POINTER_EVENTS', () => {
  describe('without touch support (no document)', () => {
    let mod;
    before(async () => { mod = await import(BUNDLE); });

    it('does not detect touch support', () => {
      assert.equal(mod.EVENT_SUPPORT_TOUCH, false);
    });

    it('maps to pointer events', () => {
      assert.deepEqual(mod.POINTER_EVENTS, {
        POINTER_START: 'pointerdown',
        POINTER_MOVE: 'pointermove',
        POINTER_END: 'pointerup',
        POINTER_CANCEL: 'pointercancel',
      });
    });
  });

  describe('with document.createTouch', () => {
    let mod;
    before(async () => {
      mod = await loadWith({ document: { createTouch() {} } }, 'createTouch');
    });

    it('detects touch support', () => {
      assert.equal(mod.EVENT_SUPPORT_TOUCH, true);
    });

    it('maps to touch events', () => {
      assert.deepEqual(mod.POINTER_EVENTS, {
        POINTER_START: 'touchstart',
        POINTER_MOVE: 'touchmove',
        POINTER_END: 'touchend',
        POINTER_CANCEL: 'touchcancel',
      });
    });
  });

  describe('user agent detection', () => {
    const touchAgents = {
      iPhone: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)',
      iPad: 'Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X)',
      Android: 'Mozilla/5.0 (Linux; Android 14; Pixel 8)',
      BlackBerry: 'Mozilla/5.0 (BlackBerry; U; BlackBerry 9900)',
    };

    for (const [name, userAgent] of Object.entries(touchAgents)) {
      it(`detects touch support for ${name}`, async () => {
        const mod = await loadWith(
          { document: {}, window: { navigator: { userAgent } } },
          `ua-${name}`,
        );
        assert.equal(mod.EVENT_SUPPORT_TOUCH, true);
        assert.equal(mod.POINTER_EVENTS.POINTER_START, 'touchstart');
      });
    }

    it('does not detect touch support for a desktop browser', async () => {
      const mod = await loadWith(
        { document: {}, window: { navigator: { userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0)' } } },
        'ua-desktop',
      );
      assert.equal(mod.EVENT_SUPPORT_TOUCH, false);
      assert.equal(mod.POINTER_EVENTS.POINTER_START, 'pointerdown');
    });
  });
});

describe('isPointerEventType', () => {
  let isPointerEventType;
  before(async () => { ({ isPointerEventType } = await import(BUNDLE)); });

  it('accepts every active pointer event type', () => {
    for (const type of ['pointerdown', 'pointermove', 'pointerup', 'pointercancel']) {
      assert.equal(isPointerEventType(type), true, type);
    }
  });

  it('rejects types not in the active mapping', () => {
    for (const type of ['touchstart', 'click', 'mousedown', 'gesturestart', '', 'POINTERDOWN']) {
      assert.equal(isPointerEventType(type), false, type);
    }
  });
});

describe('GESTURE_EVENTS', () => {
  it('exposes the gesture event names', async () => {
    const { GESTURE_EVENTS } = await import(BUNDLE);
    assert.equal(GESTURE_EVENTS.GESTURE_START, 'gesturestart');
    assert.equal(GESTURE_EVENTS.GESTURE_CHANGE, 'gesturechange');
    assert.equal(GESTURE_EVENTS.GESTURE_END, 'gestureend');
  });
});
