import Grid from "./grid"
import {Feature} from "./mazegen"

const computeTile = function (grid, random, x, y) {
  let v = grid.get(x, y)
  const tile = v * (
    grid.getDefault(x, y - 1, 1) // N 1
    | grid.getDefault(x + 1, y, 1) << 1 // E 2
    | grid.getDefault(x, y + 1, 1) << 2 // S 4
    | grid.getDefault(x - 1, y, 1) << 3 // W 8
  )
  let variant = random.next() < 0.25
  if (variant && (tile === 3 || tile === 9 || tile === 11)) {
    return tile - 1
  }
  return tile
}

export const tileFill = function (tileGrid, mazeGrid, roomSize, random) {
  let floor = 0
  let wall = 1
  let tmpGrid = new Grid(tileGrid.width, tileGrid.height)
  tmpGrid.fill(0, 0, tmpGrid.width, tmpGrid.height, wall)
  for (let my = 0, mh = mazeGrid.height; my < mh; my++) {
    for (let mx = 0, mw = mazeGrid.width; mx < mw; mx++) {
      let features = mazeGrid.get(mx, my)
      if (features === 0) continue
      let doorSize = Math.floor(roomSize / 3)
      let tx = mx * roomSize
      let ty = my * roomSize
      tmpGrid.fill(tx + 1, ty + 1,
        roomSize - 2, roomSize - 2,
        floor)
      if ((features & Feature.NorthDoor) !== 0) {
        tmpGrid.fill(tx + 1 + doorSize, ty,
          doorSize, 1,
          floor)
      }
      if ((features & Feature.NorthWall) !== 0) {
        tmpGrid.fill(tx + 1, ty,
          roomSize - 2, 1,
          floor)
      }
      if ((features & Feature.EastDoor) !== 0) {
        tmpGrid.fill(tx + roomSize - 1, ty + 1 + doorSize,
          1, doorSize,
          floor)
      }
      if ((features & Feature.EastWall) !== 0) {
        tmpGrid.fill(tx + roomSize - 1, ty + 1,
          1, roomSize - 2,
          floor)
      }
      if ((features & Feature.SouthDoor) !== 0) {
        tmpGrid.fill(tx + 1 + doorSize, ty + roomSize - 1,
          doorSize, 1,
          floor)
      }
      if ((features & Feature.SouthWall) !== 0) {
        tmpGrid.fill(tx + 1, ty + roomSize - 1,
          roomSize - 2, 1,
          floor)
      }
      if ((features & Feature.WestDoor) !== 0) {
        tmpGrid.fill(tx, ty + 1 + doorSize,
          1, doorSize,
          floor)
      }
      if ((features & Feature.WestWall) !== 0) {
        tmpGrid.fill(tx, ty + 1,
          1, roomSize - 2,
          floor)
      }
    }
  }
  for (let y = 0, th = tileGrid.height; y < th; y++) {
    for (let x = 0, tw = tileGrid.width; x < tw; x++) {
      tileGrid.set(x, y, computeTile(tmpGrid, random, x, y))
    }
  }
}
