class Entity {
  update(delta) {}
  collect(player) {}
}

export class Player extends Entity {
  static type = "player"
  static spriteIndex = 0
  constructor(init) {
    super()
    Object.assign(this, init)
    this.spriteIndex = Player.spriteIndex
    this.type = Player.type
    this.sequenceIndex = 0
  }
  update(delta) {
    this.sequenceIndex = parseInt(delta * 6) % 3
  }
}

export class Gem extends Entity {
  static type = "gem"
  static spriteIndex = 1
  constructor() {
    super()
    this.spriteIndex = Gem.spriteIndex
    this.sequenceIndex = 0
    this.type = Gem.type
  }
  collect (player) {
    player.gemsCollected += 1
    return true
  }
}

export class Food extends Entity {
  static type = "food"
  static spriteIndex = 2
  constructor() {
    super()
    this.spriteIndex = Food.spriteIndex
    this.sequenceIndex = 0
    this.type = Food.type
    this.stamina = 30
  }
  collect (player) {
    player.stamina = Math.min(player.maxStamina, player.stamina + this.stamina)
    return true
  }
}

export class Heart extends Entity {
  static type = "heart"
  static spriteIndex = 3
  constructor () {
    super()
    this.spriteIndex = Heart.spriteIndex
    this.sequenceIndex = 0
    this.type = Heart.type
  }
  collect (player) {
    player.health += 1
    return true
  }
}

export class SpikeTrap extends Entity {
  static type = "spiketrap"
  static spriteIndex = 4
  constructor() {
    super()
    this.spriteIndex = SpikeTrap.spriteIndex
    this.sequenceIndex = 0
    this.type = SpikeTrap.type
    this.counter = 0
    this.damage = 1
  }
  update() {
    this.counter++
    this.sequenceIndex = this.counter % 3
  }
  collect (player) {
    if (this.sequenceIndex === 1)
      player.health -= this.damage
    return false
  }
}

export const Rubble = 5

export class Coin extends Entity {
  static type = "coin"
  static spriteIndex = 6
  constructor () {
    super()
    this.type = Coin.type
    this.spriteIndex = Coin.spriteIndex
    this.sequenceIndex = 0
  }
  collect(player) {
    player.coins += 1
    return true
  }
}

export class MerchantExit extends Entity {
  static type = "merchantexit"
  static spriteIndex = 5
  constructor() {
    super()
    this.type = MerchantExit.type
    this.spriteIndex = MerchantExit.spriteIndex
    this.sequenceIndex = 1
  }
  collect(player) {
    return true
  }
}

export class MerchantCoin extends Entity {
  static type = "merchantcoin"
  static spriteIndex = 6
  constructor() {
    super()
    this.type = MerchantCoin.type
    this.spriteIndex = MerchantCoin.spriteIndex
    this.sequenceIndex = 1
    this.cost = 1000
  }
  collect(player) {
    if (player.gemsCollected >= this.cost) {
      player.coins += 1
      player.gemsCollected -= this.cost
      return true
    }
  }
}

export class MerchantHeart extends Entity {
  static type = "merchantheart"
  static spriteIndex = 3
  constructor() {
    super()
    this.type = MerchantHeart.type
    this.spriteIndex = MerchantHeart.spriteIndex
    this.sequenceIndex = 1
    this.cost = 5
  }
  collect(player) {
    if (player.coins >= this.cost) {
      player.coins -= this.cost
      player.initHealth += 1
      player.health = player.initHealth
      return true
    }
  }
}

export class MerchantFood extends Entity {
  static type = "merchantfood"
  static spriteIndex = 2
  constructor() {
    super()
    this.type = MerchantFood.type
    this.spriteIndex = MerchantFood.spriteIndex
    this.sequenceIndex = 1
    this.cost = 2
  }
  collect(player) {
    if (player.coins >= this.cost) {
      player.coins -= this.cost
      player.maxStamina += 10
      player.stamina = player.maxStamina
      return true
    }
  }
}
