/**
 * @private
 * @function
 */
function handleEvent (e)
{
  e.stopPropagation ();
  e.preventDefault ();
  
  switch (e.type)
  {
    case vs.POINTER_START:
      this.pointerStart (e);
      break;

    case vs.POINTER_MOVE:
      this.pointerMove (e);
      break;

    case vs.POINTER_END:
      this.pointerEnd (e);
      break;

    case vs.GESTURE_START:
      this.gestureStart (e);
      break;
      
    case vs.GESTURE_CHANGE:
      this.gestureChange (e);
      break;
      
    case vs.GESTURE_END:
      this.gestureEnd (e);
      break;
   }
  return false;
};


function gestureStart (e)
{
  vs.addPointerListener (document, vs.GESTURE_CHANGE, this);
  vs.addPointerListener (document, vs.GESTURE_END, this);
  this.vsSetNewTransformOrigin (e.barycentre);

  update_debug (e.targetPointerList, e.changedPointerList, false, e.rotation);
};

function gestureChange (e)
{
  update_debug (e.targetPointerList, e.changedPointerList, false, e.rotation);
  
  this.vsScale (e.scale);
  this.vsRotate (e.rotation);
  this.vsTranslate (e.translation[0], e.translation[1]);
};

function gestureEnd (e)
{
  update_debug (null, null, true);
  vs.removePointerListener (document, vs.GESTURE_CHANGE, this);
};
  

