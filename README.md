### Inspiration

This package is a rewrite of https://github.com/gedex/bp3d. Though it only supports
one bin, and not multiple.

### Example
```
const bp3d = require('../bp3d.js');

const items = [
  { h: 2, w: 2, d: 1, pos: {}, rot: bp3d.ROTATION.HWD },
  { h: 2, w: 2, d: 1, pos: {}, rot: bp3d.ROTATION.HWD },
  { h: 2, w: 2, d: 3, pos: {}, rot: bp3d.ROTATION.HWD },
  { h: 3, w: 3, d: 2, pos: {}, rot: bp3d.ROTATION.HWD },
  { h: 2, w: 3, d: 2, pos: {}, rot: bp3d.ROTATION.HWD }
];

const unpackedBin = { h: 5, w: 5, d: 5, items: [] };

const {
  bin,
  unpacked
} = bp3d(unpackedBin, items);

console.log('bin', bin);
console.log('unpacked', unpacked);
```
