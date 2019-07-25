export const initBuffers = (gl) => {
  const trianglePos = [
    0.0, 1.0,
    1.0, -1.0,
    -1.0, -1.0
  ]

  const triangleColors = [
    1.0, 0.0, 0.0, 1.0,
    0.0, 1.0, 0.0, 1.0,
    0.0, 0.0, 1.0, 1.0
  ]

  const squarePos = [
    1.0,  1.0,
    -1.0,  1.0,
    1.0, -1.0,
    -1.0, -1.0,
  ]

  const squareColors = [
    0.5, 0.5, 1.0, 1.0,
    0.5, 0.5, 1.0, 1.0,
    0.5, 0.5, 1.0, 1.0,
    0.5, 0.5, 1.0, 1.0,
  ]

  const trianglePosBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, trianglePosBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(trianglePos), gl.STATIC_DRAW);

  const triangleColorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, triangleColorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleColors), gl.STATIC_DRAW);

  const squarePosBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, squarePosBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(squarePos), gl.STATIC_DRAW);

  const squareColorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, squareColorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(squareColors), gl.STATIC_DRAW);

  return { 
    trianglePos: trianglePosBuffer, 
    triangleColor: triangleColorBuffer, 
    squarePos: squarePosBuffer,
    squareColor: squareColorBuffer
  }
}