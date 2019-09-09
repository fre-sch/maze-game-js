import "./main.css"
import Game from "./game"

const canvas = document.createElement("canvas")
document.body.appendChild(canvas)
window.game = new Game(canvas)


const startScreen = document.createElement("div")
let hideStartScreen
hideStartScreen = (e) => {
  e.preventDefault()
  startScreen.style.display = "none"
  startScreen.removeEventListener("click", hideStartScreen)
}
startScreen.classList.add("start-screen")
startScreen.addEventListener("click", hideStartScreen)
startScreen.innerHTML = `
<div>
<div class="title">Collect Gems</div>
<div>
  Press arrow keys to move.<br/>
  Or swipe to move.<br/>
  Click or tap to start
</div>
<div class="stats small">
Max gems collected: ${game.stats.maxGemsCollected}<br/>
Deaths: ${game.stats.deaths}
</div>
</div>
`
document.body.appendChild(startScreen)

const deathScreen = document.createElement("div")
deathScreen.classList.add("death-screen", "hide")
deathScreen.innerHTML = `
<div>
  <div class="title">You died</div>
  <div>Click or tap to continue.</div>
  <div class="stats small">
  Max gems collected: <span class="maxGemsCollected"></span><br/>
  Deaths: <span class="deaths"></span>
  </div>
</div>
`
deathScreen.addEventListener("click", (e) => {
  e.preventDefault()
  deathScreen.classList.add("hide")
})
document.body.appendChild(deathScreen)
game.showDeathScreen = (game) => {
  deathScreen.querySelector(".maxGemsCollected").innerHTML = game.stats.maxGemsCollected
  deathScreen.querySelector(".deaths").innerHTML = game.stats.deaths
  deathScreen.classList.remove("hide")
}
