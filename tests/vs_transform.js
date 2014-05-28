(function(){ 
 var vs = this.vs, util = vs.util;

var
  CSSMatrix = (vs && vs.CSSMatrix),
  HTMLElement = (window && window.HTMLElement);

/*****************************************************************
 *                Transformation methods
 ****************************************************************/
 
/**
 *  Move the view in x, y.
 * 
 * @param x {int} translation over the x axis
 * @param y {int} translation over the y axis
 */
function translate (x, y)
{
  if (this._vs_node_tx === x && this._vs_node_ty === y) { return; }
  
  this._vs_node_tx = x;
  this._vs_node_ty = y;
  
  applyTransformation (this);
};

/**
 *  Rotate the view about the horizontal and vertical axes.
 *  <p/>The angle units is radians.
 * 
 * @param r {float} rotion angle
 */
function rotate (r)
{
  if (this._vs_node_r === r) { return; }
  
  this._vs_node_r = r;
  
  applyTransformation (this);
};

/**
 *  Scale the view
 *  <p/>The scale is limited by a max and min scale value.
 * 
 * @param s {float} scale value
 */
function scale (s)
{    
  if (this._vs_node_s === s) { return; }

  this._vs_node_s = s;
  
  applyTransformation (this);
};

/**
 *  Define a new transformation matrix, using the transformation origin 
 *  set as parameter.
 *
 * @param {vs.Point} origin is a object reference a x and y position
 */
function setNewTransformOrigin (origin)
{
  if (!origin) { return; }
//    if (!util.isNumber (origin.x) || !util.isNumber (origin.y)) { return; }
  if (!this._vs_node_origin) this._vs_node_origin = [0, 0];

  // Save current transform into a matrix
  var matrix = new CSSMatrix ();
  matrix = matrix.translate
    (this._vs_node_origin [0], this._vs_node_origin [1], 0);
  matrix = matrix.translate (this._vs_node_tx, this._vs_node_ty, 0);
  matrix = matrix.rotate (0, 0, this._vs_node_r);
  matrix = matrix.scale (this._vs_node_s, this._vs_node_s, 1);
  matrix = matrix.translate
    (-this._vs_node_origin [0], -this._vs_node_origin [1], 0);

  if (!this._vs_transform) this._vs_transform = matrix;
  {
    this._vs_transform = matrix.multiply (this._vs_transform);
    delete (matrix);
  }
  
  // Init a new transform space
  this._vs_node_tx = 0;
  this._vs_node_ty = 0;
  this._vs_node_s = 1;
  this._vs_node_r = 0;
  
  this._vs_node_origin = [origin.x, origin.y];
};


/**
 *  Remove all previous transformations set for this view
 */
function clearTransformStack ()
{
  if (this._vs_transform) delete (this._vs_transform);
  this._vs_transform = undefined;
};

/**
 *  Return the current transform matrix apply to this graphic Object.
 *
 * @return {CSSMatrix} the current transform matrix
 */
function getCTM ()
{
  var matrix = new CSSMatrix (), transform, matrix_tmp;
  if (!this._vs_node_origin) this._vs_node_origin = [0, 0];
  
  // apply current transformation
  matrix = matrix.translate (this._vs_node_origin [0], this._vs_node_origin [1], 0);
  matrix = matrix.translate (this._vs_node_tx, this._vs_node_ty, 0);
  matrix = matrix.rotate (0, 0, this._vs_node_r);
  matrix = matrix.scale (this._vs_node_s, this._vs_node_s, 1);
  matrix = matrix.translate (-this._vs_node_origin [0], -this._vs_node_origin [1], 0);    

  
  // apply previous transformations and return the matrix
  if (this._vs_transform) return matrix.multiply (this._vs_transform);
  else return matrix;
};

/**
 *  Returns the current transform combination matrix generate by the
 *  hierarchical parents of this graphic Object.
 *  Its returns the multiplication of the parent's CTM and parent of parent's
 *  CTM etc.
 *  If the component has no parent it returns the identity matrix.
 * 
 * @return {CSSMatrix} the current transform matrix
 */
function getParentCTM ()
{
  
  function multiplyParentTCM (parent)
  {
    // no parent return identity matrix
    if (!parent) return new CSSMatrix ();
    // apply parent transformation matrix recurcively 
    return multiplyParentTCM (parent.parentNode).multiply (parent.vsGetCTM ());
  }
  
  return multiplyParentTCM (this.parentNode);
};

/**
 */
function applyTransformation (node)
{
  var matrix = node.vsGetCTM ();
  
  util.setElementTransform (node, matrix.toString ());
  delete (matrix);
};

util.extend (HTMLElement.prototype, {
  _vs_node_tx:                  0,
  _vs_node_ty:                  0,
  _vs_node_s:              1,
  _vs_node_r:             0,
  vsTranslate:                   translate,
  vsRotate:                      rotate,
  vsScale:                       scale,
  vsSetNewTransformOrigin:       setNewTransformOrigin,
  vsClearTransformStack:         clearTransformStack,
  vsGetCTM:                      getCTM,
  vsGetParentCTM:                getParentCTM
});
}).call(this);
