var assert  = require('chai').assert;
var subject = require('../index.js');
var Plugin  = require('ember-cli-deploy-plugin');

describe('ember-cli-deploy-sh plugin', function() {
  var plugin;
  var OPTIONS = { name: 'sh' };

  beforeEach(function() {
    plugin = subject.createDeployPlugin(OPTIONS);
  });

  it('returns ember-cli-deploy Plugin', function() {
    assert(plugin instanceof Plugin, 'returns ember-cli-deploy plugin');
  });

  it('defaultConfig', function() {
    var expectedConfig = { hooks: {} };
    var defaultConfig  = plugin.defaultConfig

    assert.deepEqual(defaultConfig, expectedConfig, 'correct default config');
  });

  describe('when executeTasksFor is used on a hook', function() {
    var context, config, executeTasks;
    var shellTasks = require('../lib/shell-tasks');

    beforeEach(function() {
      task = { command: 'echo pass' };

      config = {
        sh: {
          hooks: {
            willDeploy: [ task ]
          }
        }
      };

      plugin = subject.createDeployPlugin(OPTIONS);

      context = {
        config: config
      };

      plugin.beforeHook(context);

      _executeTasks = shellTasks.executeTasks;  // save original reference
    });

    afterEach(function() {
      shellTasks.executeTasks = _executeTasks;  // restore original reference
    });

    it('returns a fn that executes tasks', function() {
      var shellTasks = require('../lib/shell-tasks');

      shellTasks.executeTasks = function(hookName, tasks) {
        assert.equal(hookName, 'willDeploy', 'correct hookName');
        assert.equal(tasks.length, 1, 'correct # of tasks');
        assert.deepEqual(tasks[0], task, 'correct task')
      };

      plugin.willDeploy();
    });

    it('returns a fn that doesn\'t execute tasks when there are none', function() {
      shellTasks.executeTasks = function() {
        assert(false, 'should not be called!')
      };

      plugin.didBuild();
    });

    it('does not execute tasks when hook does not return Array', function() {
      config.sh.hooks.didDeploy = task;

      shellTasks.executeTasks = function() {
        assert(false, 'should not be called!')
      };

      plugin.didDeploy();
    });

  });
});

