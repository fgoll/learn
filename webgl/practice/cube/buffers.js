export const initBuffers = gl => {
  // Create a cube
  //    v6----- v5
  //   /|      /|
  //  v1------v0|
  //  | |     | |
  //  | |v7---|-|v4
  //  |/      |/
  //  v2------v3

  var vertices = new Float32Array([ // Vertex coordinates
    1.0, 1.0, 1.0, 
    -1.0, 1.0, 1.0, 
    -1.0, -1.0, 1.0, 
    1.0, -1.0, 1.0, // v0-v1-v2-v3 front
    
    1.0, 1.0, 1.0, 
    1.0, -1.0, 1.0, 
    1.0, -1.0, -1.0,
    1.0, 1.0, -1.0, // v0-v3-v4-v5 right
    
    1.0, 1.0, 1.0, 
    1.0, 1.0, -1.0, 
    -1.0, 1.0, -1.0, 
    -1.0, 1.0, 1.0, // v0-v5-v6-v1 up
    
    -1.0, 1.0, 1.0, 
    -1.0, 1.0, -1.0, 
    -1.0, -1.0, -1.0, 
    -1.0, -1.0, 1.0, // v1-v6-v7-v2 left
    
    -1.0, -1.0, -1.0, 
    1.0, -1.0, -1.0, 
    1.0, -1.0, 1.0, 
    -1.0, -1.0, 1.0, // v7-v4-v3-v2 down
    
    1.0, -1.0, -1.0, 
    -1.0, -1.0, -1.0, 
    -1.0, 1.0, -1.0, 
    1.0, 1.0, -1.0 // v4-v7-v6-v5 back
  ]);

  var vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

  var faceColors = [ // Colors
    [0.4, 0.4, 1.0, 1.0], // v0-v1-v2-v3 front(blue)
    [0.4, 1.0, 0.4, 1.0], // v0-v3-v4-v5 right(green)
    [1.0, 0.4, 0.4, 1.0], // v0-v5-v6-v1 up(red)
    [1.0, 1.0, 0.4, 1.0], // v1-v6-v7-v2 left
    [1.0, 1.0, 1.0, 1.0], // v7-v4-v3-v2 down
    [0.4, 1.0, 1.0, 1.0]  // v4-v7-v6-v5 back
  ];

  var colors = [];

  for (var i = 0; i < faceColors.length; i ++) {
    var c = faceColors[i];
    colors = colors.concat(c, c, c, c);
  }

  var colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

  const indices = [ // Indices of the vertices
    0, 1, 2, 0, 2, 3, // front
    4, 5, 6, 4, 6, 7, // right
    8, 9, 10, 8, 10, 11, // up
    12, 13, 14, 12, 14, 15, // left
    16, 17, 18, 16, 18, 19, // down
    20, 21, 22, 20, 22, 23 // back
  ];

  var indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

  return {
    vertex: vertexBuffer,
    color: colorBuffer,
    indices: indexBuffer
  }

}