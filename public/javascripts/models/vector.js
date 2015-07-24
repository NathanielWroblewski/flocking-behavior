namespace('Flocking.Models')

Flocking.Models.Vector = function(x, y, z) {
  this.x = x || 0
  this.y = y || 0
  this.z = z || 0

  this.copy = function() {
    return new Flocking.Models.Vector(this.x, this.y, this.z)
  }

  this.magnitude = function() {
    return Math.sqrt((this.x * this.x) + (this.y * this.y) + (this.z * this.z))
  }

  this.normalize = function() {
    var magnitude = this.magnitude()
    if (magnitude > 0) this.divide(magnitude)
    return this
  }

  this.limit = function(max) {
    return this.magnitude() > max ? this.normalize().multiply(max) : this
  }

  this.heading = function() {
    return -Math.atan2(-this.y, this.x)
  }

  this.euclideanDistance = function(vector) {
    var dx = this.x - vector.x,
        dy = this.y - vector.y,
        dz = this.z - vector.z

    return Math.sqrt((dx * dx) + (dy * dy) + (dz * dz))
  }

  this.distance = function(vector, dimensions) {
    var dx = Math.abs(this.x - vector.x),
        dy = Math.abs(this.y - vector.y),
        dz = Math.abs(this.z - vector.z)

    if (dimensions) {
      dx = dx < dimensions.width  / 2 ? dx : dimensions.width  - dx
      dy = dx < dimensions.height / 2 ? dy : dimensions.height - dy
    }

    return Math.sqrt((dx * dx) + (dy * dy) + (dz * dz))
  }

  this.subtract = function(vector) {
    this.x -= vector.x
    this.y -= vector.y
    this.z -= vector.z
    return this
  }

  this.add = function(vector) {
    this.x += vector.x
    this.y += vector.y
    this.z += vector.z
    return this
  }

  this.divide = function(scalar) {
    this.x = this.x / scalar
    this.y = this.y / scalar
    this.z = this.z / scalar
    return this
  }

  this.multiply = function(scalar) {
    this.x = this.x * scalar
    this.y = this.y * scalar
    this.z = this.z * scalar
    return this
  }

  this.dot = function(vector) {
    (this.x * vector.x) + (this.y * vector.y) + (this.z * vector.z)
  }

  /**
   *  Not a strict projection as the argument isn't a unit vector
   **/
  this.projectOnto = function(vector) {
    return vector.copy().multiply(this.dot(vector))
  }

  /**
   *  Called on a position vector to return the wrapped representation closest
   *  to another location
   **/
  this.wrapRelativeTo = function(location, dimensions) {
    var clone = this.copy(),
        map   = { x: 'width', y: 'height' }

    for (coordinate in map) {
      var dimension = map[coordinate],
          distance  = this[coordinate] - location[coordinate],
          mapLength = dimensions[dimension]

      if (Math.abs(distance) > mapLength / 2) {
        if (distance > 0) {
          clone[coordinate] = -(mapLength - this[coordinate])
        } else {
          clone[coordinate] = this[coordinate] + mapLength
        }
      }
    }
    return clone
  }

  this.isInvalid = function() {
    return (
      this.x === Infinity || isNaN(this.x) ||
      this.y === Infinity || isNaN(this.y) ||
      this.z === Infinity || isNaN(this.z)
    )
  }
}

Flocking.Models.Vector.add = function(a, b) {
  return a.copy().add(b)
}

Flocking.Models.Vector.subtract = function(a, b) {
  return a.copy().subtract(b)
}

Flocking.Models.Vector.multiply = function(a, b) {
  return a.copy().multiply(b)
}

Flocking.Models.Vector.divide = function(a, b) {
  return a.copy().divide(b)
}
