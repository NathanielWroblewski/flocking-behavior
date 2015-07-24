namespace('Flocking.Views')

Flocking.Views.Boid = function(config) {
  this.el    = config.el
  this.model = config.model

  this.makeTriangle = function() {
    var boid = new Path2D(),
        vertices = this.model.getVertices()

    for (var i = 0; i < vertices.length; i++) {
      var vertex = vertices[i]

      if (i) {
        boid.lineTo(vertex[0], vertex[1])
      } else {
        boid.moveTo(vertex[0], vertex[1])
      }
    }

    boid.closePath()
    return boid
  }

  this.draw = function(ctx, boid) {
    ctx.strokeStyle = '#666'
    ctx.stroke(boid)
    ctx.fillStyle = '#666'
    ctx.fill(boid)
  }

  this.rotate = function(ctx) {
    ctx.translate(this.model.location.x, this.model.location.y)
    ctx.rotate(this.model.velocity.heading() + (90 * (Math.PI / 180)))
    ctx.translate(-this.model.location.x, -this.model.location.y)
  }

  this.unrotate = function(ctx) {
    ctx.translate(this.model.location.x, this.model.location.y)
    ctx.rotate(-(this.model.velocity.heading() + (90 * (Math.PI / 180))))
    ctx.translate(-this.model.location.x, -this.model.location.y)
  }

  this.render = function() {
    var ctx  = this.el.getContext('2d'),
        boid = this.makeTriangle()

    this.rotate(ctx)
    this.draw(ctx, boid)
    this.unrotate(ctx)
  }
}
