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
   }
  return false;
};

function pointerStart (e)
{
  if (e.targetPointerList.length === 1 && !this._binding_)
  {
    vs.addPointerListener (document, vs.POINTER_MOVE, this);
    vs.addPointerListener (document, vs.POINTER_END, this);
    this._binding_ = true;
    var pointer = e.targetPointerList [0];
    
    this._start_pos = [pointer.pageX, pointer.pageY];
    this.vsSetNewTransformOrigin ({x: 0, y: 0});
  }
  else if (this._binding)
  {
    vs.removePointerListener (document, vs.POINTER_MOVE, this);
    vs.removePointerListener (document, vs.POINTER_END, this);
    this._binding_ = false;
  }
};

function pointerMove (e)
{
  if (e.targetPointerList.length !== 1) return;
  var pointer = e.targetPointerList [0];
  
  this.vsTranslate (
    pointer.pageX - this._start_pos [0], 
    pointer.pageY - this._start_pos [1]
  );

  update_debug (e.targetPointerList, e.changedPointerList, false);
};

function pointerEnd (e)
{
  if (this._binding_)
  {
    vs.removePointerListener (document, vs.POINTER_MOVE, this);
    vs.removePointerListener (document, vs.POINTER_END, this);
    this._binding_ = false;
  }
  update_debug (null, null, true);
};