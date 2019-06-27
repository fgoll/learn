/**检查数字是否为2的指数
  * @param {Number} value - 要检查的值
  * @return {Boolean}
  */
const isPowerOf2 = value => (value & (value - 1)) === 0;

export const initTexture = (gl, url) => new Promise((resolve) => {
  const texture = gl.createTexture(); 
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  gl.bindTexture(gl.TEXTURE_2D, texture);

  const image = new Image();

  image.onload = () => {
    if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    }else {
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    }
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    resolve(texture)
  }

  image.src = url;
})