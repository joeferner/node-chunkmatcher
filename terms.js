'use strict';

var Matcher = require('./matcher');

function Terms () {
  this.tree = {};
}

Terms.prototype.createMatcher = function () {
  return new Matcher(this);
};

function populateTree (data, options, dataOffset, node) {
  if (dataOffset < data.length) {
    var v = data.readUInt8(dataOffset);
    if (!(v in node)) {
      node[v] = {};
    }
    populateTree(data, options, dataOffset + 1, node[v]);

    if (options.ignoreCase) {
      var ch = String.fromCharCode(v);
      var newV;
      if (ch >= 'a' && ch <= 'z') {
        newV = ch.toUpperCase().charCodeAt(0);
      } else {
        newV = ch.toLowerCase().charCodeAt(0);
      }
      if (!(newV in node)) {
        node[newV] = {};
      }
      populateTree(data, options, dataOffset + 1, node[newV]);
    }
  } else {
    node.options = options;
  }
}

Terms.prototype.add = function (data, options) {
  if (options && (typeof(options) === 'string')) {
    options = { value: options };
  }
  options = options || { };
  if (!('value' in options)) {
    options.value = data;
  }
  if (typeof(data) === 'string') {
    return this.add(new Buffer(data), options);
  }
  if (!(data instanceof Buffer)) {
    throw new Error('Invalid argument to add.');
  }

  populateTree(data, options, 0, this.tree);
};

Terms.prototype.toString = function (data) {
  return JSON.stringify(this.tree, null, '  ');
};

exports.Terms = Terms;
