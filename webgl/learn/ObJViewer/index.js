var VSHADER_SOURCE = `
  attribute vec4 a_Position;
  attribute vec4 a_Color;
  attribute vec4 a_Normal;
  uniform mat4 u_MvpMatrix;
  uniform mat4 u_NormalMatrix;
  varying vec4 v_Color;
  void main() {
    vec3 lightDirection = vec3(-0.35, 0.35, 0.87);
    gl_Position = u_MvpMatrix * a_Position;
    vec3 normal = normalize(vec3(u_NormalMatrix * a_Normal));
    float nDotL = max(dot(normal, lightDirection), 0.0);
    v_Color = vec4(a_Color.rgb * nDotL, a_Color.a);
  }
`;

var  FSHADER_SOURCE = `
  #ifdef GL_ES
  precision mediump float;
  #endif
  varying vec4 v_Color;
  void main() {
    gl_FragColor = v_Color;
  }
`;

function main() {
  var canvas = document.getElementById('webgl');

  var gl = getWebGLContext(canvas);
  
  if (!gl) {
    debugger
  }

  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    debugger
  }

  gl.clearColor(0.2, 0.2, 0.2, 1.0);
  gl.enable(gl.DEPTH_TEST);

  var program = gl.program;
  program.a_Position = gl.getAttribLocation(program, 'a_Position');
  program.a_Normal = gl.getAttribLocation(program, 'a_Normal');
  program.a_Color = gl.getAttribLocation(program, 'a_Color');
  program.u_MvpMatrix = gl.getUniformLocation(program, 'u_MvpMatrix');
  program.u_NormalMatrix = gl.getUniformLocation(program, 'u_NormalMatrix');

  if (program.a_Position < 0 ||  program.a_Normal < 0 || program.a_Color < 0 ||
    !program.u_MvpMatrix || !program.u_NormalMatrix) {
    debugger
  }

  var model = initVertexBuffers(gl, program);
  if (!model) {
    debugger
  }

  var viewProjMatrix = new Matrix4();
  viewProjMatrix.setPerspective(30.0, canvas.width/canvas.height, 1.0, 5000.0);
  viewProjMatrix.lookAt(0.0, 500.0, 200.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0);

  readOBJFile('cube2.obj', gl, model, 60, true);

  var currentAngle = 0.0;
  var tick = function() {
    currentAngle = animate(currentAngle);
    draw(gl, gl.program, currentAngle, viewProjMatrix, model);
    requestAnimationFrame(tick, canvas);
  }
  tick();
}

function initVertexBuffers(gl, program) {
  var o = new Object();
  o.vertexBuffer = createEmptyArrayBuffer(gl, program.a_Position, 3, gl.FLOAT);
  o.normalBuffer = createEmptyArrayBuffer(gl, program.a_Normal, 3, gl.FLOAT);
  o.colorBuffer = createEmptyArrayBuffer(gl, program.a_Color, 4, gl.FLOAT);
  o.indexBuffer = gl.createBuffer();
  if (!o.vertexBuffer || !o.normalBuffer || !o.colorBuffer || !o.indexBuffer) { return null; }

  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  return o;
}

function createEmptyArrayBuffer(gl, a_attribute, num, type) {
  var buffer = gl.createBuffer();
  if (!buffer) {
    debugger;
  }
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.vertexAttribPointer(a_attribute, num, type, false, 0, 0);

  gl.enableVertexAttribArray(a_attribute);  // Enable the assignment
  
  return buffer;
}

function readOBJFile(fileName, gl, model, scale, reverse) {
  var request = new XMLHttpRequest();
  request.onreadystatechange = function() {
    if (request.readyState === 4 && request.status !== 404)  {
      onReadOBJFile(request.responseText, fileName, gl, model, scale, reverse);
    }
  }
  request.open('GET', fileName, true);
  request.send();
}

var g_objDoc = null;;
var g_drawingInfo = null;

function onReadOBJFile(fileString, fileName, gl, o, scale, reverse) {
  var objDoc = new OBJDoc(fileName);
  var result = objDoc.parse(fileString, scale, reverse);
  if (!result) {
    g_objDoc = null;
    g_drawingInfo = null;
    debugger
  }
  g_objDoc = objDoc;
}

var g_modelMatrix = new Matrix4();
var g_mvpMatrix = new Matrix4();
var g_normalMatrix = new Matrix4();

function draw(gl, program, angle, viewProjMatrix, model) {
  if (g_objDoc != null && g_objDoc.isMTLComplete()) {
    g_drawingInfo = onReadComplete(gl, model, g_objDoc);
    g_objDoc = null;
  }

  if (!g_drawingInfo) return;

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  g_modelMatrix.setRotate(angle, 1.0, 0.0, 0.0);
  g_modelMatrix.rotate(angle, 0.0, 1.0, 0.0);
  g_modelMatrix.rotate(angle, 0.0, 0.0, 1.0);

  g_normalMatrix.setInverseOf(g_modelMatrix);
  g_normalMatrix.transpose();
  gl.uniformMatrix4fv(program.u_NormalMatrix, false,  g_normalMatrix.elements);

  g_mvpMatrix.set(viewProjMatrix);
  g_mvpMatrix.multiply(g_modelMatrix);
  gl.uniformMatrix4fv(program.u_MvpMatrix, false, g_mvpMatrix.elements);

  // console.log(g_drawingInfo.indices)
  gl.drawElements(gl.TRIANGLES, g_drawingInfo.indices.length, gl.UNSIGNED_SHORT, 0);
}

function onReadComplete(gl, model, objDoc) {
  var drawingInfo = objDoc.getDrawingInfo();

  gl.bindBuffer(gl.ARRAY_BUFFER, model.vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, drawingInfo.vertices, gl.STATIC_DRAW);

  gl.bindBuffer(gl.ARRAY_BUFFER, model.normalBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, drawingInfo.normals, gl.STATIC_DRAW);

  gl.bindBuffer(gl.ARRAY_BUFFER, model.colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, drawingInfo.colors, gl.STATIC_DRAW);

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, drawingInfo.indices, gl.STATIC_DRAW);

  return drawingInfo;
}

var ANGLE_STEP = 30;

var last = Date.now();
function animate(angle) {
  var now = Date.now();
  var elapsed = now - last;
  last = now;
  var newAngle = angle + (ANGLE_STEP * elapsed) / 1000.0;
  return newAngle % 360;
}

main();