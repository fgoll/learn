import { create, translate, rotate, lookAt, perspective } from '../libs/mat4.js'

export const draw = (gl, programInfo, buffers) => {

  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  // 开启隐藏面消除(隐藏面消除的前提是正确设置可视空间)
  // 清空颜色和深度缓冲区
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  const { pos, color } = programInfo.attribLocations
  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.positionBuffer)

  gl.vertexAttribPointer(pos, 3, gl.FLOAT, false, 0, 0)
  gl.enableVertexAttribArray(pos)

  // gl.bindBuffer(gl.ARRAY_BUFFER, buffers.colorBuffer)
  // gl.vertexAttribPointer(color, 4, gl.FLOAT, false, 0, 0)
  // gl.enableVertexAttribArray(color)

  const { uniformLocations } = programInfo

  const projectionMat = create();
  perspective(projectionMat, Math.PI / 6, 1, .1, 100);


  const modelViewMat = create();
  lookAt(modelViewMat, [0, 3, -5], [0, 0, 0], [0, 1, 0])
  const delta = Math.PI / 2;
  rotate(modelViewMat, modelViewMat, delta, [1, 1, 0]);

  
  gl.uniformMatrix4fv(uniformLocations.modelViewMat, false, modelViewMat);
  gl.uniformMatrix4fv(uniformLocations.projectionMat, false, projectionMat);

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indiceBuffer);
  gl.drawElements(gl.TRIANGLES, 5400, gl.UNSIGNED_INT, 0)
  // gl.drawArrays(gl.POINTS, 0, 36)÷
}