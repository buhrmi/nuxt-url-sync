const path = require('path')

module.exports = function(options) {
  this.addPlugin({
    src: path.resolve(__dirname, 'plugin.js'),
    options
  })
}
