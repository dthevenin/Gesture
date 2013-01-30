// canvasDrawr originally from Mike Taylr  http://miketaylr.com/
// Tim Branyen massaged it: http://timbranyen.com/
// and i did too. with multi touch.
// and boris fixed some touch identifier stuff to be more specific.
// and then added pointer events.

var CanvasDrawr = function(options) {
  // grab canvas element
  var canvas = document.getElementById(options.id),
  ctxt = canvas.getContext("2d");

  canvas.style.width = '100%'
  canvas.width = canvas.offsetWidth;
  canvas.style.width = '';

  // set props from options, but the defaults are for the cool kids
  ctxt.lineWidth = options.size || Math.ceil(Math.random() * 35);
  ctxt.lineCap = options.lineCap || "round";
  ctxt.pX = undefined;
  ctxt.pY = undefined;
  _move_listening = false;

  var lines = [,,];
//  var offset = $(canvas).offset();
  var offset = {top: 8, left: 8}

  var self = {

    //bind click events
    init: function() {
      //set pX and pY from first click
      vs.addPointerListener (canvas, vs.POINTER_START, self.preDraw, false);
    },

    preDraw: function(event) {

      var pointer, pointers = event.pointerList;
      for (var i = 0; i < event.nbPointers; i++)
      {
        pointer = pointers [i];

        var id  = pointer.identifier || 0, 
        colors  = ["red", "green", "yellow", "blue", "magenta", "orangered"],
        mycolor = colors[Math.floor(Math.random() * colors.length)];

        lines[id] = {
          x     : pointer.pageX - offset.left, 
          y     : pointer.pageY - offset.top, 
          color : mycolor
        };
      };

      event.preventDefault();
      if (!_move_listening)
      {
        vs.addPointerListener (canvas, vs.POINTER_MOVE, self.draw, false );
        vs.addPointerListener (canvas, vs.POINTER_END, self.pointerEnd, false );        
        _move_listening = true;
      }
    },

    draw: function(event) {
      var e = event, hmm = {};
      var pointers = event.pointerList;

      for (var i = 0; i < event.nbPointers; i++)
      {
        pointer = pointers [i];
        var id = pointer.identifier || 0,
        moveX = pointer.pageX - offset.left - lines[id].x,
        moveY = pointer.pageY - offset.top - lines[id].y;

        var ret = self.move(id, moveX, moveY);
        lines[id].x = ret.x;
        lines[id].y = ret.y;
      };

      event.preventDefault();
    },

    move: function(i, changeX, changeY) {
      ctxt.strokeStyle = lines[i].color;
      ctxt.beginPath();
      ctxt.moveTo(lines[i].x, lines[i].y);

      ctxt.lineTo(lines[i].x + changeX, lines[i].y + changeY);
      ctxt.stroke();
      ctxt.closePath();

      return { x: lines[i].x + changeX, y: lines[i].y + changeY };
    },
    
    pointerEnd : function (event) { 
      touches = event.pointerList;
      if (event.nbPointers === 0)
      {
        vs.removePointerListener (canvas, vs.POINTER_MOVE, self.draw, false );
        vs.removePointerListener (canvas, vs.POINTER_END, self.pointerEnd, false );
        _move_listening = false;
      }
    }


  };

  return self.init();
};


function init ()
{
  new CanvasDrawr({id:"example", size: 15 });
}

