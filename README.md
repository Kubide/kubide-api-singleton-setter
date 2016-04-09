# kubide-api-setter

Middleware to set environment params of the API, recive via params into the URL

Based as it does Kubide

## Installation

The best way to install it is using **npm**

```sh
npm install kubide-api-setter --save
```

## Loading

```js
var apiSetter = require('kubide-api-setter');
```

## Initialization and Usage

```js
var app = express();


app.use(apiSetter.init());
app.use(apiSetter.search());
app.use(apiSetter.sort());
app.use(apiSetter.pagination());
app.use(apiSetter.schema());
```


## Support

This plugin is proudly supported by [Kubide](http://kubide.es/) [hi@kubide.es](mailto:hi@kubide.es)

