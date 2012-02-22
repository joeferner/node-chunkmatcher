'use strict';

var Terms = require('../').Terms;
var http = require('http');

module.exports = {
  'find single match start of string on single character': function (test) {
    var terms = new Terms();
    terms.add('t');
    var matcher = terms.createMatcher();
    matcher.append('t searching');
    test.deepEqual(matcher.results, [
      {
        start: 0,
        pattern: 't'
      }
    ]);
    test.done();
  },

  'find single match start of string on single string': function (test) {
    var terms = new Terms();
    terms.add('test');
    var matcher = terms.createMatcher();
    matcher.append('test searching');
    test.deepEqual(matcher.results, [
      {
        start: 0,
        pattern: 'test'
      }
    ]);
    test.done();
  },

  'find using buffers': function (test) {
    var terms = new Terms();
    terms.add(new Buffer('test'), 'test');
    var matcher = terms.createMatcher();
    matcher.append(new Buffer('test searching'));
    test.deepEqual(matcher.results, [
      {
        start: 0,
        pattern: 'test'
      }
    ]);
    test.done();
  },

  'find multiple matches of a single string': function (test) {
    var terms = new Terms();
    terms.add('test');
    var matcher = terms.createMatcher();
    matcher.append('test searching t te tes testing test');
    test.deepEqual(matcher.results, [
      {
        start: 0,
        pattern: 'test'
      },
      {
        start: 24,
        pattern: 'test'
      },
      {
        start: 32,
        pattern: 'test'
      }
    ]);
    test.done();
  },

  'find matches with case insensitive matching': function (test) {
    var terms = new Terms();
    terms.add('test', { ignoreCase: true });
    var matcher = terms.createMatcher();
    matcher.append('test searching Test TEST tEsT');
    test.deepEqual(matcher.results, [
      {
        start: 0,
        pattern: 'test'
      },
      {
        start: 15,
        pattern: 'test'
      },
      {
        start: 20,
        pattern: 'test'
      },
      {
        start: 25,
        pattern: 'test'
      }
    ]);
    test.done();
  },

  'find multiple matches of a multiple string': function (test) {
    var terms = new Terms();
    terms.add('test');
    terms.add('testing');
    terms.add('search');
    var matcher = terms.createMatcher();
    matcher.append('test searching t te tes testing test');
    test.deepEqual(matcher.results, [
      {
        start: 0,
        pattern: 'test'
      },
      {
        start: 5,
        pattern: 'search'
      },
      {
        start: 24,
        pattern: 'test'
      },
      {
        start: 24,
        pattern: 'testing'
      },
      {
        start: 32,
        pattern: 'test'
      }
    ]);
    test.done();
  },

  'find multiple matches of a multiple string on multiple buffers': function (test) {
    var terms = new Terms();
    terms.add('test');
    terms.add('testing');
    terms.add('search');
    var matcher = terms.createMatcher();
    matcher.append('test sear');
    matcher.append('ching t te tes te');
    matcher.append('sting test');
    test.deepEqual(matcher.results, [
      {
        start: 0,
        pattern: 'test'
      },
      {
        start: 5,
        pattern: 'search'
      },
      {
        start: 24,
        pattern: 'test'
      },
      {
        start: 24,
        pattern: 'testing'
      },
      {
        start: 32,
        pattern: 'test'
      }
    ]);
    test.done();
  }

  /*
  , 'http search': function (test) {
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
        test.done();
      });
    });
  }
  */
};
