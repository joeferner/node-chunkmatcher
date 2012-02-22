'use strict';

function Matcher (searchIndex) {
  this.results = [];
  this.partialMatches = [];
  this.searchIndex = searchIndex;
  this.offset = 0;
}

function hasChildren (treeNode) {
  for (var k in treeNode) {
    if (k === 'options') {
      continue;
    }
    return true;
  }
  return false;
}

Matcher.prototype.append = function (data) {
  if (typeof(data) === 'string') {
    return this.append(new Buffer(data));
  }
  if (!(data instanceof Buffer)) {
    throw new Error('Invalid argument to add.');
  }

  for (var i = 0; i < data.length; i++, this.offset++) {
    var v = data.readUInt8(i);

    // update partial matches
    for (var partialMatchIdx = 0; partialMatchIdx < this.partialMatches.length; partialMatchIdx++) {
      var partialMatch = this.partialMatches[partialMatchIdx];
      if (v in partialMatch.node) {
        partialMatch.node = partialMatch.node[v];
        if ('options' in partialMatch.node) {
          this.results.push({
            start: partialMatch.start,
            pattern: partialMatch.node.options.value
          });
        }
        if (!hasChildren(partialMatch.node)) {
          this.partialMatches.splice(partialMatchIdx, 1);
        }
      } else {
        this.partialMatches.splice(partialMatchIdx, 1);
      }
    }

    // start new partial match?
    if (v in this.searchIndex.tree) {
      var node = this.searchIndex.tree[v];

      // single character pattern
      if ('options' in node) {
        this.results.push({
          start: this.offset,
          pattern: node.options.value
        });
      }

      // could also be a multi character match as well
      this.partialMatches.push({
        start: this.offset,
        node: this.searchIndex.tree[v]
      });
    }
  }
};

module.exports = Matcher;
