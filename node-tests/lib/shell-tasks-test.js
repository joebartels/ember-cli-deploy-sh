'use strict';

const assert  = require('chai').assert;
const MockUI  = require('../helpers/mock-ui');
const subject = require('../../lib/shell-tasks.js');

describe('lib/shell-task.js', function() {
  const tasks = [
    {
      command: 'ember release',
      options: {
        major: true,
        local: true
      }
    },
    {
      command: 'cp -r dist/* backup-dist'
    }
  ];

  describe('#validateTask', function() {

    it('valid tasks are returned', function() {
      let task = {
        command: 'ember release',
        options: {
          major: true
        }
      };

      assert.equal(subject.validateTask(task), task, 'returns task.');
    });

    it('task can be a function', function() {
      let task = function() {
        return 'hey';
      }

      assert.equal(subject.validateTask(task), task, 'returns function');
    });

    it('task.command is required', function() {
      let task = {
        options: {}
      };

      assert.equal(subject.validateTask(task), undefined, 'command is required.');
    });

    it('task.options not required', function() {
      let task = {
        command: 'cp -r dist/* backup-dist'
      };

      assert.equal(subject.validateTask(task), task, 'returns task.');
    });

    it('task.options must be an object when provided', function() {
      let task1 = {
        command: 'cp -r dist/* backup-dist',
        options: null
      };

      let task2 = {
        command: 'cp -r dist/* backup-dist',
        options: 'foo'
      };

      let task3 = {
        command: 'cp -r dist/* backup-dist',
        options: true
      };

      assert.equal(subject.validateTask(task1), undefined, 'options cant be null.');
      assert.equal(subject.validateTask(task2), undefined, 'options cant be string.');
      assert.equal(subject.validateTask(task3), undefined, 'options cant be boolean.');
    });
  });
});
