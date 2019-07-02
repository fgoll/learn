import { initShaders } from '../libs/shader.js';
const vertexShader = `
precision highp float;
attribute vec4 pos;
attribute vec4 center;
attribute vec2 texCoord;

uniform mat4 projectionMat;
uniform mat4 viewMat;

uniform float iTime;
varying vec2 vTexCoord;
const vec3 camera = vec3(0, 0, 1);
float rand(vec2 co) {
  return fract(sin(dot(co, vec2(12, 7))) * 400.1);
}
// 伪随机数生成器
void main() {
  // 求出粒子相对于相机位置的单位方向向量，并附带上伪随机数的扰动
  vec3 dir = normalize(center.xyz * rand(center.xy) - camera);
  // 沿扰动后的方向，随时间递增偏移量
  vec3 translatedPos = pos.xyz + dir * iTime;
  vec4 mvpPos = projectionMat * viewMat * vec4(translatedPos, 1);
  vTexCoord = texCoord;
  gl_Position = mvpPos;
}`;
const fragmentShader = `
precision highp float;
uniform sampler2D img;
varying highp vec2 vTexCoord;
void main() {
  gl_FragColor = texture2D(img, vTexCoord);
}`;
export const initProgramInfo = gl => {
  const program = initShaders(gl, vertexShader, fragmentShader);
  return {
    program,
    attribLocations: {
      pos: gl.getAttribLocation(program, 'pos'),
      texCoord: gl.getAttribLocation(program, 'texCoord'),
      center: gl.getAttribLocation(program, 'center')
    },
    uniformLocations: {
      sampler: gl.getUniformLocation(program, "img"),
      iTime: gl.getUniformLocation(program, 'iTime'),
      projectionMat: gl.getUniformLocation(program, 'projectionMat'),
      viewMat: gl.getUniformLocation(program, 'viewMat'),
      
    }
  }
}