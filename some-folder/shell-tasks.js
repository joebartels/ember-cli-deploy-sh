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
  var output = {
    log: this.log.bind(this),
    ui: this.ui
  };

  tasks.forEach(function(task, idx) {
    promiseChain = promiseChain.then(executeTask(name, task, output));
  });

  return promiseChain;
}

/**

  @method executeTask
  @param {String} name The hook name.
  @param {Object} task The task.
  @param {Object} output { log, ui } for logging.
  @return {Promise}
*/
function executeTask(name, task, output) {
  return function() {
    var validatedTask = validateTask(task);

    if (!validatedTask) {
      return Promise.reject(name + ': invalid task ' + taskIndex + ' found.');
    }

    output.log(name + ': executing shell task');
    var command = shell.buildCommand(validatedTask);

    return shell.runCommand(command, output.ui);
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
  if (typeof task.command !== 'string') {
    return;
  }

  if (task.options && typeof task.options !== 'object') {
    return;
  }

  return task;
}
