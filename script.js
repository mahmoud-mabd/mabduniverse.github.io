// Enjoy

import { createConnectedParticlesEffect } from "./effects/ConnectedParticlesEffect.js";


const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

canvas.width = window.innerWidth
canvas.height = window.innerHeight

const effect = createConnectedParticlesEffect(canvas, context, 100)

function animate() {
    context.clearRect(0, 0, canvas.width, canvas.height)
    effect.animateParticles()
    // requestAnimationFrame(animate)
}
// animate()