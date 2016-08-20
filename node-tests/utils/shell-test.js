const assert  = require('chai').assert;
const subject = require('../../utils/shell.js');

describe('Command', function() {
  assert.equal(1, 1, 'it works');
})

describe('#formatArgs', function() {

  it('formats an array of key/value arguments', function() {
    let args = [
      '--foo=bar',
      `--baz=goat in a boat`,
      '--multiple=equal=signs',
      '--truthy',
      'some',
      'option'
    ];

    let actual = subject.formatArgs(args);
    let expect =  `--foo bar ` +
                  `--baz 'goat in a boat' ` +
                  `--multiple 'equal=signs' ` +
                  `--truthy ` +
                  `some option`;

    assert.equal(actual, expect, 'Converts array of args correctly.');
  });
});

describe('#buildCommand', function() {
  var dummyCommand = ' echo "command test" ';

  var dummyOptions = {
    foo: 'bar',
    truthy: true,
    falsy: false,
    someOption: 'i am spacey',
    num: 24
  };

  var dummyOptionsWithMulti = {
    foo: ['A', 'B', 'C'],
    cookie: ['GMT=-5'],
    header: 'X-Forwarded-For: me.com',
    proxyHeader: ['Host: me.com']
  }

  it('Base command is trimmed', function() {
    let task = {
      command: ' echo "command test"',
      options: {}
    };

    var actual = subject.buildCommand(task);
    var expect = 'echo "command test"';

    assert.equal(actual, expect);
  });

});
