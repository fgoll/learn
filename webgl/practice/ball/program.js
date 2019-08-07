import { initShaders } from '../libs/shader.js';

const vertexShader = `
  attribute vec4 pos;
  attribute vec4 color;

  uniform mat4 modelViewMat;
  uniform mat4 projectionMat;

  varying highp vec4 vColor;

  void main() {
    gl_Position = projectionMat * modelViewMat * pos;
    vColor = vec4(gl_Position.x,gl_Position.y,gl_Position.z,0.8);
    
  }
`;

const fragmentShader = `
  varying highp vec4 vColor;

  void main() {
    gl_FragColor = vColor;
  }
`;

export const initProgramInfo = gl => {
  const program = initShaders(gl, vertexShader, fragmentShader);

  return {
    program,
    attribLocations: {
      pos: gl.getAttribLocation(program, 'pos'),
      color: gl.getAttribLocation(program, 'color')
    },
    uniformLocations: {
      projectionMat: gl.getUniformLocation(program, 'projectionMat'),
      modelViewMat: gl.getUniformLocation(program, 'modelViewMat')
    }
  }
}