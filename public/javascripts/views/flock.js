namespace('Flocking.Views')

Flocking.Views.Flock = function(config) {
  this.el = config.el
  this.collection = config.collection || []
  this.modelCollection = config.modelCollection || []

  this.run = function() {
    var ctx = this.el.getContext('2d')

    ctx.clearRect(0, 0, 400, 400)

    for (var i = 0; i < this.collection.length; i++) {
      this.collection[i].model.step(this.modelCollection.collection)
      this.collection[i].render()
    }

    window.requestAnimationFrame(this.run.bind(this))
  }

  this.render = function() {
    for (var i = 0; i < this.collection.length; i++) {
      this.collection[i].render()
    }
  }
}
