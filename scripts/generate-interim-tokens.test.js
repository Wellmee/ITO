const Ito = require('../src/ito.js');


test('distributing account has the interim tokens', async function() {
  expect.assertions(3);
  await Ito.loadStuff();
  let acc = Ito.accounts.distributing.loaded;
  // find the token balance
  let b = acc.balances.find(x => x.asset_code == Ito.c.interimToken.code);
  
  // it exists and the issuer and the balance are right
  expect(b).toBeDefined();
  expect(parseFloat(b.balance)).toBeGreaterThan(parseFloat(Ito.c.interimToken.supply) - 500);
  expect(b.asset_issuer).toBe(Ito.accounts.issuingInterim.loaded.accountId());
}, Ito.TEST_TIMEOUT);