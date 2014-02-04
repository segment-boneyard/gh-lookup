
var find = require('../')._find;
var assert = require('assert');

var tags = '1.2.4 2.0.0 1.2.5a 03.01.01 2.9.9 3.x qwerty'.split(' ').map(function(tag) {
  return {
    name: tag,
    zipball_url: 'https://api.github.com/repos/user/repo/zipball/'+tag,
    tarball_url: 'https://api.github.com/repos/user/repo/tarball/'+tag,
    commit: {
      sha: 'ff23423d34d9d7f829d160aeb91b5c939ab4a4e1',
      url: 'https://api.github.com/repos/user/repo/commits/ff23423d34d9d7f829d160aeb91b5c939ab4a4e1',
    },
  }
})

function addtest(spec, ver) {
  return function() {
    var result = find({version: spec}, tags);
    if (ver == null) {
      assert.equal(result, null);
    } else {
      assert.equal(result.name, ver);
      assert(result.tarball_url.indexOf('tarball/'+ver) != -1);
    }
  }
}

describe('find', function(){
  it('should resolve 1.x', addtest('1.x', '1.2.5a'));
  it('should resolve *', addtest('*', '03.01.01'));
  it('should resolve invalid version to itself', addtest('qwerty', 'qwerty'));
  it('should prioritize exact match', addtest('3.x', '3.x'));
  it('should not resolve 4.x', addtest('4.x', null));
  it('should not resolve foobar', addtest('foobar', null));
})

