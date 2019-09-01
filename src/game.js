import { routine, Random } from "./utils"
import Grid from "./grid"
import { Feature, generate, shiftFeature } from "./mazegen"
import Swipe from "./swipe"
const Param = {
  // width and height of rooms in pixels
  ROOM_SIZE: 5,
  // larger scale for bigger pixels
  SCALE: 32,
  ITERATIONS: 12
}

const random = new Random(window.location.hash.substr(1))

const strokePath = function (ctx, x1, y1, x2, y2) {
  ctx.beginPath()
  ctx.moveTo(x1, y1)
  ctx.lineTo(x2, y2)
  ctx.stroke()
}

const drawRoomFeatures = function (ctx, cx, cy, features) {
  var doorSize = Math.round(Param.ROOM_SIZE / 3)
  if ((features & Feature.NorthDoor) !== 0) {
    strokePath(ctx, cx + doorSize, cy + .5, cx + Param.ROOM_SIZE - doorSize, cy + .5)
  }
  if ((features & Feature.NorthWall) !== 0) {
    strokePath(ctx, cx + 1, cy + .5, cx + Param.ROOM_SIZE - 1, cy + .5)
  }
  if ((features & Feature.EastDoor) !== 0) {
    strokePath(ctx, cx + Param.ROOM_SIZE - .5, cy + doorSize, cx + Param.ROOM_SIZE - .5, cy + Param.ROOM_SIZE - doorSize)
  }
  if ((features & Feature.EastWall) !== 0) {
    strokePath(ctx, cx + Param.ROOM_SIZE - .5, cy + 1, cx + Param.ROOM_SIZE - .5, cy + Param.ROOM_SIZE - 1)
  }
  if ((features & Feature.SouthDoor) !== 0) {
    strokePath(ctx, cx + doorSize, cy + Param.ROOM_SIZE - .5, cx + Param.ROOM_SIZE - doorSize, cy + Param.ROOM_SIZE - .5)
  }
  if ((features & Feature.SouthWall) !== 0) {
    strokePath(ctx, cx + 1, cy + Param.ROOM_SIZE - .5, cx + Param.ROOM_SIZE - 1, cy + Param.ROOM_SIZE - .5)
  }
  if ((features & Feature.WestDoor) !== 0) {
    strokePath(ctx, cx + .5, cy + doorSize, cx + .5, cy + Param.ROOM_SIZE - doorSize)
  }
  if ((features & Feature.WestWall) !== 0) {
    strokePath(ctx, cx + .5, cy + 1, cx + .5, cy + Param.ROOM_SIZE - 1)
  }
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
    this.grid = new Grid(
      parseInt(canvas.width / Param.SCALE / Param.ROOM_SIZE),
      parseInt(canvas.height / Param.SCALE / Param.ROOM_SIZE))
    this.reset()
    window.addEventListener("keydown", (e) => this.handleInput(e, e.key))
    let swipe = new Swipe(canvas)
    swipe.onSwipe = (e, swipeDir) => this.handleInput(e, swipeDir)
  }
  reset(newHash) {
    if (newHash)
      window.history.pushState(null, null, "#" + random.getState())
    this.grid.reset()
    const centerX = parseInt(this.grid.width / 2)
    const centerY = parseInt(this.grid.height / 2)
    generate(this.grid, random, centerX, centerY, 0, Param.ITERATIONS)
    this.player = { pos: { x: centerX, y: centerY } }
    this.generateGems()
    this.draw()
  }
  generateGems() {
    this.numGems = 3 + Math.round(random.next() * 9)
    this.gems = []
    while (this.gems.length < this.numGems) {
      let gem = {
        x: parseInt(random.next() * this.grid.width),
        y: parseInt(random.next() * this.grid.height)
      }
      if (this.grid.get(gem.x, gem.y) !== 0) {
        this.gems.push(gem)
      }
    }
  }
  playerMoveBy(deltaVector) {
    let initX = this.player.pos.x
    let initY = this.player.pos.y
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
    let roomFrom = this.grid.get(this.player.pos.x, this.player.pos.y)
    let roomTo = this.grid.get(target.x, target.y)
    let canMoveTo = (roomTo & shiftFeature(dir.mask)) !== 0
    let canMoveFrom = (roomFrom & dir.mask) !== 0
    if (canMoveFrom && canMoveTo) {
      this.playerMoveBy(dir.offset)
    }
  }
  checkGemsCollected() {
    this.gems = this.gems.filter(function (gem) {
      return !(gem.x === this.player.pos.x && gem.y === this.player.pos.y)
    }.bind(this))
    if (this.gems.length === 0) {
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
    this.drawMaze(this.ctx)
    this.drawGems(this.ctx)
    this.drawPlayer(this.ctx)
  }
  drawMaze(ctx) {
    ctx.save()
    ctx.scale(Param.SCALE, Param.SCALE)
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
    for (let gx = 0; gx < this.grid.width; gx++) {
      for (let gy = 0; gy < this.grid.height; gy++) {
        this.drawRoom(ctx, gx, gy)
      }
    }
    ctx.restore()
  }
  drawPlayer(ctx) {
    ctx.save()
    ctx.fillStyle = "rgba(80, 220, 255, 1)"
    var offsetMult = Param.ROOM_SIZE * Param.SCALE
    var roomCenterOffset = offsetMult * .4
    var canvasX = this.player.pos.x * offsetMult
    var canvasY = this.player.pos.y * offsetMult
    ctx.fillRect(
      canvasX + roomCenterOffset,
      canvasY + roomCenterOffset,
      Param.SCALE, Param.SCALE)
    ctx.restore()
  }
  drawGems(ctx) {
    ctx.save()
    ctx.fillStyle = "rgba(80, 255, 80, 1)"
    var offsetMult = Param.ROOM_SIZE * Param.SCALE
    var roomCenterOffset = offsetMult * .4
    for (var i = 0, n = this.gems.length; i < n; i++) {
      var canvasX = this.gems[i].x * offsetMult
      var canvasY = this.gems[i].y * offsetMult
      ctx.fillRect(
        canvasX + roomCenterOffset,
        canvasY + roomCenterOffset,
        Param.SCALE, Param.SCALE)
    }
    ctx.restore()
  }
  drawRoom(ctx, gx, gy) {
    var features = this.grid.get(gx, gy)
    if (features == 0) {
      return
    }
    var cx = gx * Param.ROOM_SIZE
    var cy = gy * Param.ROOM_SIZE

    ctx.save()
    ctx.fillStyle = "rgba(128,128,128,1)"
    ctx.fillRect(cx, cy, Param.ROOM_SIZE, Param.ROOM_SIZE)
    ctx.fillStyle = "rgba(64,64,64,1)"
    ctx.fillRect(cx + 1, cy + 1, Param.ROOM_SIZE - 2, Param.ROOM_SIZE - 2)
    ctx.strokeStyle = "rgba(64, 64, 64, 1)"
    drawRoomFeatures(ctx, cx, cy, features)
    ctx.restore()

    ctx.save()
    ctx.strokeStyle = "rgba(0, 0, 0, .1)"
    ctx.scale(1 / Param.SCALE, 1 / Param.SCALE)
    ctx.strokeRect(
      cx * Param.SCALE + .5,
      cy * Param.SCALE + .5,
      Param.ROOM_SIZE * Param.SCALE - 1,
      Param.ROOM_SIZE * Param.SCALE - 1)
    ctx.restore()
  }
}
