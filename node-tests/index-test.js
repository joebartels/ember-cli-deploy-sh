/* jshint node: true */
'use strict';

const assert  = require('chai').assert;
const Plugin  = require('ember-cli-deploy-plugin');
const subject = require('../index.js');

const OPTIONS = { name: 'sh' };

describe('ember-cli-deploy-sh plugin', function() {
  /**
    SETUP
  */
  let plugin;

  beforeEach(function() {
    plugin = subject.createDeployPlugin(OPTIONS);
  });

  /**
    TESTS
  */
  it('returns ember-cli-deploy Plugin', function() {
    assert(plugin instanceof Plugin, 'returns ember-cli-deploy plugin');
  });

  it('defaultConfig', function() {
    let expectedConfig = { hooks: {} };
    let defaultConfig  = plugin.defaultConfig

    assert.deepEqual(defaultConfig, expectedConfig, 'correct default config');
  });

  describe('for each hook, executeTasksFor', function() {
    /**
      SETUP
    */
    let _executeTasks;
    let shellTasks = require('../lib/shell-tasks');

    let task = { command: 'echo pass' };
    let config = {
      sh: {
        hooks: {
          willDeploy: [ task ]
        }
      }
    };

    let context = { config };

    beforeEach(function() {
      plugin = subject.createDeployPlugin(OPTIONS);

      plugin.beforeHook(context);

      _executeTasks = shellTasks.executeTasks;  // save original reference
    });

    afterEach(function() {
      shellTasks.executeTasks = _executeTasks;  // restore original reference
    });


    /**
      TESTS
    */
    it('returns a fn that executes tasks', function() {
      let shellTasks = require('../lib/shell-tasks');

      shellTasks.executeTasks = function(hookName, tasks) {
        assert.equal(hookName, 'willDeploy', 'correct hookName');
        assert.equal(tasks.length, 1, 'correct # of tasks');
        assert.deepEqual(tasks[0], task, 'correct task')
      };

      plugin.willDeploy();
    });

    it('returns a fn that doesn\'t execute tasks when there are no tasks', function() {
      shellTasks.executeTasks = function() {
        assert(false, 'should not be called!')
      };

      plugin.didBuild();
    });

    it('does not execute tasks when config.hooks[hookName] does not return Array', function() {
      context.config.sh.hooks.didDeploy = task;

      shellTasks.executeTasks = function() {
        assert(false, 'should not be called!')
      };

      plugin.didDeploy();
    });

  });
});

