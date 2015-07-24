namespace('Flocking.Models')

Flocking.Models.Boid = function(config) {
  this.width      = config.width
  this.height     = config.height
  this.radius     = config.radius     || 3
  this.location   = config.location   || false
  this.velocity   = config.velocity   || false
  this.maxSpeed   = config.maxSpeed   || 2
  this.maxForce   = config.maxForce   || 0.05

  this.renderedThisStep = config.renderedThisStep || false

  this.weights = {
    separation: 2,
    alignment:  1,
    cohesion:   1,
    gravity:    6
  }

  this.indicators = {
    separation:         true,
    separationRadius:   false,
    alignment:          true,
    alignmentNeighbors: false,
    cohesion:           true,
    cohesionMean:       false,
    cohesionNeighbors:  false,
    velocity:           true,
    neighbors:          true,
    neighborRadius:     true
  }

  this.desiredSeparation = config.desiredSeparation || 6
  this.neighborRadius    = config.neighborRadius    || 50
  this.wrapFactor        = config.wrapFactor        || 1
  this.mouseRepulsion    = config.mouseRepulsion    || 200
  this.mouseRadius       = config.mouseRadius       || 100

  this._separation   = new Flocking.Models.Vector()
  this._alignment    = new Flocking.Models.Vector()
  this._cohesion     = new Flocking.Models.Vector()
  this._cohesionMean = new Flocking.Models.Vector()

  this.initialize = function(options) {
    if (!options.velocity)      throw 'Boid requires an initial velocity'
    if (!options.startPosition) throw 'Boid requires an initial position'

    var diameter = this.radius * 2 * this.wrapFactor

    this.location = options.startPosition.copy()
    this.desiredSeparation = this.desiredSeparation * this.radius
    this.wrapDimensions = {
      north:  -diameter,
      west:   -diameter,
      east:   this.width  + diameter,
      south:  this.height + diameter,
      width:  this.width  + (2 * diameter),
      height: this.height + (2 * diameter)
    }
  }

  this.step = function(neighbors) {
    var acceleration = this._flock(neighbors).add(this._gravitate())

    this._move(acceleration)
  }

  this._move = function(acceleration) {
    this._wrap()
    this.velocity.add(acceleration).limit(this.maxSpeed)
    this.location.add(this.velocity)
  }

  this._wrap = function() {
    var x = this.location.x,
        y = this.location.y,
        compass = this.wrapDimensions

    if (x < compass.west)  this.location.x = compass.east
    if (y < compass.north) this.location.y = compass.south
    if (x > compass.east)  this.location.x = compass.west
    if (y > compass.south) this.location.y = compass.north
  }

  this._flock = function(neighbors) {
    var separationMean  = new Flocking.Models.Vector(),
        alignmentMean   = new Flocking.Models.Vector(),
        cohesionMean    = new Flocking.Models.Vector(),
        separationCount = 0,
        alignmentCount  = 0,
        cohesionCount   = 0

    for (var i = 0; i < neighbors.length; i++) {
      var boid = neighbors[i]

      if (this == boid) continue

      var distance = this.location.euclideanDistance(
        boid.location, this.wrapDimensions
      )

      if (distance > 0 && distance < this.desiredSeparation) {
        // normalized, weighted-by-distance vector that points away from neighbor
        separationMean.add(
          Flocking.Models.Vector
            .subtract(this.location, boid.location)
            .copy()
            .normalize()
            .divide(distance)
        )
      }

      if (distance > 0 && distance < this.neighborRadius) {
        alignmentMean.add(boid.velocity)
        alignmentCount++
        cohesionMean.add(
          boid.location.wrapRelativeTo(this.location, this.wrapDimensions)
        )
        cohesionCount++
      }
    }

    if (separationCount > 0) separationMean.divide(separationCount)
    if (alignmentCount  > 0) alignmentMean.divide(alignmentCount)
    if (cohesionCount   > 0) {
      cohesionMean.divide(cohesionCount)
    } else {
      cohesionMean = this.location.copy()
    }

    this._cohesionMean = cohesionMean.copy().subtract(this.location)
    var cohesionDirection = this.steerTo(cohesionMean)
    alignmentMean.limit(this.maxForce)

    this._separation = separationMean.multiply(this.weights.separation)
    this._alignment  = alignmentMean.multiply(this.weights.alignment)
    this._cohesion   = cohesionDirection.multiply(this.weights.cohesion)

    return this._separation.add(this._alignment).add(this._cohesion)
  }

  this._gravitate = function() {
    var gravity  = new Flocking.Models.Vector(),
        mouse    = new Flocking.Models.Vector.subtract(
          Flocking.Models.Mouse, this.location
        ),
        distance = mouse.magnitude() - this.mouseRadius

    if (distance < 0) {
      distance = 0.01
    } else if (distance < this.neighborRadius * 5) {
      gravity.add(mouse.normalize().divide(distance * distance)).multiply(-1)
    }

    return gravity.multiply(this.weights.gravity)
  }

  this.steerTo = function(target) {
    var desired  = Flocking.Models.Vector.subtract(target, this.location),
        distance = desired.magnitude()

    if (distance > 0) {
      desired.normalize()

      if (distance < 100.0) {
        desired.multiply(this.maxSpeed * (distance / 100.0))
      } else {
        desired.multiply(this.maxSpeed)
      }

      return desired.subtract(this.velocity).limit(this.maxForce)
    } else {
      return new Flocking.Models.Vector(0, 0)
    }
  }

  this.getVertices = function() {
    return [
      [this.location.x, this.location.y - (2 * this.radius)],
      [this.location.x - this.radius, this.location.y + 2 * this.radius],
      [this.location.x + this.radius, this.location.y + 2 * this.radius]
    ]
  }

  this.initialize(config || {})
}
