import { initProgramInfo } from './program.js';
import { initBuffers } from './buffers.js';
import { draw } from './draw.js';

const gl = document.getElementById('webgl').getContext('webgl');

const programInfo = initProgramInfo(gl);
const buffers = initBuffers(gl);
draw(gl, programInfo, buffers);