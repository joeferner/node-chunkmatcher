# chunkmatcher

Fast searching for multiple patterns accross multiple data chunks.

This is useful if you have an http request that you want to search for terms and you don't want to buffer
the whole response or test boundary conditions for terms between chunks.

## Installation

```bash
$ npm install chunksearch
```

## Quick Examples

```javascript
var Terms = require("chunkmatcher").Terms;

var terms = new Terms();
terms.add('test', { ignoreCase: true });
terms.add('testing');
terms.add('search');

var matcher = terms.createMatcher();
matcher.append('test sear');
matcher.append('ching t te tes te');
matcher.append('sting test');
console.log(matcher.results);
// [
//   {
//     start: 0,
//     pattern: 'test'
//   },
//   {
//     start: 5,
//     pattern: 'search'
//   },
//   {
//     start: 24,
//     pattern: 'test'
//   },
//   {
//     start: 24,
//     pattern: 'testing'
//   },
//   {
//     start: 32,
//     pattern: 'test'
//   }
// ]
```

```javascript
var Terms = require("chunkmatcher").Terms;

var terms = new Terms();
terms.add('www.google.com');
var matcher = terms.createMatcher();

var options = {
  host: 'www.google.com',
  port: 80,
  path: '/index.html'
};
http.get(options, function (res) {
  res.on('data', function (chunk) {
    matcher.append(chunk);
  });
  res.on('end', function () {
    console.log(matcher.results);
  });
});
```
