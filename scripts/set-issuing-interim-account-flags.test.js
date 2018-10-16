const Ito = require('../src/ito.js');


let multi = {
  thresholds: { low_threshold: 2, med_threshold: 2, high_threshold: 2 }
}

test('issuing account has a revocable flag', function() {
  expect.assertions(1);
  return Ito.loadStuff().then(function() {
    var iss = Ito.accounts.issuingInterim.loaded;
    expect(iss.flags.auth_revocable).toBe(true);

  })
});