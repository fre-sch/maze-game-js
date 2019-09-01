import {clamp} from "./utils"

export default class Grid {
  constructor(width, height) {
    this.width = width
    this.height = height
    this.cells = new Array(this.width * this.height).fill(0)
  }

  reset () {
    this.cells = new Array(this.width * this.height).fill(0)
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
}
