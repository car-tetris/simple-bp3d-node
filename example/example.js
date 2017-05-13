const bp3d = require('../bp3d.js');

const items = [
  { h: 2, w: 2, d: 1, pos: {}, rot: bp3d.ROTATION.HWD },
  { h: 2, w: 2, d: 1, pos: {}, rot: bp3d.ROTATION.HWD },
  { h: 2, w: 2, d: 3, pos: {}, rot: bp3d.ROTATION.HWD },
  { h: 3, w: 3, d: 2, pos: {}, rot: bp3d.ROTATION.HWD },
  { h: 2, w: 3, d: 2, pos: {}, rot: bp3d.ROTATION.HWD }
];

const bin = { h: 5, w: 5, d: 5, items: [] };

const packed = bp3d(bin, items);

console.log('bin', packed.bin);
//console.log("items", packed.items);
console.log('unpacked', packed.unpacked);
