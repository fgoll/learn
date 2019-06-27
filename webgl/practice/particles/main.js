import { initProgramInfo } from './program.js';
import { initBuffers } from './buffers.js';
import { draw } from './draw.js';
import { initTexture } from './texture.js'

const gl = document.getElementById('webgl').getContext('webgl');

const programInfo = initProgramInfo(gl);
const buffers = initBuffers(gl);

gl.getExtension("OES_element_index_uint"); 

window.iTime = 0

initTexture(gl, './Group.png').then(texture => {

  function r() {
    draw(gl, programInfo, buffers, texture, iTime);
    requestAnimationFrame(r)
  }
  r()

  document.body.onclick = function() {
    window.iTime = 0

    function t() {
      window.iTime += .1;
      // requestAnimationFrame(t)
      setTimeout(t, 20)
    }
    t()
  }
})

