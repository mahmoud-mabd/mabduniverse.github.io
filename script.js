// Enjoy

const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

canvas.width = window.innerWidth
canvas.height = window.innerHeight

class Particle {
    constructor(effect) {
        this.effect = effect
        this.radius = 3

        this.x = this.radius + Math.random() * (this.effect.width - this.radius * 2)  
        this.y = this.radius + Math.random() * (this.effect.height - this.radius * 2) 

        this.vx = Math.random() * 1 - 0.5
        this.vy = Math.random() * 1 - 0.5

        this.pushX = 0
        this.pushY = 0
        this.friction = 0.95
    }

    draw(context) {
        context.beginPath()
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
        context.fill()
    }

    update() {
        if (this.effect.mouse.pressed) {
            let dx = this.x - this.effect.mouse.x
            let dy = this.y - this.effect.mouse.y
            let distance = Math.hypot(dx, dy)
            if (distance < this.effect.mouse.radius) {
                let force = this.effect.mouse.radius / distance
                let angle = Math.atan2(dy, dx)
                this.pushX += Math.cos(angle) * force
                this.pushY += Math.sin(angle) * force
            }
        }

        this.x += this.vx + (this.pushX *= this.friction)
        if (this.isOutsideLeftBound()) {
            this.x = this.radius
            this.vx *= -1
        } else if (this.isOutsideRightBound()) {
            this.x = this.effect.width - this.radius
            this.vx *= -1
        }


        this.y += this.vy + (this.pushY *= this.friction)
        if (this.isOutsideTopBound()) {
            this.y = this.radius
            this.vy *= -1
        } else if (this.isOutsideBottomBound()) {
            this.y = this.effect.height - this.radius
            this.vy *= -1
        }
    }

    responseToWindowSizeChange() {
        if (this.isOutsideRightBound()) this.x = this.effect.width - this.radius
        if (this.isOutsideBottomBound()) this.y = this.effect.height - this.radius
    }

    isOutsideLeftBound() { return this.x < this.radius }
    isOutsideRightBound() { return this.x > this.effect.width - this.radius }
    isOutsideTopBound() { return this.y < this.radius }
    isOutsideBottomBound() { return this.y >= this.effect.height - this.radius }

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

            context.moveTo(this.mouse.x + this.mouse.radius, this.mouse.y)
            context.arc(this.mouse.x, this.mouse.y, this.mouse.radius, 0, 2 * Math.PI)
            context.stroke()
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
    // effect.drawMousePointer()
    requestAnimationFrame(animate)
}
animate(0)