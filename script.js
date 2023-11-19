// Enjoy

import { createConnectedParticlesEffect } from "./effects/ConnectedParticlesEffect.js";


const canvas = document.getElementById('canvas');

canvas.width = window.innerWidth
canvas.height = window.innerHeight

const effects = []
effects.push(createConnectedParticlesEffect(canvas, undefined, 150))

function animate() {
    effects.forEach(effect => {
        effect.clear()
        effect.animate()
    })
    requestAnimationFrame(animate)
}
animate()