
import { create, translate, rotate, perspective } from '../libs/mat4.js'

function enableBuffer(gl, index, num, buffer) {
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.vertexAttribPointer(index, num, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(index);
}

export function draw(gl, programInfo, buffers) {
  gl.clearColor(1.0, 1.0, 1.0, 1.0);

  gl.enable(gl.DEPTH_TEST);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  const fov = Math.PI / 6;
  const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;

  const projectionMat = create();
  perspective(projectionMat, fov, aspect, 0.1, 100.0);

  const modelViewMat = create();
  translate(modelViewMat, modelViewMat, [-0.0, 0.0, -20.0]);

  const delta = Math.PI / 4;
  rotate(modelViewMat, modelViewMat, delta, [1, 1, 0]);

  const { pos, color } = programInfo.attribLocations;
  
  enableBuffer(gl, pos, 3, buffers.vertex);

  enableBuffer(gl, color, 3, buffers.color);

  const { uniformLocations } = programInfo;

  gl.uniformMatrix4fv(uniformLocations.projectionMat, false, projectionMat);
  gl.uniformMatrix4fv(uniformLocations.modelViewMat, false, modelViewMat);

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);
  gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0)

}