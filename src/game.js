import { routine, Random, loadImage, offscreenCanvas } from "./utils"
import Grid from "./grid"
import EntityGrid from "./entityGrid"
import { Feature, generate, shiftFeature } from "./mazegen"
import Swipe from "./swipe"
import { Gem, Food, SpikeTrap, Heart, Rubble } from "./entity"
import TileImage from "../assets/tiles.png"
import SpritesImage from "../assets/sprites.png"

const scaleForDisplay = function () {
  let v = Math.round(4 + window.devicePixelRatio)
  return v - (v % 2)
}

const ROOM_SIZE = 5
const TILE_SIZE = 8
const SPRITE_SIZE = 8
const SCALE = scaleForDisplay()
const ITERATIONS = 12
const random = new Random(window.location.hash.substr(1))

const drawSprite = function (ctx, spriteSheet, spriteIndex, x, y, flip = false) {
  ctx.drawImage(spriteSheet,
    spriteIndex * SPRITE_SIZE, 0,
    SPRITE_SIZE, SPRITE_SIZE,
    x, y,
    flip ? -SPRITE_SIZE : SPRITE_SIZE, SPRITE_SIZE)
}

const computeTile = function (grid, x, y) {
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
      let doorSize = Math.floor(ROOM_SIZE / 3)
      let tx = mx * ROOM_SIZE
      let ty = my * ROOM_SIZE
      tmpGrid.fill(tx + 1, ty + 1,
        ROOM_SIZE - 2, ROOM_SIZE - 2,
        floor)
      if ((features & Feature.NorthDoor) !== 0) {
        tmpGrid.fill(tx + 1 + doorSize, ty,
          doorSize, 1,
          floor)
      }
      if ((features & Feature.NorthWall) !== 0) {
        tmpGrid.fill(tx + 1, ty,
          ROOM_SIZE - 2, 1,
          floor)
      }
      if ((features & Feature.EastDoor) !== 0) {
        tmpGrid.fill(tx + ROOM_SIZE - 1, ty + 1 + doorSize,
          1, doorSize,
          floor)
      }
      if ((features & Feature.EastWall) !== 0) {
        tmpGrid.fill(tx + ROOM_SIZE - 1, ty + 1,
          1, ROOM_SIZE - 2,
          floor)
      }
      if ((features & Feature.SouthDoor) !== 0) {
        tmpGrid.fill(tx + 1 + doorSize, ty + ROOM_SIZE - 1,
          doorSize, 1,
          floor)
      }
      if ((features & Feature.SouthWall) !== 0) {
        tmpGrid.fill(tx + 1, ty + ROOM_SIZE - 1,
          ROOM_SIZE - 2, 1,
          floor)
      }
      if ((features & Feature.WestDoor) !== 0) {
        tmpGrid.fill(tx, ty + 1 + doorSize,
          1, doorSize,
          floor)
      }
      if ((features & Feature.WestWall) !== 0) {
        tmpGrid.fill(tx, ty + 1,
          1, ROOM_SIZE - 2,
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

const MoveNorth = { offset: { x: 0, y: -1 }, mask: Feature.North }
const MoveEast = { offset: { x: 1, y: 0 }, mask: Feature.East }
const MoveSouth = { offset: { x: 0, y: 1 }, mask: Feature.South }
const MoveWest = { offset: { x: -1, y: 0 }, mask: Feature.West }

export default class Game {
  constructor(canvas) {
    this.canvas = canvas
    this.canvas.width = window.innerWidth - 4 // arbitrary margin to avoid scrollbars
    this.canvas.height = window.innerHeight - 4 // arbitrary margin to avoid scrollbars
    this.widthScaled = this.canvas.width / SCALE
    this.heightScaled = this.canvas.height / SCALE
    this.ctx = this.canvas.getContext("2d")
    this.bgCanvas = offscreenCanvas(this.canvas.width, this.canvas.height)
    this.mazeGrid = new Grid(
      parseInt(this.widthScaled / ROOM_SIZE / TILE_SIZE),
      parseInt(this.heightScaled / ROOM_SIZE / TILE_SIZE))
    this.entityGrid = new EntityGrid(this.mazeGrid.width, this.mazeGrid.height)
    this.tileGrid = new Grid(
      this.mazeGrid.width * ROOM_SIZE, this.mazeGrid.height * ROOM_SIZE)
    this.player = { health: 3, stamina: 100, gemsCollected: 0 }
    window.addEventListener("keydown", (e) => this.handleInput(e, e.key))
    const swipe = new Swipe(canvas, (e, swipeDir) => this.handleInput(e, swipeDir))

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
    generate(this.mazeGrid, random, centerX, centerY, Feature.DOOR_MASK, ITERATIONS)
    generateTiles(this.tileGrid, this.mazeGrid)
    this.drawMaze(this.bgCanvas.getContext("2d"))
    this.player.pos = { x: centerX, y: centerY, dir: 1 }
    this.generateEntities(Gem, 3, 12)
    this.generateEntities(Food, 1, 5)
    this.generateEntities(SpikeTrap, 1, 5)
    this.generateEntities(Heart, .2)
    this.draw()
  }

  generateEntities(entity, min, max) {
    let count
    if (max === undefined) {
      // generate probability
      count = (random.next() < min) ? 1 : 0
    }
    else {
      // generate random count
      count = min + Math.round(random.next() * (max - min))
    }
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
    const { x: initX, y: initY } = this.player.pos
    this.player.pos.dir = deltaVector.x >= 0 ? 1 : -1
    routine(500, (delta) => {
      this.player.pos.x = initX + deltaVector.x * delta
      this.player.pos.y = initY + deltaVector.y * delta
      if (delta === 1) {
        this.player.stamina -= 3
        this.checkEntities()
        this.checkEndGame()
      }
      this.draw()
    })
  }

  playerMove(dir) {
    const target = {
      x: this.player.pos.x + dir.offset.x,
      y: this.player.pos.y + dir.offset.y
    }
    const roomFrom = this.mazeGrid.get(this.player.pos.x, this.player.pos.y)
    const roomTo = this.mazeGrid.get(target.x, target.y)
    const canMoveTo = (roomTo & shiftFeature(dir.mask)) !== 0
    const canMoveFrom = (roomFrom & dir.mask) !== 0
    if (canMoveFrom && canMoveTo) {
      this.playerMoveBy(dir.offset)
    }
  }

  checkEntities() {
    const entities = this.entityGrid.list()
    for (let i = 0; i < entities.length; i++) {
      entities[i].update()
    }
    const entity = this.entityGrid.get(this.player.pos.x, this.player.pos.y)
    if (entity) {
      if (entity.collect(this.player))
        this.entityGrid.remove(entity)
    }
  }

  checkEndGame() {
    let reset = false
    if (this.entityGrid.find("gem").length === 0) {
      // completed
      this.player.stamina = Math.min(this.player.stamina + 50, 100)
      reset = true
    }
    if (this.player.stamina <= 0 && this.player.health > 0) {
      this.player.stamina = 20
      this.player.health -= 1
    }
    if (this.player.health <= 0) {
      // game over
      this.player.stamina = 100
      this.player.health = 3
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
    ctx.imageSmoothingEnabled = false
    ctx.scale(SCALE, SCALE)
    ctx.fillStyle = "rgba(48, 52, 109, 1)"
    ctx.fillRect(0, 0, this.widthScaled, this.heightScaled)
    for (let y = 0, th = this.tileGrid.height; y < th; y++) {
      for (let x = 0, tw = this.tileGrid.width; x < tw; x++) {
        this.drawTile(ctx, x, y, this.tileGrid.get(x, y))
      }
    }
    ctx.restore()
  }

  drawTile(ctx, x, y, tileId) {
    const sx = (tileId % 4) * TILE_SIZE
    const sy = Math.floor(tileId / 4) * TILE_SIZE
    ctx.drawImage(this.tiles,
      sx, sy, TILE_SIZE, TILE_SIZE,
      x * TILE_SIZE, y * TILE_SIZE,
      TILE_SIZE, TILE_SIZE)
  }

  drawPlayer(ctx) {
    const offsetMult = ROOM_SIZE * TILE_SIZE
    const offset = offsetMult * 0.5 - SPRITE_SIZE * 0.5
    ctx.save()
    ctx.imageSmoothingEnabled = false
    ctx.scale(SCALE, SCALE)
    ctx.translate(
      this.player.pos.x * offsetMult + offset,
      this.player.pos.y * offsetMult + offset)
    ctx.scale(this.player.pos.dir, 1)
    drawSprite(ctx, this.sprites, 0, 0, 0, this.player.pos.dir < 0)
    ctx.restore()
  }

  drawEntities(ctx) {
    const offsetMult = ROOM_SIZE * TILE_SIZE
    const offset = offsetMult * 0.5 - SPRITE_SIZE * 0.5
    const entities = this.entityGrid.list()
    ctx.save()
    ctx.imageSmoothingEnabled = false
    ctx.scale(SCALE, SCALE)
    for (var i = 0, n = entities.length; i < n; i++) {
      let spriteIndex = entities[i].spriteIndex
      if (!this.entityVisible(entities[i]))
        spriteIndex = Rubble
      drawSprite(ctx, this.sprites, spriteIndex,
        entities[i].x * offsetMult + offset,
        entities[i].y * offsetMult + offset)
    }
    ctx.restore()
  }

  entityVisible(entity) {
    const m = [MoveNorth, MoveEast, MoveSouth, MoveWest]
    const px = parseInt(this.player.pos.x)
    const py = parseInt(this.player.pos.y)
    if (entity.x === px && entity.y === py) {
      return true
    }
    const r = this.mazeGrid.get(px, py)
    for (let i = 0; i < 4; i++) {
      if ((r & m[i].mask) !== 0) {
        const x = parseInt(this.player.pos.x) + m[i].offset.x
        const y = parseInt(this.player.pos.y) + m[i].offset.y
        if (entity.x === x && entity.y === y) {
          return true
        }
      }
    }
    return false
  }

  drawHUD(ctx) {
    const h = 5
    const w = this.widthScaled - 10
    const iw = w * this.player.stamina / 100 - 2
    const ih = h - 2
    const y = this.heightScaled - h
    ctx.save()
    ctx.imageSmoothingEnabled = false
    ctx.scale(SCALE, SCALE)
    ctx.fillStyle = "rgba(68, 36, 52, 1)"
    ctx.fillRect(5, y, w, h)
    ctx.fillStyle = "rgba(210, 125, 44, 1)"
    ctx.fillRect(6, y + 1, iw, ih)
    ctx.font = "bold 8px serif"
    ctx.textAlign = "end"
    const text = `${this.player.gemsCollected}`
    ctx.fillText(text, this.widthScaled - 16, this.heightScaled - 9)
    drawSprite(ctx, this.sprites, Gem.spriteIndex,
      this.widthScaled - SPRITE_SIZE - 5, this.heightScaled - 16)
    for (let x = 5, i = 0; i < this.player.health; i++ , x += SPRITE_SIZE + 2) {
      drawSprite(ctx, this.sprites, Heart.spriteIndex,
        x, this.heightScaled - 16)
    }
    ctx.restore()
  }
}
