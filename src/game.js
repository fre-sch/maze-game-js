import { routine, Random } from "./utils"
import Grid from "./grid"
import EntityGrid from "./entityGrid"
import { Feature, generate, shiftFeature } from "./mazegen"
import Swipe from "./swipe"
import TileImage from "../assets/tiles.png"
import SpritesImage from "../assets/sprites.png"

const Param = {
  // width and height of rooms in tiles
  ROOM_SIZE: 5,
  // width and height of tiles in (scaled) pixels
  TILE_SIZE: 8,
  SPRITE_SIZE: 8,
  // canvas pixel scale
  SCALE: 4,
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

class Gem {
  constructor() {
    this.spriteIndex = 1
    this.type = "gem"
  }
  collect (player) {
    player.gemsCollected += 1
  }
}

class Food {
  constructor() {
    this.spriteIndex = 2
    this.type = "food"
    this.stamina = 30
  }
  collect (player) {
    player.stamina = Math.min(100, player.stamina + this.stamina)
  }
}

export default class Game {
  constructor(canvas) {
    this.canvas = canvas
    this.canvas.width = window.innerWidth - 5
    this.canvas.height = window.innerHeight - 5
    this.widthScaled = this.canvas.width / Param.SCALE
    this.heightScaled = this.canvas.height / Param.SCALE
    this.ctx = this.canvas.getContext("2d")
    this.bgCanvas = offscreenCanvas(this.canvas.width, this.canvas.height)
    this.mazeGrid = new Grid(
      parseInt(this.widthScaled / Param.ROOM_SIZE / Param.TILE_SIZE),
      parseInt(this.heightScaled / Param.ROOM_SIZE / Param.TILE_SIZE))
    this.entityGrid = new EntityGrid(this.mazeGrid.width, this.mazeGrid.height)
    this.tileGrid = new Grid(
      this.mazeGrid.width * Param.ROOM_SIZE,
      this.mazeGrid.height * Param.ROOM_SIZE
    )
    this.player = {stamina: 100, gemsCollected: 0}
    window.addEventListener("keydown", (e) => this.handleInput(e, e.key))
    let swipe = new Swipe(canvas)
    swipe.onSwipe = (e, swipeDir) => this.handleInput(e, swipeDir)

    Promise.all([loadImage(TileImage), loadImage(SpritesImage)])
      .then((images) => {
        this.tiles = images[0]
        this.sprites = images[1]
        this.reset()
      })
  }

  reset(newHash) {
    if (newHash) {
      window.history.pushState(null, null, "#" + random.getState())
    }
    this.mazeGrid.reset()
    this.entityGrid.reset()
    this.tileGrid.reset()
    const centerX = parseInt(this.mazeGrid.width / 2)
    const centerY = parseInt(this.mazeGrid.height / 2)
    generate(this.mazeGrid, random, centerX, centerY, 0, Param.ITERATIONS)
    generateTiles(this.tileGrid, this.mazeGrid)
    this.drawMaze(this.bgCanvas.getContext("2d"))
    this.player.pos = {x: centerX, y: centerY, dir: 1}
    this.generateEntities(Gem, 3, 12)
    this.generateEntities(Food, 1, 5)
    this.draw()
  }

  generateEntities(entity, min, max) {
    const count = min + Math.round(random.next() * (max - min))
    let countPlaced = 0
    let loopGuard = 1000
    while (countPlaced < count && loopGuard > 0) {
      loopGuard--
      const x = parseInt(random.next() * this.mazeGrid.width)
      const y = parseInt(random.next() * this.mazeGrid.height)
      if (this.mazeGrid.get(x, y) !== 0
        && this.entityGrid.get(x, y) === null) {
        this.entityGrid.set(x, y, new entity())
        countPlaced++
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
        this.player.stamina -= 3
        this.checkEntities()
        this.checkEndGame()
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

  checkEntities() {
    const entity = this.entityGrid.get(this.player.pos.x, this.player.pos.y)
    if (entity) {
      entity.collect(this.player)
      this.entityGrid.remove(entity)
    }
  }

  checkEndGame() {
    console.log(this.player)
    let reset = false
    if (this.entityGrid.find("gem").length === 0) {
      // completed
      this.player.stamina = Math.min(this.player.stamina + 50, 100)
      reset = true
    }
    if (this.player.stamina <= 0) {
      // game over
      this.player.stamina = 100
      this.player.gemsCollected = 0
      reset = true
    }
    if (reset) this.reset(true)
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
    this.drawEntities(this.ctx)
    this.drawPlayer(this.ctx)
    this.drawHUD(this.ctx)
  }

  drawMaze(ctx) {
    ctx.save()
    ctx.scale(Param.SCALE, Param.SCALE)
    ctx.imageSmoothingEnabled = false
    ctx.fillStyle = "rgba(48, 52, 109, 1)"
    ctx.fillRect(0, 0, this.widthScaled, this.heightScaled)
    for (let y = 0, th = this.tileGrid.height; y < th; y++) {
      for (let x = 0, tw = this.tileGrid.width; x < tw; x++) {
        this.drawTile(ctx, x, y, this.tileGrid.get(x, y))
      }
    }
    ctx.restore()
  }

  drawTile (ctx, x, y, tileId) {
    const sx = (tileId % 4) * Param.TILE_SIZE
    const sy = Math.floor(tileId / 4) * Param.TILE_SIZE
    ctx.drawImage(this.tiles,
      sx, sy, Param.TILE_SIZE, Param.TILE_SIZE,
      x * Param.TILE_SIZE, y * Param.TILE_SIZE,
      Param.TILE_SIZE, Param.TILE_SIZE)
  }

  drawPlayer(ctx) {
    const offsetMult = Param.ROOM_SIZE * Param.TILE_SIZE
    const offset = offsetMult * 0.5 - Param.SPRITE_SIZE * 0.5
    ctx.save()
    ctx.scale(Param.SCALE, Param.SCALE)
    ctx.translate(
      this.player.pos.x * offsetMult + offset,
      this.player.pos.y * offsetMult + offset)
    ctx.imageSmoothingEnabled = false
    //ctx.scale(this.player.pos.dir, 1)
    ctx.drawImage(this.sprites,
      0, 0, Param.SPRITE_SIZE, Param.SPRITE_SIZE,
      0, 0,
      Param.SPRITE_SIZE, Param.SPRITE_SIZE)
    ctx.restore()
  }

  drawEntities(ctx) {
    const offsetMult = Param.ROOM_SIZE * Param.TILE_SIZE
    const offset = offsetMult * 0.5 - Param.SPRITE_SIZE * 0.5
    const entities = this.entityGrid.list()
    ctx.save()
    ctx.scale(Param.SCALE, Param.SCALE)
    ctx.imageSmoothingEnabled = false
    for (var i = 0, n = entities.length; i < n; i++) {
      // if (!this.entityVisible(entities[i])) continue
      ctx.drawImage(this.sprites,
        entities[i].spriteIndex * Param.SPRITE_SIZE, 0,
        Param.SPRITE_SIZE, Param.SPRITE_SIZE,
        entities[i].x * offsetMult + offset,
        entities[i].y * offsetMult + offset,
        Param.SPRITE_SIZE, Param.SPRITE_SIZE)
    }
    ctx.restore()
  }

  drawHUD(ctx) {
    const h = 5
    const w = this.widthScaled - 10
    const iw = w * this.player.stamina / 100 - 2
    const ih = h - 2
    const y = this.heightScaled - h
    ctx.save()
    ctx.scale(Param.SCALE, Param.SCALE)
    ctx.fillStyle = "rgba(68, 36, 52, 1)"
    ctx.fillRect(5, y, w, h)
    ctx.fillStyle = "rgba(210, 125, 44, 1)"
    ctx.fillRect(6, y + 1, iw, ih)
    ctx.font = "bold 8px serif"
    ctx.fillText(`GEMS: ${this.player.gemsCollected}`, 5, this.heightScaled - 10)
    ctx.restore()
  }
}
