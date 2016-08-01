# Ember-cli-deploy-sh

### Configuration Options
**config/deploy.js**
```
var ENV = {
  ...
  sh: {
    hooks: {}
  }
  ...
};
```

#### hooks
```
{
  hooks: {
    willDeploy: [ {task} ]
  }
}
```


##### tasks
Tasks are just shell commands defined in a JS Object. 
**`command`**
* the shell command to execute

**`options`**
* the arguments to include with the shell command


This is an example of a task that makes a curl request:
```
require('dotenv').load();
var querystring = require('querystring');

{
  command: 'curl',
  options: {
    request: 'POST',
    form: ['file=@dist-deploy/index.html', 'version=' + process.env.VERSION,
    verbose: true,
    url: buildURL('https://api.com/new-release', { pass: process.env.PASSWORD })
  }
}

function buildURL(url, options) {
  return url + '?' + querystring.stringify(options);
}
```
