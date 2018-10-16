const Ito = require('../src/ito.js');


let multi = {
  thresholds: { low_threshold: 2, med_threshold: 2, high_threshold: 2 }
}

test('distributing account has the interim tokens', function() {
  expect.assertions(3);
  return Ito.loadStuff().then(function() {
    let iss = Ito.accounts.distributing.loaded;
    // find the token balance
    let b = iss.balances.find(x => x.asset_code == Ito.c.interimToken.code);
    
    // it exists and the issuer and the balance are right
    expect(b).toBeDefined();
    expect(parseFloat(b.balance)).toBeGreaterThan(Ito.c.interimToken.supply - 5);
    expect(b.asset_issuer).toBe(Ito.accounts.issuingInterim.loaded.accountId());
  })
});