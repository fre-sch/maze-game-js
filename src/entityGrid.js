import {clamp} from "./utils"

export default class EntityGrid {
  constructor(width, height) {
    this.width = width
    this.height = height
    this.posIndex = {}
    this.typeIndex = {}
  }

  reset() {
    this.posIndex = {}
    this.typeIndex = {}
  }

  within(x, y) {
    return x >= 0 && x < this.width && y >= 0 && y < this.height
  }

  add(entity) {
    const posKey = `${entity.x} ${entity.y}`
    this.posIndex[posKey] = entity
    if (this.typeIndex[entity.type] === undefined) {
      this.typeIndex[entity.type] = []
    }
    this.typeIndex[entity.type].push(entity)
  }

  clear(x, y) {
    const existing = this.get(x, y)
    if (existing !== null) {
      const i = this.typeIndex[existing.type].indexOf(existing)
      if (i > -1) this.typeIndex[existing.type].splice(i, 1)
      const posKey = `${existing.x} ${existing.y}`
      delete this.posIndex[posKey]
    }
  }

  set(x, y, entity) {
    entity.x = clamp(x, 0, this.width - 1)
    entity.y = clamp(y, 0, this.height - 1)
    this.clear(x, y)
    this.add(entity)
  }

  get(x, y) {
    x = clamp(x, 0, this.width - 1)
    y = clamp(y, 0, this.height - 1)
    const posKey = `${x} ${y}`
    const entity = this.posIndex[posKey]
    if (entity !== undefined) {
      return entity
    }
    return null
  }

  find(entityType) {
    if (this.typeIndex[entityType] === undefined) {
      return []
    }
    return this.typeIndex[entityType].slice()
  }

  remove(entity) {
    this.clear(entity.x, entity.y)
  }

  list() {
    return Object.values(this.posIndex)
  }
}
