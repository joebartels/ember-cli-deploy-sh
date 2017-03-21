'use strict';

var Promise = require('ember-cli/lib/ext/promise');
var shell   = require('../utils/shell');

module.exports = {
  executeTasks: executeTasks,

  executeTask: executeTask,

  validateTask: validateTask
};

/**
  @method executeTasks
  @param {String} name The hook name
  @param {Array} tasks An array of tasks
  @return {Promise}
**/
function executeTasks(name, tasks) {
  var promiseChain = Promise.resolve();
  var log = this.log.bind(this);

  tasks.forEach(function(task, idx) {
    promiseChain = promiseChain.then(executeTask(name, task, log, idx));
  });

  return promiseChain;
}

/**

  @method executeTask
  @param {String} name The hook name.
  @param {Object} task The task.
  @param {Function} log
  @return {Promise}
*/
function executeTask(name, task, log, idx) {
  return function() {
    var validatedTask = validateTask(task);

    if (!validatedTask) {
      return Promise.reject(name + ': invalid tasks[' + idx + '].');
    }

    log(name + ': executing shell task');

    if (typeof task === 'function') {
      return shell.runFunction(task);
    }

    var fail = (typeof task.fail === 'undefined') ? true : task.fail;
    var command = shell.buildCommand(validatedTask);

    return shell.runCommand(command, fail, log);
  }
}

/**
  Performs basic validation on a task:
  1. `command` property exists and is a string.
  2. `options` property is an object.

  @method validateTasks
  @param {Object} task
**/
function validateTask(task) {
  if (typeof task === 'function') {
    return task;
  }

  if (typeof task.command !== 'string') {
    return;
  }

  if (task.options === null) {
    return;
  }

  if (task.options && typeof task.options !== 'object') {
    return;
  }

  return task;
}
