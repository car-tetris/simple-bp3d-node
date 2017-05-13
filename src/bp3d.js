const ROTATION = {
  HWD: 'HWD',
  WHD: 'WHD',
  HDW: 'HDW',
  DHW: 'DHW',
  DWH: 'DWH',
  WDH: 'WDH'
};

const AXIS = {
  w: 'w',
  h: 'h',
  d: 'd',
  W: 'w',
  H: 'h',
  D: 'd'
};

const defaultPivot = { h: 0, w: 0, d: 0 };

const unpacked = [];

function putItem (bin, item, pivot) {
  item.pos = pivot;

  const rotations = Object.keys(ROTATION);

  for (var i = 0; i < rotations.length; i++) {
    item.rot = ROTATION[rotations[i]];
    const dim = getDimension(item);

    if (bin.w < pivot.w + dim.w ||
        bin.h < pivot.h + dim.h ||
        bin.d < pivot.d + dim.d) {
      continue;
    }

    const intersects = bin.items.some(binItem =>
      intersect(binItem, item)
    );

    if (!intersects) {
      bin.items.push(item);
      return true;
    }
  }

  return false;
}

function getDimension (item) {
  switch (item.rot) {
    case ROTATION.WHD:
      return { h: item.w, w: item.h, d: item.d };
    case ROTATION.HWD:
      return { h: item.h, w: item.w, d: item.d };
    case ROTATION.HDW:
      return { h: item.h, w: item.d, d: item.w };
    case ROTATION.DHW:
      return { h: item.d, w: item.h, d: item.w };
    case ROTATION.DWH:
      return { h: item.d, w: item.w, d: item.h };
    case ROTATION.WDH:
      return { h: item.w, w: item.d, d: item.h };
    default:
      return item;
  }
}

function rectIntersect (i1, i2, x, y) {
  const dim1 = getDimension(i1);
  const dim2 = getDimension(i2);

  const cx1 = i1[x] + dim1[x] / 2;
  const cy1 = i1[y] + dim1[y] / 2;
  const cx2 = i2[x] + dim2[x] / 2;
  const cy2 = i2[y] + dim2[y] / 2;

  const ix = Math.max(cx1, cx2) - Math.min(cx1, cx2);
  const iy = Math.max(cy1, cy2) - Math.min(cy1, cy2);

  return ix < (dim1[x] + dim2[x]) / 2 && iy < (dim1[y] + dim2[y]) / 2;
}

function intersect (i1, i2) {
  return rectIntersect(i1, i2, AXIS.W, AXIS.H) &&
         rectIntersect(i1, i2, AXIS.H, AXIS.D) &&
         rectIntersect(i1, i2, AXIS.W, AXIS.D);
}

// Sorted items
function packToBin (bin, items) {
  if (!putItem(bin, items[0], defaultPivot)) {
    return items;
  }

  // Exclude first item
  for (let i = 1; i < items.length; i++) {
    const item = items[i];

    let fitted = false;

    const axis = Object.keys(AXIS);

    lookup:
    for (let j = 0; j < axis.length; j++) {
      for (let k = 0; k < bin.items.length; k++) {
        const binItem = bin.items[k];

        let pv;
        switch (AXIS[axis[j]]) {
          case AXIS.H:
            pv = { h: binItem.pos.h + binItem.h, w: binItem.pos.w, d: binItem.pos.d };
            break;
          case AXIS.W:
            pv = { h: binItem.pos.h, w: binItem.pos.w + binItem.w, d: binItem.pos.d };
            break;
          case AXIS.D:
            pv = { h: binItem.pos.h, w: binItem.pos.w, d: binItem.pos.d + binItem.d };
            break;
          default:
            pv = { h: binItem.pos.h, w: binItem.pos.w, d: binItem.pos.d };
            break;
        }

        if (putItem(bin, item, pv)) {
          fitted = true;
          break lookup;
        }
      }
    }

    if (!fitted) {
      unpacked.push(item);
    }
  }
}

function compareItem (i1, i2) {
  const vol1 = i1.h * i1.w * i1.d;
  const vol2 = i2.h * i2.w * i2.d;

  return vol1 - vol2;
}

function volume (dim) {
  return dim.h * dim.w * dim.d;
}

function pack (bin, _items) {
  unpacked.length = 0;
  const items = _items.sort(compareItem);

  packToBin(bin, items);

  const loadedPackageVol = bin.items.map(item => volume(item)).reduce((prev, curr) => prev + curr);

  const load = loadedPackageVol / volume(bin);

  return {
    bin: bin,
    items: items,
    load: load,
    unpacked: unpacked
  };
}

module.exports = pack;
module.exports.ROTATION = ROTATION;
module.exports.AXIS = AXIS;
