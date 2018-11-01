const Ito = require('../src/ito.js');


test('issuing account has a revocable flag', function() {
  expect.assertions(2);
  return Ito.loadStuff().then(function() {
    var iss = Ito.accounts.issuingInterim.loaded;
    expect(iss.flags.auth_revocable).toBe(true);
    expect(iss.flags.auth_required).toBe(true);
  })
}, Ito.TEST_TIMEOUT);