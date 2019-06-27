
const push$1 = (e, t) => {
  e[e.length] = t
};
function getProps() {
  const n = 100;
  const [pos, center, texCoord, index] = [
    [],
    [],
    [],
    []
  ];
  for (let e = 0; e < n; e++) {
    for (let t = 0; t < n; t++) {
      const [c, i] = [e / n, (e + 1) / n];
      const [f, u] = [t / n, (t + 1) / n];
      const [l, p] = [c + i / 2, f + u / 2];
      const E = .5;
      push$1(pos, c - E);
      push$1(pos, f - E);
      push$1(pos, i - E);
      push$1(pos, f - E);
      push$1(pos, i - E);
      push$1(pos, u - E);
      push$1(pos, c - E);
      push$1(pos, u - E);
      push$1(texCoord, c);
      push$1(texCoord, f);
      push$1(texCoord, i);
      push$1(texCoord, f);
      push$1(texCoord, i);
      push$1(texCoord, u);
      push$1(texCoord, c);
      push$1(texCoord, u);
      push$1(center, l - E);
      push$1(center, p - E);
      push$1(center, l - E);
      push$1(center, p - E);
      push$1(center, l - E);
      push$1(center, p - E);
      push$1(center, l - E);
      push$1(center, p - E);
      const h = (e * n + t) * 4;
      push$1(index, h);
      push$1(index, h + 1);
      push$1(index, h + 2);
      push$1(index, h);
      push$1(index, h + 2);
      push$1(index, h + 3)
    }
  }

  return {
    pos,
    center,
    texCoord,
    index,
  }
}

export const initBuffers = gl => {
  const props = getProps();
  console.log(props)
  
  let positions = props.pos;
  let texCoords = props.texCoord;

  let index = props.index;

  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  const texCoordBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texCoords), gl.STATIC_DRAW);

  const center = props.center;
  const centerBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, centerBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(center), gl.STATIC_DRAW);

  const indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint32Array(index), gl.STATIC_DRAW);

  return {
    position: positionBuffer,
    texCoord: texCoordBuffer,
    index: indexBuffer,
    center: centerBuffer
  }
}