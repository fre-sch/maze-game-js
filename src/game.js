import TilesStoneBrick from "../assets/tiles_stonebrick.png"
import TilesCaveBrick from "../assets/tiles_cavebrick.png"
import SpritesImage from "../assets/sprites.png"

import { routine, Random, loadImage, offscreenCanvas } from "./utils"
import Grid from "./grid"
import EntityGrid from "./entityGrid"
import { Feature, generateMaze, shiftFeature } from "./mazegen"
import Swipe from "./swipe"
import { Gem, Food, SpikeTrap, Heart, Rubble, Player, Coin, MerchantExit,
  MerchantCoin, MerchantFood, MerchantHeart } from "./entity"
import {tileFill} from "./tilefill"


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
const GAME_STATE_BUSY = 0
const GAME_STATE_READY = 1
const GAME_STATE_MERCHANT = 2

const drawSprite = function (ctx, spriteSheet, spriteIndex, x, y, sequenceIndex=0, flip=false) {
  ctx.drawImage(spriteSheet,
    spriteIndex * SPRITE_SIZE, sequenceIndex * SPRITE_SIZE,
    SPRITE_SIZE, SPRITE_SIZE,
    x, y,
    flip ? -SPRITE_SIZE : SPRITE_SIZE, SPRITE_SIZE)
}

const MoveNorth = { offset: { x: 0, y: -1 }, mask: Feature.North }
const MoveEast = { offset: { x: 1, y: 0 }, mask: Feature.East }
const MoveSouth = { offset: { x: 0, y: 1 }, mask: Feature.South }
const MoveWest = { offset: { x: -1, y: 0 }, mask: Feature.West }

export default class Game {
  constructor(canvas) {
    // initializes state to:
    // this.player = new Player(playerBaseState)
    // this.stats = {maxGemsCollected, deaths}
    const state = this.loadState()
    Object.assign(this, state)
    this.gameState = GAME_STATE_BUSY
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
    window.addEventListener("keydown", (e) => this.handleInput(e, e.key))
    this.canvas.addEventListener("click", (e) => this.handleInput(e, "click"))
    this.swipeHandler = new Swipe(canvas, (e, swipeDir) => this.handleInput(e, swipeDir))

    Promise.all([
      loadImage(TilesStoneBrick),
      loadImage(TilesCaveBrick),
      loadImage(SpritesImage)
    ])
      .then((images) => {
        this.tiles = [images[0], images[1]]
        this.sprites = images[2]
        this.reset()
      })
  }

  playerBaseState() {
    return {
      pos: {x: 0, y: 0},
      initHealth: 3,
      health: 3,
      maxStamina: 100,
      stamina: 100,
      gemsCollected: 0,
      coins: 0,
      levelsCompleted: 0
    }
  }

  baseState() {
    return {
      player: new Player(this.playerBaseState()),
      stats: {
        maxGemsCollected: 0,
        deaths: 0,
        levelsCompleted: 0,
        totalMoves: 0
      }
    }
  }

  loadState() {
    const stateRaw = localStorage.getItem("state")
    const baseState = this.baseState()
    if (stateRaw) {
      try {
        const loadedState = JSON.parse(stateRaw)
        const state = Object.assign({}, baseState)
        Object.assign(state.player, loadedState.player)
        Object.assign(state.stats, loadedState.stats)
        return state
      }
      catch {
        return baseState
      }
    }
    return baseState
  }

  saveState() {
    const state = {
      player: {
        pos: this.player.pos,
        initHealth: this.player.initHealth,
        health: this.player.health,
        maxStamina: this.player.maxStamina,
        stamina: this.player.stamina,
        gemsCollected: this.player.gemsCollected,
        levelsCompleted: this.player.levelsCompleted,
        coins: this.player.coins
      },
      stats: {
        maxGemsCollected: this.stats.maxGemsCollected,
        deaths: this.stats.deaths,
        levelsCompleted: this.stats.levelsCompleted,
        totalMoves: this.stats.totalMoves
      }
    }
    localStorage.setItem("state", JSON.stringify(state))
  }

  statAverageMovesPerLevel() {
    if (this.stats.totalMoves > 0 && this.stats.levelsCompleted > 0)
      return Math.round(this.stats.totalMoves / this.stats.levelsCompleted, 2)
    return 0
  }

  reset(newHash) {
    this.gameState = GAME_STATE_BUSY
    if (newHash) {
      window.history.pushState(null, null, "#" + random.getState())
    }
    this.mazeGrid.reset()
    this.entityGrid.reset()
    this.tileGrid.reset()
    this.gameState = GAME_STATE_READY
    if (this.player.levelsCompleted > 0 && (this.player.levelsCompleted % 50) === 0) {
      this.gameState |= GAME_STATE_MERCHANT
      this.generateMerchantLevel()
    }
    else {
      this.generateMazeLevel()
    }
    this.drawMaze(this.bgCanvas.getContext("2d"))
    this.draw()
  }

  generateMerchantLevel() {
    const centerX = parseInt(this.mazeGrid.width / 2)
    const centerY = parseInt(this.mazeGrid.height / 2)
    this.mazeGrid.set(centerX, centerY,
      Feature.NorthWall | Feature.EastWall | Feature.SouthDoor | Feature.WestWall)
    this.mazeGrid.set(centerX, centerY - 1, Feature.SouthWall)
    this.mazeGrid.set(centerX, centerY + 1, Feature.NorthDoor)
    this.mazeGrid.set(centerX - 1, centerY, Feature.EastWall)
    this.mazeGrid.set(centerX + 1, centerY, Feature.WestWall)
    tileFill(this.tileGrid, this.mazeGrid, ROOM_SIZE, random)
    this.player.pos = { x: centerX, y: centerY, dir: 1 }
    this.entityGrid.set(centerX, centerY - 1, new MerchantCoin)
    this.entityGrid.set(centerX - 1, centerY, new MerchantHeart)
    this.entityGrid.set(centerX + 1, centerY, new MerchantFood)
    this.entityGrid.set(centerX, centerY + 1, new MerchantExit)
  }

  generateMazeLevel() {
    const centerX = parseInt(this.mazeGrid.width / 2)
    const centerY = parseInt(this.mazeGrid.height / 2)
    generateMaze(this.mazeGrid, random, centerX, centerY, Feature.DOOR_MASK, ITERATIONS)
    tileFill(this.tileGrid, this.mazeGrid, ROOM_SIZE, random)
    this.player.pos = { x: centerX, y: centerY, dir: 1 }
    this.generateEntities(Gem, 3, 12)
    this.generateEntities(Food, 1, 5)
    this.generateEntities(SpikeTrap, 1, 5)
    this.generateEntities(Heart, 0.2)
    this.generateEntities(Coin, 0.05)
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
      this.player.update(delta)
      if (delta === 1) {
        this.player.stamina -= 4
        this.checkEntities()
        this.endMove()
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

  playerRest() {
    this.player.stamina -= 2
    this.checkEntities()
    this.endMove()
    this.draw()
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

  endMove() {
    if ((this.gameState & GAME_STATE_MERCHANT) !== 0) {
      this.endMoveMerchant()
    } else {
      this.endMoveMaze()
    }
  }

  endMoveMerchant() {
    this.saveState()
    if (this.entityGrid.find("merchantexit").length === 0) {
      this.fadeOut(this.ctx, 500, () => this.reset(true))
    }
  }

  endMoveMaze() {
    let reset = false
    this.stats.maxGemsCollected = Math.max(
      this.stats.maxGemsCollected,
      this.player.gemsCollected)
    this.stats.totalMoves += 1
    if (this.entityGrid.find("gem").length === 0) {
      // completed
      this.player.levelsCompleted += 1
      this.stats.levelsCompleted += 1
      this.player.stamina = Math.min(this.player.stamina + 40, 100)
      reset = true
    }
    if (this.player.stamina <= 0 && this.player.health > 0) {
      this.player.stamina = 20
      this.player.health -= 1
    }
    if (this.player.health <= 0) {
      // game over
      this.stats.deaths += 1
      //reset but preserve coins
      const coins = this.player.coins
      Object.assign(this.player, this.playerBaseState())
      this.player.coins = coins
      this.player.health = this.player.initHealth
      this.player.stamina = this.player.maxStamina
      reset = true
      this.showDeathScreen(this)
    }
    this.saveState()
    if (reset) {
      this.fadeOut(this.ctx, 500, () => this.reset(true))
    }
  }

  fadeOut(ctx, duration, cbEndOfFade) {
    this.gameState = GAME_STATE_BUSY
    routine(duration, (delta) => {
      ctx.save()
      ctx.scale(SCALE, SCALE)
      ctx.fillStyle = "rgba(0, 0, 0, 0.1)"
      ctx.fillRect(0, 0, this.widthScaled, this.heightScaled)
      this.ctx.restore()
      if (delta === 1) cbEndOfFade()
    })
  }

  handleInput(e, input) {
    if ((this.gameState & GAME_STATE_READY) === 0) {
      return
    }
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
      case "click":
      case " ":
        this.playerRest()
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
    const variantIndex = Math.round(random.next())
    const variantImg = this.tiles[variantIndex]
    ctx.save()
    ctx.imageSmoothingEnabled = false
    ctx.scale(SCALE, SCALE)
    // hack to draw background based on tile color
    const lastTileOffset = TILE_SIZE * 4 - 1
    ctx.drawImage(variantImg,
      lastTileOffset, lastTileOffset, 1, 1,
      0, 0, this.widthScaled, this.heightScaled)
    for (let y = 0, th = this.tileGrid.height; y < th; y++) {
      for (let x = 0, tw = this.tileGrid.width; x < tw; x++) {
        this.drawTile(ctx, variantImg, x, y, this.tileGrid.get(x, y))
      }
    }
    ctx.restore()
  }

  drawTile(ctx, tileSet, x, y, tileId) {
    const sx = (tileId % 4) * TILE_SIZE
    const sy = Math.floor(tileId / 4) * TILE_SIZE
    ctx.drawImage(tileSet,
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
    drawSprite(ctx, this.sprites, Player.spriteIndex, 0, 0,
      this.player.sequenceIndex, this.player.pos.dir < 0)
    ctx.restore()
  }

  drawEntities(ctx) {
    const offsetMult = ROOM_SIZE * TILE_SIZE
    const offset = offsetMult * 0.5 - SPRITE_SIZE * 0.5
    const entities = this.entityGrid.list()
    ctx.save()
    ctx.imageSmoothingEnabled = false
    ctx.scale(SCALE, SCALE)
    for (let i = 0, n = entities.length; i < n; i++) {
      let spriteIndex = entities[i].spriteIndex
      let sequenceIndex = entities[i].sequenceIndex
      if (!this.entityVisible(entities[i])) {
        spriteIndex = Rubble
        sequenceIndex = 0
      }
      drawSprite(ctx, this.sprites, spriteIndex,
        entities[i].x * offsetMult + offset,
        entities[i].y * offsetMult + offset, sequenceIndex)
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
    const iw = w * this.player.stamina / this.player.maxStamina - 2
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
    const gemText = `${this.player.gemsCollected}`
    ctx.fillText(gemText, this.widthScaled - 16, this.heightScaled - 9)
    drawSprite(ctx, this.sprites, Gem.spriteIndex,
      this.widthScaled - SPRITE_SIZE - 5, this.heightScaled - 16)
    const coinText = `${this.player.coins}`
    ctx.fillText(coinText, this.widthScaled - 43, this.heightScaled - 9)
    drawSprite(ctx, this.sprites, Coin.spriteIndex,
      this.widthScaled - SPRITE_SIZE - 32, this.heightScaled - 16)
    for (let x = 5, i = 0; i < this.player.health; i++ , x += SPRITE_SIZE + 2) {
      drawSprite(ctx, this.sprites, Heart.spriteIndex,
        x, this.heightScaled - 16)
    }
    ctx.restore()
  }
}
