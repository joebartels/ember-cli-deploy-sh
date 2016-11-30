var MockUI    = require('console-ui/mock');
var stripAnsi = require('strip-ansi');

module.exports = MockUI;

MockUI.prototype.escaped = function(output) {
  output = output || this.output || '';
  var stripped = stripAnsi(output);
  var trimmed = stripped.trim();
  return trimmed;
}
