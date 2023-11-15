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
}

class Effect {
    constructor(canvas, context, numberOfParticles) {
        this.canvas = canvas
        this.context = context
        this.width = this.canvas.width
        this.height = this.canvas.height

        this.minDistanceBetweenParticles = 100
        this.context.fillStyle = "white"
        this.context.strokeStyle = "white"

        this.particles = []
        this.createParticles(numberOfParticles)

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


}


const effect = new Effect(canvas, context, 200)

function animate() {
    context.clearRect(0, 0, canvas.width, canvas.height)
    effect.animateParticles()
    requestAnimationFrame(animate)
}
animate()