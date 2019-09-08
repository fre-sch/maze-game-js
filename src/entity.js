
export class Gem {
  static type = "gem"
  static spriteIndex = 1
  constructor() {
    this.spriteIndex = Gem.spriteIndex
    this.type = Gem.type
  }
  update() {}
  collect (player) {
    player.gemsCollected += 1
    return true
  }
}

export class Food {
  static type = "food"
  static spriteIndex = 2
  constructor() {
    this.spriteIndex = Food.spriteIndex
    this.type = Food.type
    this.stamina = 30
  }
  update() {}
  collect (player) {
    player.stamina = Math.min(100, player.stamina + this.stamina)
    return true
  }
}

export class SpikeTrap {
  static type = "spiketrap"
  static spriteIndex = 4
  constructor() {
    this.baseSpriteIndex = SpikeTrap.spriteIndex
    this.spriteIndex = SpikeTrap.spriteIndex
    this.type = SpikeTrap.type
    this.counter = 0
    this.damage = 1
  }
  update() {
    this.counter++
    let offset = this.counter % 3 % 2
    this.spriteIndex = this.baseSpriteIndex + offset
  }
  collect (player) {
    if (this.spriteIndex === this.baseSpriteIndex)
      player.health -= this.damage
    return false
  }
}

export class Heart {
  static type = "heart"
  static spriteIndex = 3
  constructor () {
    this.spriteIndex = Heart.spriteIndex
    this.type = Heart.type
  }
  update () {}
  collect (player) {
    player.health += 1
    return true
  }
}

export const Rubble = 6
