namespace('Flocking.Models')

Flocking.Models.Flock = function(config) {
  this.height = config.height
  this.width  = config.width
  this.model  = config.model
  this.boids  = config.boids || 100
  this.boid   = config.boid  || {
    maxSpeed: 0.75,
    maxForce: 0.05,
    radius:   3
  }
  this.startPosition = new Flocking.Models.Vector(0.5, 0.5)

  this.initialize = function() {
    var start = new Flocking.Models.Vector(
      this.width * this.startPosition.x, this.height * this.startPosition.y
    )
    this.collection = []

    for (var i = 0; i < this.boids; i++) {
      var velocity = new Flocking.Models.Vector(
        (Math.random() * 2) - 1, (Math.random() * 2) - 1
      ).limit(this.boid.maxSpeed)
      var boid = new this.model({
        height:        this.height,
        width:         this.width,
        velocity:      velocity,
        startPosition: start,
        maxSpeed:      this.boid.maxSpeed,
        maxForce:      this.boid.maxForce,
        radius:        this.boid.radius
      })

      this.collection.push(boid)
    }
  }

  this.initialize()
}
