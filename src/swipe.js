export default class Swipe {
  constructor(element) {
    this.xDown = null
    this.yDown = null
    this.element = element
    this.element.addEventListener(
      'touchstart', this.handleTouchStart.bind(this), false)
    this.element.addEventListener(
      'touchmove', this.handleTouchMove.bind(this), false)
  }

  handleTouchStart(event) {
    this.xDown = event.touches[0].clientX
    this.yDown = event.touches[0].clientY
  }

  handleTouchMove(event) {
    if (!this.xDown || !this.yDown || !this.onSwipe) {
      return
    }

    var xUp = event.touches[0].clientX
    var yUp = event.touches[0].clientY

    this.xDiff = this.xDown - xUp
    this.yDiff = this.yDown - yUp

    if (Math.abs(this.xDiff) > Math.abs(this.yDiff)) { // Most significant.
      if (this.xDiff > 0) {
        this.onSwipe(event, "SwipeLeft")
      } else {
        this.onSwipe(event, "SwipeRight")
      }
    } else {
      if (this.yDiff > 0) {
        this.onSwipe(event, "SwipeUp")
      } else {
        this.onSwipe(event, "SwipeDown")
      }
    }

    this.xDown = null
    this.yDown = null
  }
}
