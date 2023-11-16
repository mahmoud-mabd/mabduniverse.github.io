// Enjoy

import { createConnectedParticlesEffect } from "./effects/ConnectedParticlesEffect.js";


const canvas = document.getElementById('canvas');
const canvas2 = document.getElementById('canvas2');

canvas.width = 200 //window.innerWidth
canvas.height = 200 //window.innerHeight

canvas2.width = 200
canvas2.height = 200

const effects = []
effects.push(createConnectedParticlesEffect(canvas, undefined, 15))
effects.push(createConnectedParticlesEffect(canvas2, undefined, 15))

function animate() {
    effects.forEach(effect => {
        effect.clear()
        effect.animate()
    })
    requestAnimationFrame(animate)
}
animate()