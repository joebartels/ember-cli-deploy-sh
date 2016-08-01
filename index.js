/* jshint node: true */
'use strict';

var shellTasks        = require('./lib/shell-tasks');
var DeployPluginBase  = require('ember-cli-deploy-plugin');

module.exports = {
  name: 'ember-cli-deploy-sh',

  createDeployPlugin: function(options) {
    var DeployPlugin = DeployPluginBase.extend({
      name: options.name,

      defaultConfig: {
        hooks: {}
      },

      willDeploy: executeTasksFor('willDeploy'),

      willBuild: executeTasksFor('willBuild'),

      didBuild: executeTasksFor('didBuild'),

      willPrepare: executeTasksFor('willPrepare'),

      didPrepare: executeTasksFor('didPrepare'),

      willUpload: executeTasksFor('willUpload'),

      didUpload: executeTasksFor('didUpload'),

      willActivate: executeTasksFor('willActivate'),

      didActivate: executeTasksFor('didActivate'),

      didDeploy: executeTasksFor('didDeploy'),

      didFail: executeTasksFor('didFail')

    });

    return new DeployPlugin();
  },

  _executeTasksFor: executeTasksFor
};

function executeTasksFor(hookName) {
  return function() {
    var tasks = this.readConfig('hooks')[hookName];

    if (tasks && Array.isArray(tasks) && tasks.length > 0) {
      return shellTasks.executeTasks.call(this, hookName, tasks);
    }
  }
}
