
const push = (arr, x) => { arr[arr.length] = x }

// 生成将图像等分为 n x n 矩形的数据
const getProps = n => {
  const [positions, centers, texCoords, indices] = [[], [], [], []]

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      const [x0, x1] = [i / n, (i + 1) / n] // 每个粒子的 x 轴左右坐标
      const [y0, y1] = [j / n, (j + 1) / n] // 每个粒子的 y 轴上下坐标
      const [xC, yC] = [x0 + x1 / 2, y0 + y1 / 2] // 每个粒子的中心二维坐标
      const h = 0.5 // 将中心点从 (0.5, 0.5) 平移到原点的偏移量

      // positions in (x, y), z = 0
      push(positions, x0 - h); push(positions, y0 - h)
      push(positions, x1 - h); push(positions, y0 - h)
      push(positions, x1 - h); push(positions, y1 - h)
      push(positions, x0 - h); push(positions, y1 - h)

      // texCoords in (x, y)
      push(texCoords, x0); push(texCoords, y0)
      push(texCoords, x1); push(texCoords, y0)
      push(texCoords, x1); push(texCoords, y1)
      push(texCoords, x0); push(texCoords, y1)

      // center in (x, y), z = 0
      push(centers, xC - h); push(centers, yC - h)
      push(centers, xC - h); push(centers, yC - h)
      push(centers, xC - h); push(centers, yC - h)
      push(centers, xC - h); push(centers, yC - h)

      // indices
      const k = (i * n + j) * 4
      push(indices, k); push(indices, k + 1); push(indices, k + 2)
      push(indices, k); push(indices, k + 2); push(indices, k + 3)
    }
  }

  // 着色器内的变量名是单数形式，将复数形式的数组名与其对应起来
  return {
    pos: positions,
    center: centers,
    texCoord: texCoords,
    index: indices
  }
}

export const initBuffers = gl => {
  const props = getProps(100);
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