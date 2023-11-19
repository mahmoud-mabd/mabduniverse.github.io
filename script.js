// Enjoy

import { createConnectedParticlesEffect } from "./effects/ConnectedParticlesEffect.js";


const canvas = document.getElementById('canvas');

canvas.width = window.innerWidth
canvas.height = window.innerHeight

const effects = []
effects.push(createConnectedParticlesEffect(canvas, undefined, 150))


var interval = 1_000/60
var timer = 0
var lastTime = 0
var deltaTime = 0

function animate(timeStamp) {
    deltaTime = timeStamp - lastTime
    lastTime = timeStamp
    if (timer > interval) {
        effects.forEach(effect => {
            effect.clear()
            effect.animate()
        })
        timer = 0
    } else {
        timer += deltaTime
    }
    requestAnimationFrame(animate)
}
animate(0)