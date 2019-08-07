
const push = (arr, x) => { arr[arr.length] = x }

const getProps = () => {
  let [positions, indices, colors] = [[], [], []]
  const latitudeBands = 30;
  const longitudeBands = 30;
  const color = [0.4, 0.4, 1.0, 1.0];
    
  const radius = 1;

  for (let i = 0; i <= latitudeBands; i ++) {
    const theta = i * Math.PI / latitudeBands;
    const sinTheta = Math.sin(theta);
    const cosTheta = Math.cos(theta);

    for (let j = 0; j <= longitudeBands; j ++) {
      colors = colors.concat(color, color, color, color)

      const phi = j * 2 * Math.PI / longitudeBands;
      const sinPhi = Math.sin(phi);
      const cosPhi = Math.cos(phi);

      const x = radius * cosPhi * sinTheta;
      const y = radius * cosTheta;
      const z = radius * sinPhi * sinTheta;

      push(positions, x);
      push(positions, y);
      push(positions, z);
    }
  }

  for (let i = 0; i < latitudeBands; i ++) {
    for (let j = 0; j < longitudeBands; j ++) {
      const A = i * (longitudeBands + 1) + j;
      const B = A + longitudeBands + 1;
      const C = A + 1;
      const D = B + 1;

      push(indices, A);
      push(indices, B);
      push(indices, C);

      push(indices, B);
      push(indices, D);
      push(indices, C);
    }
  }

  return {
    positions,
    indices,
    colors
  }
}

export const initBuffers = gl => {
  const props = getProps();

  const { positions, indices, colors } = props;
  console.log(positions)
  console.log(indices)
  console.log(colors)

  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  const indiceBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indiceBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint32Array(indices), gl.STATIC_DRAW);

  const colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

  return {
    positionBuffer,
    indiceBuffer,
    colorBuffer
  }
}