# Ember-cli-deploy-sh

## Configuration Options

### hooks
Supports all will* and did* hooks:<br>
`willDeploy`, `willBuild`, `willPrepare`, `willUpload`, `willActivate`<br>
`didBuild`, `didPrepare`, `didUpload`, `didActivate`, `didDeploy`, `didFail`

Each hook takes an array of tasks
```
{
  sh: {
    hooks: {
      willDeploy: [ {task} ]
    }
  }
}
```


### task
A task is a shell commands defined in a JS Object. 

**`command`**
* the shell command to execute

**`options`**
* the arguments to include with the shell command
* are passed directly into [dargs](https://github.com/sindresorhus/dargs#usage) during formatting

This is an example of a task that makes a curl request:
```
require('dotenv').load();
var querystring = require('querystring');

{
  sh: {
    hooks: {
      didDeploy: [
        {
          command: 'curl',
          options: {
            request: 'POST',
            form: ['file=@dist-deploy/index.html', 'version=' + process.env.VERSION,
            verbose: true,
            url: buildURL('https://api.com/new-release', { pass: process.env.PASSWORD })
          }
        }      
      ]
    }
  }
}

function buildURL(url, options) {
  return url + '?' + querystring.stringify(options);
}
```
