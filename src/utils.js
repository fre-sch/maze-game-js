export const clamp = function (val, min, max) {
  return Math.max(min, Math.min(max, val))
}

export const not = function (value) {
  // javascript bitwise not (~value) results in sign bit flip
  // making value a signed value, make it unsigned
  return ~value >>> 0
}

export const rotl = function (val, shiftCount, size) {
  // rotate bits left by shiftCount and wrap at size
  shiftCount = shiftCount % size
  let sizeMask = (1 << size) - 1
  return (
    (val << shiftCount) & sizeMask
    | (val & sizeMask) >> (size - shiftCount)
  )
}

// function frameFn(delta)
// delta is a double from 0 to 1
export const routine = function (durationMs, frameFn) {
  let initial = null
  let frameFnWrapper;
  frameFnWrapper = function(timestamp) {
    if (initial === null) initial = timestamp
    let delta = (timestamp - initial) / durationMs
    if (delta < 1) {
      frameFn(delta)
      window.requestAnimationFrame(frameFnWrapper)
    }
    else {
      frameFn(1)
    }
  }
  window.requestAnimationFrame(frameFnWrapper)
}


// https://stackoverflow.com/questions/521295/seeding-the-random-number-generator-in-javascript
export const xmur3 = function (str) {
  for (var i = 0, h = 1779033703 ^ str.length; i < str.length; i++)
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353),
      h = h << 13 | h >>> 19;
  return function () {
    h = Math.imul(h ^ h >>> 16, 2246822507);
    h = Math.imul(h ^ h >>> 13, 3266489909);
    return (h ^= h >>> 16) >>> 0;
  }
}

// https://stackoverflow.com/questions/521295/seeding-the-random-number-generator-in-javascript
export class Mulberry32 {
  constructor(seed) {
    this.state = seed
  }
  next() {
    let t = this.state += 0x6D2B79F5
    t = Math.imul(t ^ t >>> 15, t | 1)
    t ^= t + Math.imul(t ^ t >>> 7, t | 61)
    return ((t ^ t >>> 14) >>> 0) / 4294967295
  }
}

// Seedable random with state
export class Random {
  constructor(initSeed) {
    if (initSeed !== undefined) {
      initSeed = parseInt(initSeed, 36)
    }
    if (!initSeed) {
      initSeed = (new Date()).toISOString()
      initSeed = xmur3(initSeed)()
    }
    this.generator = new Mulberry32(initSeed)
  }
  next() {
    return this.generator.next()
  }
  getState() {
    return this.generator.state.toString(36)
  }
}
