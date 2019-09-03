import {clamp} from "./utils"

export default class Grid {
  constructor(width, height, defaultFill=()=>0) {
    this.width = width
    this.height = height
    this.defaultFill = defaultFill
    this.cells = new Array(this.width * this.height).fill(null).map(defaultFill)
  }

  reset () {
    this.cells = new Array(this.width * this.height).fill(null).map(this.defaultFill)
  }

  within (x, y) {
    return x >= 0 && x < this.width && y >= 0 && y < this.height
  }

  set (x, y, value) {
    x = clamp(x, 0, this.width - 1)
    y = clamp(y, 0, this.height - 1)
    this.cells[y * this.width + x] = value
  }

  get (x, y) {
    x = clamp(x, 0, this.width - 1)
    y = clamp(y, 0, this.height - 1)
    return this.cells[y * this.width + x]
  }

  getDefault(x, y, defaultValue) {
    if (!this.within(x, y)) {
      return defaultValue
    }
    return this.cells[y * this.width + x]
  }

  fill(x1, y1, w, h, value) {
    x1 = clamp(x1, 0, this.width - 1)
    y1 = clamp(y1, 0, this.height - 1)
    w = clamp(w, 0, this.width - x1)
    h = clamp(h, 0, this.height - y1)
    for (let y = 0; y < h; ++y) {
      for (let x = 0; x < w; ++x) {
        this.set(x1 + x, y1 + y, value)
      }
    }
  }
}
