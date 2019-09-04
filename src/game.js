import { routine, Random } from "./utils"
import Grid from "./grid"
import { Feature, generate, shiftFeature } from "./mazegen"
import Swipe from "./swipe"
import TileImage from "../assets/tiles.png"
import SpritesImage from "../assets/sprites.png"

const Param = {
  // width and height of rooms in pixels
  ROOM_SIZE: 5,
  // larger scale for bigger pixels
  SCALE: 32,
  ITERATIONS: 12
}

const random = new Random(window.location.hash.substr(1))

const computeTile = function(grid, x, y) {
  let v = grid.get(x, y)
  return v * (
    grid.getDefault(x, y - 1, 1) // N 1
    | grid.getDefault(x + 1, y, 1) << 1 // E 2
    | grid.getDefault(x, y + 1, 1) << 2 // S 4
    | grid.getDefault(x - 1, y, 1) << 3 // W 8
  )
}

const generateTiles = function (tileGrid, mazeGrid) {
  let floor = 0
  let wall = 1
  let tmpGrid = new Grid(tileGrid.width, tileGrid.height)
  tmpGrid.fill(0, 0, tmpGrid.width, tmpGrid.height, wall)
  for (let my = 0, mh = mazeGrid.height; my < mh; my++) {
    for (let mx = 0, mw = mazeGrid.width; mx < mw; mx++) {
      let features = mazeGrid.get(mx, my)
      if (features === 0) continue
      let doorSize = Math.floor(Param.ROOM_SIZE / 3)
      let tx = mx * Param.ROOM_SIZE
      let ty = my * Param.ROOM_SIZE
      tmpGrid.fill(tx + 1, ty + 1,
        Param.ROOM_SIZE - 2, Param.ROOM_SIZE - 2,
        floor)
      if ((features & Feature.NorthDoor) !== 0) {
        tmpGrid.fill(tx + 1 + doorSize, ty,
          doorSize, 1,
          floor)
      }
      if ((features & Feature.NorthWall) !== 0) {
        tmpGrid.fill(tx + 1, ty,
          Param.ROOM_SIZE - 2, 1,
          floor)
      }
      if ((features & Feature.EastDoor) !== 0) {
        tmpGrid.fill(tx + Param.ROOM_SIZE - 1, ty + 1 + doorSize,
          1, doorSize,
          floor)
      }
      if ((features & Feature.EastWall) !== 0) {
        tmpGrid.fill(tx + Param.ROOM_SIZE - 1, ty + 1,
          1, Param.ROOM_SIZE - 2,
          floor)
      }
      if ((features & Feature.SouthDoor) !== 0) {
        tmpGrid.fill(tx + 1 + doorSize, ty + Param.ROOM_SIZE - 1,
          doorSize, 1,
          floor)
      }
      if ((features & Feature.SouthWall) !== 0) {
        tmpGrid.fill(tx + 1, ty + Param.ROOM_SIZE - 1,
          Param.ROOM_SIZE - 2, 1,
          floor)
      }
      if ((features & Feature.WestDoor) !== 0) {
        tmpGrid.fill(tx, ty + 1 + doorSize,
          1, doorSize,
          floor)
      }
      if ((features & Feature.WestWall) !== 0) {
        tmpGrid.fill(tx, ty + 1,
          1, Param.ROOM_SIZE - 2,
          floor)
      }
    }
  }
  for (let y = 0, th = tileGrid.height; y < th; y++) {
    for (let x = 0, tw = tileGrid.width; x < tw; x++) {
      tileGrid.set(x, y, computeTile(tmpGrid, x, y))
    }
  }
}

const offscreenCanvas = function(width, height) {
    try {
        return new OffscreenCanvas(width, height)
    }
    catch {
        const canvas = document.createElement("canvas")
        canvas.width = width
        canvas.height = height
        return canvas
    }
}

const loadImage = function (src) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.addEventListener("load", () => resolve(img))
    img.addEventListener("error", (err) => reject(err))
    img.src = src
  })
}

const MoveNorth = {offset: {x: 0, y: -1}, mask: Feature.North}
const MoveEast = {offset: {x: 1, y: 0}, mask: Feature.East}
const MoveSouth = {offset: {x: 0, y: 1}, mask: Feature.South}
const MoveWest = {offset: {x: -1, y: 0}, mask: Feature.West}

export default class Game {
  constructor(canvas) {
    this.canvas = canvas
    this.canvas.width = window.innerWidth
    this.canvas.height = window.innerHeight
    this.ctx = this.canvas.getContext("2d")
    this.bgCanvas = offscreenCanvas(this.canvas.width, this.canvas.height)
    this.mazeGrid = new Grid(
      parseInt(canvas.width / Param.SCALE / Param.ROOM_SIZE),
      parseInt(canvas.height / Param.SCALE / Param.ROOM_SIZE))
    this.tileGrid = new Grid(
      parseInt(canvas.width / Param.SCALE),
      parseInt(canvas.height / Param.SCALE),
    )
    this.player = {health: 3}
    window.addEventListener("keydown", (e) => this.handleInput(e, e.key))
    let swipe = new Swipe(canvas)
    swipe.onSwipe = (e, swipeDir) => this.handleInput(e, swipeDir)

    Promise.all([loadImage(TileImage), loadImage(SpritesImage)])
      .then((images) => {
        this.tiles = images[0]
        this.tileSize = this.tiles.naturalWidth / 4
        this.sprites = images[1]
        this.spriteSize = 8
        this.reset()
      })
  }
  reset(newHash) {
    if (newHash)
      window.history.pushState(null, null, "#" + random.getState())
    this.mazeGrid.reset()
    this.tileGrid.reset()
    const centerX = parseInt(this.mazeGrid.width / 2)
    const centerY = parseInt(this.mazeGrid.height / 2)
    generate(this.mazeGrid, random, centerX, centerY, 0, Param.ITERATIONS)
    generateTiles(this.tileGrid, this.mazeGrid)
    this.drawMaze(this.bgCanvas.getContext("2d"))
    this.player.pos = {x: centerX, y: centerY, dir: 1}
    this.generateTreasures()
    this.draw()
  }
  generateTreasures() {
    this.numTreasures = 3 + Math.round(random.next() * 9)
    this.treasures = []
    let check = 1000
    while (this.treasures.length < this.numTreasures && check > 0) {
      check--
      let treasure = {
        x: parseInt(random.next() * this.mazeGrid.width),
        y: parseInt(random.next() * this.mazeGrid.height)
      }
      if (this.mazeGrid.get(treasure.x, treasure.y) !== 0) {
        this.treasures.push(treasure)
      }
    }
  }
  playerMoveBy(deltaVector) {
    let initX = this.player.pos.x
    let initY = this.player.pos.y
    this.player.pos.dir = deltaVector.x >= 0 ? 1 : -1
    routine(500, function (delta) {
      this.player.pos.x = initX + deltaVector.x * delta
      this.player.pos.y = initY + deltaVector.y * delta
      if (delta === 1) {
        this.checkGemsCollected()
      }
      this.draw()
    }.bind(this))
  }
  playerMove(dir) {
    let target = {
      x: this.player.pos.x + dir.offset.x,
      y: this.player.pos.y + dir.offset.y
    }
    let roomFrom = this.mazeGrid.get(this.player.pos.x, this.player.pos.y)
    let roomTo = this.mazeGrid.get(target.x, target.y)
    let canMoveTo = (roomTo & shiftFeature(dir.mask)) !== 0
    let canMoveFrom = (roomFrom & dir.mask) !== 0
    if (canMoveFrom && canMoveTo) {
      this.playerMoveBy(dir.offset)
    }
  }
  checkGemsCollected() {
    this.treasures = this.treasures.filter(function (gem) {
      return !(gem.x === this.player.pos.x && gem.y === this.player.pos.y)
    }.bind(this))
    if (this.treasures.length === 0) {
      this.reset(true)
    }
  }
  handleInput(e, input) {
    switch (input) {
      case "SwipeUp":
      case "ArrowUp":
        this.playerMove(MoveNorth)
        e.preventDefault()
        break;
      case "SwipeDown":
      case "ArrowDown":
        this.playerMove(MoveSouth)
        e.preventDefault()
        break;
      case "SwipeLeft":
      case "ArrowLeft":
        this.playerMove(MoveWest)
        e.preventDefault()
        break;
      case "SwipeRight":
      case "ArrowRight":
        this.playerMove(MoveEast)
        e.preventDefault()
        break;
    }
  }
  draw() {
    this.ctx.drawImage(this.bgCanvas, 0, 0)
    this.drawTreasures(this.ctx)
    this.drawPlayer(this.ctx)
  }
  drawMaze(ctx) {
    ctx.save()
    ctx.scale(
      parseInt(Param.SCALE / this.tileSize),
      parseInt(Param.SCALE / this.tileSize))
    ctx.imageSmoothingEnabled = false
    for (let y = 0, th = this.tileGrid.height; y < th; y++) {
      for (let x = 0, tw = this.tileGrid.width; x < tw; x++) {
        this.drawTile(ctx, x, y, this.tileGrid.get(x, y))
      }
    }
    ctx.restore()
  }
  drawTile (ctx, x, y, tileId) {
    let sx = (tileId % 4) * this.tileSize
    let sy = Math.floor(tileId / 4) * this.tileSize
    ctx.drawImage(this.tiles,
      sx, sy, this.tileSize, this.tileSize,
      x * this.tileSize, y * this.tileSize,
      this.tileSize, this.tileSize)
  }
  drawPlayer(ctx) {
    const scale = Math.floor(Param.SCALE / this.spriteSize)
    const offsetMult = Param.ROOM_SIZE * this.spriteSize
    const offset = Param.ROOM_SIZE * this.spriteSize * 0.5 - this.spriteSize * 0.5
    ctx.save()
    ctx.scale(scale, scale)
    ctx.translate(
      this.player.pos.x * offsetMult + offset,
      this.player.pos.y * offsetMult + offset)
    ctx.imageSmoothingEnabled = false
    ctx.scale(this.player.pos.dir, 1)
    ctx.drawImage(this.sprites,
      0, 0, this.spriteSize, this.spriteSize,
      0, 0,
      this.spriteSize * this.player.pos.dir, this.spriteSize)
    ctx.restore()
  }
  drawTreasures(ctx) {
    const scale = Math.floor(Param.SCALE / this.spriteSize)
    const offsetMult = Param.ROOM_SIZE * this.spriteSize
    const offset = Param.ROOM_SIZE * this.spriteSize * 0.5 - this.spriteSize * 0.5
    ctx.save()
    ctx.scale(scale, scale)
    ctx.imageSmoothingEnabled = false
    for (var i = 0, n = this.treasures.length; i < n; i++) {
      ctx.drawImage(this.sprites,
        8, 0, this.spriteSize, this.spriteSize,
        this.treasures[i].x * offsetMult + offset, this.treasures[i].y * offsetMult + offset,
        this.spriteSize, this.spriteSize)
    }
    ctx.restore()
  }
}
