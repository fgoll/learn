import { initShaders } from '../libs/shader.js';

const vertexShader = `
  attribute vec3 pos;
	attribute vec4 color;
	
	uniform mat4 modelViewMat;
	uniform mat4 projectionMat;

	varying vec4 vColor;
	
	void main(void) {
		gl_Position = projectionMat * modelViewMat * vec4(pos, 1.0);
    vColor = color;
	}
`

const fragmentShader = `
precision mediump float;
	
varying vec4 vColor;

void main() {
  gl_FragColor = vColor;
}
`

export const initProgramInfo = (gl) => {
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