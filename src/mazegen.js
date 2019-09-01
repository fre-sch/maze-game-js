import { not, rotl } from "./utils"

// enum for room features,
// *_DOOR: room has a door at direction
// *_WALL: room is open at direction
// DOOR and WALL are interleaved so a shift by 4 will result in a feature in
// the opposite direction. Simplified: NorthDoor << 4 == SouthDoor
export const Feature = {
  NorthDoor: 2 ** 0,
  NorthWall: 2 ** 1,
  EastDoor: 2 ** 2,
  EastWall: 2 ** 3,
  SouthDoor: 2 ** 4,
  SouthWall: 2 ** 5,
  WestDoor: 2 ** 6,
  WestWall: 2 ** 7,
  ALL: 256
}
Feature.North = Feature.NorthDoor | Feature.NorthWall
Feature.East = Feature.EastDoor | Feature.EastWall
Feature.South = Feature.SouthDoor | Feature.SouthWall
Feature.West = Feature.WestDoor | Feature.WestWall
Feature.DOOR_MASK = Feature.NorthDoor | Feature.EastDoor | Feature.SouthDoor | Feature.WestDoor
Feature.WALL_MASK = Feature.NorthWall | Feature.EastWall | Feature.SouthWall | Feature.WestWall

// used when testing for rooms at grid coordinates
const OFFSET = [
  { x: 0, y: -1 }, { x: 0, y: -1 }, { x: 1, y: 0 }, { x: 1, y: 0 },
  { x: 0, y: 1 }, { x: 0, y: 1 }, { x: -1, y: 0 }, { x: -1, y: 0 }
]

const offset = function (x, y, dir) {
  return { x: x + OFFSET[dir].x, y: y + OFFSET[dir].y }
}

const shiftFeature = function (features) {
  return rotl(features, 4, 8)
}

const mergeFeatures = function (a, b, dir) {
  // mask is expected to be a single set bit, one of the *_DOOR bits.
  // this is adding the corresponding *_WALL bit
  let mask = dir | rotl(dir, 1, 8)
  b = shiftFeature(b) & mask
  return (a & not(mask) | b)
}

const mergeAdjacent = function (grid, x, y, features) {
  for (let i = 0; i < 8; i += 2) {
    let dir = 1 << i
    let dir1 = 1 << (i + 1)
    let o = offset(x, y, i)
    // if the offset is outside of the grid, remove any connecting features
    // in that direction
    if (!grid.within(o.x, o.y)) {
      features &= not(dir | dir1)
    }
    else {
      let existingFeatures = grid.get(o.x, o.y)
      if (existingFeatures !== 0) {
        features = mergeFeatures(features, existingFeatures, dir)
      }
    }
  }
  return features;
}

const generateFeatures = function (random, previous) {
  let randomDoors = Math.floor(random.next() * Feature.ALL)
  let randomWalls = Math.floor(random.next() * Feature.ALL)
  let doors = (randomDoors & Feature.DOOR_MASK) | (previous & Feature.DOOR_MASK)
  let walls = (randomWalls & Feature.WALL_MASK) | (previous & Feature.WALL_MASK)
  // combine doors and walls
  // shift door bits into wall bits and invert for a mask to not
  // place walls were there are doors
  let door_mask = not(rotl(doors, 1, 8))
  return walls & door_mask | doors
}

export const generate = function (grid, random, x, y, previous, iter) {
  previous = shiftFeature(previous)
  let features = previous
  if (iter > 0) {
    features = generateFeatures(random, previous)
  }
  // first pass merges surrounding opposing features
  features = mergeAdjacent(grid, x, y, features)
  grid.set(x, y, features)
  // second pass recurses if grid position is free
  // and generates more random features
  for (var i = 0; i < 8; i++) {
    let dir = 1 << i
    let o = offset(x, y, i)
    if (!grid.within(o.x, o.y)) {
      continue
    }
    let existingFeatures = grid.get(o.x, o.y)
    let hasFeature = (features & dir) !== 0
    let isNotPrevious = dir !== previous
    let gridIsFree = existingFeatures === 0
    if (hasFeature && isNotPrevious && gridIsFree) {
      generate(grid, random, o.x, o.y, dir, iter - 1)
    }
  }
}
