import "./main.css"
import Game from "./game"

const startScreen = document.createElement("div")
let hideStartScreen
hideStartScreen = (e) => {
  startScreen.style.display = "none"
  startScreen.removeEventListener("click", hideStartScreen)
}
startScreen.classList.add("start-screen")
startScreen.addEventListener("click", hideStartScreen)
startScreen.innerHTML = `
<div>
<div class="title">Collect Gems</div>
<div>Press arrow keys to move.</div>
<div>Or swipe to move.</div>
<div>Click or tap to start</div>
</div>
`
const canvas = document.createElement("canvas")
document.body.appendChild(canvas)
document.body.appendChild(startScreen)
window.game = new Game(canvas)
