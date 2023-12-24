// Enjoy

const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

canvas.width = window.innerWidth
canvas.height = window.innerHeight

class Particle {
    constructor(effect) {
        this.effect = effect
        this.radius = 1

        this.x = this.radius + Math.random() * (this.effect.width - this.radius * 2)  
        this.y = this.radius + Math.random() * (this.effect.height - this.radius * 2) 

        this.vx = Math.random() * 1 - 0.5
        this.vy = Math.random() * 1 - 0.5
    }

    draw(context) {
        context.beginPath()
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
        context.fill()
    }

    update() {
        this.x += this.vx
        if (this.x <= this.radius || this.x >= this.effect.width - this.radius) this.vx *= -1

        this.y += this.vy
        if (this.y <= this.radius || this.y >= this.effect.height - this.radius) this.vy *= -1
    }

    responseToWindowSizeChange() {
        if (this.x >= this.effect.width - this.radius) this.x = this.effect.width - 2 * this.radius

        if (this.y >= this.effect.height - this.radius) this.y = this.effect.height - 2 * this.radius
    }
}

class Effect {
    constructor(canvas, context, numberOfParticles) {
        this.canvas = canvas
        this.context = context
        this.width = this.canvas.width
        this.height = this.canvas.height

        this.minDistanceBetweenParticles = 100
        this.setStyles()

        this.particles = []
        this.createParticles(numberOfParticles)

        this.mouse = {
            x: 0,
            y: 0,
            pressed: false,
            radius: 100
        }

        this.listenToResizeEvent()
        this.listenToMouseEvents()
    }

    setStyles() {
        this.context.fillStyle = "white"
        this.context.strokeStyle = "white"
        this.context.lineWidth = 0.5
    }

    listenToResizeEvent() {
        window.addEventListener('resize', e => {
            this.handleWindowResize(e.target.window.innerWidth, e.target.window.innerHeight)
        })
    }

    listenToMouseEvents() {
        window.addEventListener('mousemove', e => {
            if (this.mouse.pressed) {
                this.mouse.x = e.x
                this.mouse.y = e.y
            }
            // console.log(`mouse move: id=${e.target.id} x=${e.x}, y=${e.y}`)
        })
        window.addEventListener('mousedown', e => {
            this.mouse.pressed = true
            this.mouse.x = e.x
            this.mouse.y = e.y
            // console.log(`mouse down: x=${e.x}, y=${e.y}`)
        })
        window.addEventListener('mouseup', e => {
            this.mouse.pressed = false
            this.mouse.x = e.x
            this.mouse.y = e.y
            // console.log(`mouse up: x=${e.x}, y=${e.y}`)
        })
    }

    createParticles(numberOfParticles) {
        for (var i = 0; i < numberOfParticles; i++) {
            const particle = new Particle(this)
            this.particles.push(particle)
            particle.draw(this.context)
        }
    }

    animateParticles() {
        this.particles.forEach( (particle, index) => {
            this.connectNearParticles(index)
            particle.update()
            particle.draw(this.context)
        })
    }

    drawMousePointer() {
        if (this.mouse.pressed) {
            context.beginPath()
            context.arc(this.mouse.x, this.mouse.y, 20, 0, 2 * Math.PI)
            context.fill()
        }
    }

    connectNearParticles(particleIndex) {
        for (var i = particleIndex + 1; i < this.particles.length; i++) {
            const dx = this.particles[particleIndex].x - this.particles[i].x
            const dy = this.particles[particleIndex].y - this.particles[i].y
            const distance = Math.hypot(dx, dy)
            if (distance < this.minDistanceBetweenParticles) {
                this.context.save()
                this.context.globalAlpha = 1 - (distance / this.minDistanceBetweenParticles)
                this.context.beginPath()
                this.context.moveTo(this.particles[particleIndex].x, this.particles[particleIndex].y)
                this.context.lineTo(this.particles[i].x, this.particles[i].y)
                this.context.stroke()
                this.context.restore()
            }
        }
    }

    handleWindowResize(newWidth, newHeight) {
        this.canvas.width = newWidth
        this.canvas.height = newHeight

        this.width = newWidth
        this.height = newHeight

        this.setStyles()

        this.particles.forEach( (particle) => {
            particle.responseToWindowSizeChange()
        } )
    }

}


const effect = new Effect(canvas, context, 200)

var interval = 1_000/60
var timer = 0
var lastTime = 0
var deltaTime = 0

function animate(timeStamp) {
    deltaTime = timeStamp - lastTime
    lastTime = timeStamp
    if (timer > interval) {
        context.clearRect(0, 0, canvas.width, canvas.height)
        effect.animateParticles()
        timer = 0
    } else {
        timer += deltaTime
    }
    effect.drawMousePointer()
    requestAnimationFrame(animate)
}
animate(0)