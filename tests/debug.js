function update_debug (pointers, pointersToRemove, clear, angle)
{
  return;
  // remove debug info
  if (clear)
  {
    if (!this._debugs) return;
    for (var key in this._debugs)
    {
      var div = this._debugs [key];
      document.body.removeChild (div);
    }
    this._debugs = {};
    return;
  }
  if (!this._debugs) this._debugs = {};
  
  var x = 0, y = 0 , nb_pointer = pointers.length, _pointers_ = {};
  for (var index = 0; index < nb_pointer; index++)
  {
    var pointer = pointers [index];
    var div = this._debugs [pointer.identifier];
    if (!div)
    {
      div = document.createElement ('div');
      div.className = '__debug__pointer';
      this._debugs [pointer.identifier] = div;
      document.body.appendChild (div, this.view);
    }
    vs.util.setElementPos (div, pointer.pageX - 15, pointer.pageY - 15);
    _pointers_ [pointer.identifier] = true;
   
    x += pointer.pageX;
    y += pointer.pageY;
  }
  
  var barycentre = this._debugs ['barycentre'];
  if (!barycentre)
  {
    barycentre = document.createElement ('div');
    barycentre.className = '__debug__barycentre';
    this._debugs ['barycentre'] = barycentre;
    document.body.appendChild (barycentre, this.view);
  }
  vs.util.setElementPos (barycentre, x / nb_pointer - 10, y / nb_pointer - 10);
  if (vs.util.isNumber (angle)) barycentre.innerHTML = Math.floor (angle);
  else barycentre.innerHTML = "";
  
  // remove old pointers trace
  for (var index = 0; index < pointersToRemove.length; index++)
  {
    var pointer = pointersToRemove [index];
    if (_pointers_ [pointer.identifier]) return;
    
    var div = this._debugs [pointer.identifier];
    if (div)
    {
      document.body.removeChild (div);
      delete (this._debugs [pointer.identifier]);
    }
  }
};
