const assert  = require('chai').assert;
const MockUI  = require('../helpers/mock-ui');
const subject = require('../../utils/shell');

describe('utils/shell.js', function() {

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

    it('trims whitespace', function() {
      let task = {
        command: ' echo "command test"',
        options: {}
      };

      let actual = subject.buildCommand(task);
      let expect = 'echo "command test"';

      assert.equal(actual, expect, 'command is trimmed');
    });

    /**
      Considers:
        Simple key value
        Array of option with 1 element
        An option turns from camelcase to dasherized
        Array of option with multiple elements
        A false value appends --no- in front
        A true value shows up as cli arg
    */
    it('builds a properly formatted command', function() {
      let task = {
        command: 'curl',
        options: {
          url: 'https://example.com',
          cookie: ['GMT=-5'],
          proxyHeader: ['X-Host: example.com'],
          foo: ['A', 'B', 'C'],
          buffer: false,
          verbose: true
        }
      }

      let actual = subject.buildCommand(task);
      let expect =  `curl `+
                    `--url 'https://example.com' ` +
                    `--cookie 'GMT=-5' ` +
                    `--proxy-header 'X-Host: example.com' ` +
                    `--foo A --foo B --foo C ` +
                    `--no-buffer ` +
                    `--verbose`

      assert.equal(actual, expect, 'command properly formatted');
    });
  });

  describe('#runCommand', function() {

    it('resolves a promise on successfull completion', function() {
      let ui = new MockUI();
      let command = 'sleep .25 && exit 0';
      let log = ui.writeLine.bind(ui);

      return subject.runCommand(command, log).then(result => {
        let expect = command;
        let actual = ui.escaped();

        assert.equal(actual, expect, 'Runs the correct command');
        assert.ok(true, 'Command resolved a promise');
      })
      .catch(err => {
        console.log(err);
        assert.ok(false, "Command error'ed out :(")
      });
    });

    it('Rejects a promise on non-zero exit code', function() {
      let ui = new MockUI();
      let command = 'sleep .25 && exit 1';
      let log = ui.writeLine.bind(ui);

      return subject.runCommand(command, log).then(result => {
        assert.ok(false, "Command resolved a promise");
      })
      .catch(err => {
        assert.ok(true, "Command error'ed out :)");
      }).finally(function() {
        let expect = command;
        let actual = ui.escaped()

        assert.equal(actual, expect, "Runs the correct command");
      })
    });
  });
});
