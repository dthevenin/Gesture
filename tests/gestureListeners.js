/**
 * @private
 * @function
 */
function handleEvent (e)
{
  switch (e.type)
  {
    case vs_gesture.GESTURE_START:
      this.gestureStart (e);
      break;
      
    case vs_gesture.GESTURE_CHANGE:
      this.gestureChange (e);
      break;
      
    case vs_gesture.GESTURE_END:
      this.gestureEnd (e);
      break;
   }
  return false;
};

function gestureStart (e)
{
  vs_gesture.addPointerListener (document, vs_gesture.GESTURE_CHANGE, this);
  vs_gesture.addPointerListener (document, vs_gesture.GESTURE_END, this);
  this.vsSetNewTransformOrigin (e.centroid);

  //update_debug (e.targetPointerList, e.changedPointerList, false, e.rotation);
};

function gestureChange (e)
{
  //update_debug (e.targetPointerList, e.changedPointerList, false, e.rotation);
  
  this.vsScale (e.scale);
  this.vsRotate (e.rotation);
  this.vsTranslate (e.translation[0], e.translation[1]);
};

function gestureEnd (e)
{
  //update_debug (null, null, true);
  vs_gesture.removePointerListener (document, vs_gesture.GESTURE_END, this);
  vs_gesture.removePointerListener (document, vs_gesture.GESTURE_CHANGE, this);
};
  

