import { routine, Random } from "./utils"
import Grid from "./grid"
import { Feature, generate } from "./mazegen"

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
    window.addEventListener("keydown", this.handleKeypress.bind(this))
  }
  reset(newHash) {
    if (newHash)
      window.history.pushState(null, null, "#" + random.getState())
    this.grid.reset()
    generate(this.grid,
      random,
      parseInt(this.grid.width / 2),
      parseInt(this.grid.height / 2),
      0,
      Param.ITERATIONS
    )
    this.player = {
      pos: {
        x: parseInt(this.grid.width / 2),
        y: parseInt(this.grid.height / 2)
      }
    }
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
    this.draw()
  }
  playerMoveBy(dx, dy) {
    let initX = this.player.pos.x
    let initY = this.player.pos.y
    routine(500, function (delta) {
      this.player.pos.x = initX + dx * delta
      this.player.pos.y = initY + dy * delta
      if (delta === 1) {
        this.checkGemsCollected()
      }
      this.draw()
    }.bind(this))
  }
  checkGemsCollected() {
    this.gems = this.gems.filter(function (gem) {
      return !(gem.x === this.player.pos.x && gem.y === this.player.pos.y)
    }.bind(this))
    if (this.gems.length === 0) {
      this.reset(true)
    }
  }
  handleKeypress(e) {
    switch (e.key) {
      case "ArrowUp":
        var target = { x: this.player.pos.x, y: this.player.pos.y - 1 }
        var roomFrom = this.grid.get(this.player.pos.x, this.player.pos.y)
        var roomTo = this.grid.get(target.x, target.y)
        if ((roomTo & Feature.South) !== 0 && (roomFrom & Feature.North) !== 0) {
          this.playerMoveBy(0, -1)
        }
        e.preventDefault()
        break;
      case "ArrowDown":
        var target = { x: this.player.pos.x, y: this.player.pos.y + 1 }
        var roomFrom = this.grid.get(this.player.pos.x, this.player.pos.y)
        var roomTo = this.grid.get(target.x, target.y)
        if ((roomTo & Feature.North) !== 0 && (roomFrom & Feature.South) !== 0) {
          this.playerMoveBy(0, 1)
        }
        e.preventDefault()
        break;
      case "ArrowLeft":
        var target = { x: this.player.pos.x - 1, y: this.player.pos.y }
        var roomFrom = this.grid.get(this.player.pos.x, this.player.pos.y)
        var roomTo = this.grid.get(target.x, target.y)
        if ((roomTo & Feature.East) !== 0 && (roomFrom & Feature.West) !== 0) {
          this.playerMoveBy(-1, 0)
        }
        e.preventDefault()
        break;
      case "ArrowRight":
        var target = { x: this.player.pos.x + 1, y: this.player.pos.y }
        var roomFrom = this.grid.get(this.player.pos.x, this.player.pos.y)
        var roomTo = this.grid.get(target.x, target.y)
        if ((roomTo & Feature.West) !== 0 && (roomFrom & Feature.East) !== 0) {
          this.playerMoveBy(1, 0)
        }
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
