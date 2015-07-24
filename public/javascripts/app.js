!function() {
  var canvas = document.querySelector('canvas'),
      width  = canvas.width,
      height = canvas.height

  var flock = new Flocking.Models.Flock({
    height: height,
    width:  width,
    boids:  70,
    model:  Flocking.Models.Boid
  })

  var flockingViews = []

  for (var i = 0; i < flock.collection.length; i++) {
    var boidView = new Flocking.Views.Boid({
      el:     canvas,
      model:  flock.collection[i],
      width:  width,
      height: height
    })

    flockingViews.push(boidView)
  }

  var flockView = new Flocking.Views.Flock({
    el: canvas,
    collection: flockingViews,
    modelCollection: flock
  })

  Flocking.Models.Mouse = new Flocking.Models.Vector()

  document.onmousemove = function(event) {
    var canvas = document.querySelector('canvas').getBoundingClientRect(),
        x = event.pageX - canvas.left,
        y = event.pageY - canvas.top

    Flocking.Models.Mouse = new Flocking.Models.Vector(x, y)
  }

  flockView.render()
  flockView.run()
}()
