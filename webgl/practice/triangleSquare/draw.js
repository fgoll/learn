import { create, translate, rotate, perspective } from '../libs/mat4.js'

export const draw = (gl, programInfo, buffers) => {
  const { pos, color } = programInfo.attribLocations;
  
  const fov = Math.PI / 6;
  const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;

  const projectionMat = create();
  perspective(projectionMat, fov, aspect, 0.1, 100.0);

  const modelViewMat = create();
  translate(modelViewMat, modelViewMat, [0.0, 0.0, -20.0]);


  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.trianglePos);
  gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(pos);

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.triangleColor);
  gl.vertexAttribPointer(color, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(color);

  const { uniformLocations } = programInfo;
  gl.uniformMatrix4fv(uniformLocations.projectionMat, false, projectionMat);
  gl.uniformMatrix4fv(uniformLocations.modelViewMat, false, modelViewMat);

  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 3); 

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.squarePos);
  gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(pos);

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.squareColor);
  gl.vertexAttribPointer(color, 4, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(color);

  translate(modelViewMat, modelViewMat, [-2.0, 0.0, 0.0]);

  gl.uniformMatrix4fv(uniformLocations.projectionMat, false, projectionMat);
  gl.uniformMatrix4fv(uniformLocations.modelViewMat, false, modelViewMat);

  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4); 
}