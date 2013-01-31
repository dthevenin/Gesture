(function(){function i(a,d,b){this.configureWithEvent(a);this.type=d;this.identifier=b}function r(a,d){var b=[];a.nbPointers=a.touches.length;for(var e=0;e<a.nbPointers;e++){var c=a.touches[e],c=new i(c,l.TOUCH,c.identifier);b.push(c)}a.pointerList=b;b=[];for(e=0;e<a.targetTouches.length;e++)c=a.targetTouches[e],d&&s[c.identifier]!=d||(c=new i(c,l.TOUCH,c.identifier),b.push(c));a.targetPointerList=b;b=[];for(e=0;e<a.changedTouches.length;e++)c=a.changedTouches[e],c=new i(c,l.TOUCH,c.identifier),b.push(c);
a.changedPointerList=b}function z(a,d){var b=[];b.push(new i(a,l.MOUSE,C));d?(a.nbPointers=0,a.pointerList=[],a.targetPointerList=b,a.changedPointerList=b):(a.nbPointers=1,a.pointerList=b,a.targetPointerList=b,a.changedPointerList=[])}function t(a,d){var b=[],e=[],c=a.pointerId,f=g[c];if(d){f?(j[c]=f,delete g[c]):(f=j[c],f||(f=new i(a,a.pointerType,c),j[c]=f));for(c in j)e.push(j[c]);j={}}else f?f.configureWithEvent(a):(f=new i(a,a.pointerType,c),g[c]=f);for(c in g)b.push(g[c]);a.nbPointers=b.length;
a.pointerList=b;b=[];for(c in g)f=g[c],b.push(f);a.targetPointerList=b;a.changedPointerList=e}function D(a,d){z(a);d(a)}function E(a,d){z(a);d(a)}function F(a,d){z(a,!0);d(a)}function G(a,d,b){for(var e,c=a.targetTouches.length,f=0;f<c;f++)e=a.targetTouches[f],s[e.identifier]=b;r(a);d(a)}function H(a,d,b){r(a,b);d(a)}function I(a,d){for(var b,e=a.targetTouches.length,c=0;c<e;c++)b=a.changedTouches[c],s[b.identifier]=void 0;r(a);d(a)}function J(a,d){r(a);d(a,d)}function K(a,d,b){s[a.pointerId]=b;t(a,
!1,b);d(a);0===u&&(document.addEventListener("MSPointerUp",v),document.addEventListener("MSPointerCancel",v));u++}function L(a,d,b){t(a,!1,b);d(a)}function M(a,d){t(a,!0);d(a)}function N(a,d){t(a,!0);d(a)}function A(a,d,b){if(!d||!b||!b.__event_listeners)return-1;for(var e=0;e<b.__event_listeners.length;e++){var c=b.__event_listeners[e];if(c.target===a&&c.type===d&&c.listener===b)return e}return-1}function O(a,d,b,e){var c=e.listener?e.listener.id:void 0;switch(d){case m:return e.handler=function(a){w(a,
b,c)},!0;case n:return e.handler=function(a){x(a,b,c)},!0;case o:return e.handler=function(a){pointerEndHandler(a,b)},!0;case p:return e.handler=function(a){y(a,b)},!0}return!1}"undefined"===typeof exports&&(exports=this);var h=exports.vs,B=h.util,q=!1,k=window.navigator.msPointerEnabled;if("undefined"!=typeof document&&"createTouch"in document)q=!0;else if(k)q=!0;else if("undefined"!=typeof document&&window.navigator&&window.navigator.userAgent&&(-1!==window.navigator.userAgent.indexOf("Android")||
-1!==window.navigator.userAgent.indexOf("BlackBerry")))q=!0;var m,n,o,p;q?(m=k?"MSPointerDown":"touchstart",n=k?"MSPointerMove":"touchmove",o=k?"MSPointerUp":"touchend",p=k?"MSPointerCancel":"touchcancel"):(m="mousedown",n="mousemove",p=o="mouseup");var C=31337;i.prototype.configureWithEvent=function(a){this.pageX=a.pageX;this.pageY=a.pageY;this.clientX=a.clientX;this.clientY=a.clientY;this.target=a.target;this.currentTarget=a.currentTarget};var l={TOUCH:2,PEN:3,MOUSE:4},s=[],g={},j={},u=0,v=function(a){if(a=
g[a.pointerId])j[a.identifier]=a,delete g[a.identifier];u--;0===u&&(document.removeEventListener("MSPointerUp",v),document.removeEventListener("MSPointerCancel",v))},w,x,y;q?k?(w=K,x=L,pointerEndHandler=M,y=N):(w=G,x=H,pointerEndHandler=I,y=J):(w=D,x=E,y=pointerEndHandler=F);h.createCustomEvent=function(a,d,b){var e=document.createEvent("Event");e.initEvent(a,!0,!0);for(var c in b)e[c]=b[c];d.dispatchEvent(e)};h.removePointerListener=function(a,d,b,e){if(b){var c=A(a,d,b);if(-1===c)console.error("removePointerListener no binding");
else{var f=b.__event_listeners[c];b.__event_listeners.remove(c);a:{switch(d){case m:case n:case o:case p:b=!0;break a}b=!1}b||manageGestureListenerRemove(a,d,f);a.removeEventListener(d,f.handler,e);delete f}}else console.error("removePointerListener no listener")};h.addPointerListener=function(a,d,b,e){if(b){var c=b;B.isFunction(b)||(c=b.handleEvent,B.isFunction(c)&&(c=c.bind(b)));if(-1!==A(a,d,b))console.error("addPointerListener binding already existing");else{b.__event_listeners||(b.__event_listeners=
[]);var f={target:a,type:d,listener:b};b.__event_listeners.push(f);!O(a,d,c,f)&&!manageGestureListenerAdd(a,d,c,f)&&(f.handler=c);a.addEventListener(d,f.handler,e)}}else console.error("addPointerListener no listener")};h.PointerTypes=l;h.POINTER_START=m;h.POINTER_MOVE=n;h.POINTER_END=o;h.POINTER_CANCEL=p}).call(this);
