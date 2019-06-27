import { create, lookAt, perspective } from '../libs/mat4.js'

export const draw = (gl, programInfo, buffers, texture, iTime) => {

  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  // 开启隐藏面消除(隐藏面消除的前提是正确设置可视空间)
  // 清空颜色和深度缓冲区
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  const { pos, texCoord, center } = programInfo.attribLocations
  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position)

  gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0)
  gl.enableVertexAttribArray(pos)

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.texCoord)
  gl.vertexAttribPointer(texCoord, 2, gl.FLOAT, false, 0, 0)
  gl.enableVertexAttribArray(texCoord)

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.center)
  gl.vertexAttribPointer(center, 2, gl.FLOAT, false, 0, 0)
  gl.enableVertexAttribArray(center)
 
  gl.activeTexture(gl.TEXTURE0)
  gl.bindTexture(gl.TEXTURE_2D, texture)

  const { uniformLocations } = programInfo
  gl.uniform1i(uniformLocations.sampler, 0)

  gl.uniform1f(uniformLocations.iTime, window.iTime)

  const viewMat = create();
  lookAt(viewMat, [0, 0, 5], [0, 0, 0], [0, 1, 0])
  gl.uniformMatrix4fv(uniformLocations.viewMat, false, viewMat);

  const projectionMat = create();
  perspective(projectionMat, Math.PI / 6, 1, .1, 1000);
  gl.uniformMatrix4fv(uniformLocations.projectionMat, false, projectionMat);

  // gl.drawArrays(gl.POINTS,0,4);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.index);
  gl.drawElements(gl.TRIANGLES, 60000, gl.UNSIGNED_INT, 0)
  // gl.drawArrays(gl.POINTS, 0, 36)
}