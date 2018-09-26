const Ito = require('../src/ito.js');


test('adds 1 + 2 to equal 3', function() {
  Ito.loadStuff().then(function() {
    expect(1 + 2).toBe(3);
  })
});