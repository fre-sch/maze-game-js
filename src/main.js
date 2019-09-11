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
<div class="inner">
<div class="title">Collect Gems</div>
<div>
  Press arrow keys to move, Space to wait a turn.<br/>
  Or swipe to move, tap to wait a turn.<br/>
  Click or tap to start<br/>
</div>
<table class="stats small">
<tr><td>Max gems collected:</td><td>${game.stats.maxGemsCollected}</td></tr>
<tr><td>Deaths:</td><td>${game.stats.deaths}</td></tr>
<tr><td>Levels completed:</td><td>${game.stats.levelsCompleted}</td></tr>
<tr><td>Average moves per level:</td><td>${game.statAverageMovesPerLevel()}</td></tr>
</table>
</div>
`
document.body.appendChild(startScreen)

const deathScreen = document.createElement("div")
deathScreen.classList.add("death-screen", "hide")
deathScreen.innerHTML = `
<div>
  <div class="title">You died</div>
  <div>Click or tap to continue.</div>
  <table class="stats small">
  <tr><td>Max gems collected:</td><td class="maxGemsCollected"></td></tr>
  <tr><td>Deaths:</td><td class="deaths"></td></tr>
  <tr><td>Levels completed:</td><td class="levelsCompleted"></td></tr>
  <tr><td>Average moves per level:</td><td class="averageMovesPerLevel"></td></tr>
  </table>
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
  deathScreen.querySelector(".levelsCompleted").innerHTML = game.stats.levelsCompleted
  deathScreen.querySelector(".averageMovesPerLevel").innerHTML = game.statAverageMovesPerLevel()
  deathScreen.classList.remove("hide")
}
