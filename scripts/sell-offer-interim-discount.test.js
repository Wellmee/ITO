const Ito = require('../src/ito.js');

const NUM_DIGITS = 5;

test('distributing account is selling the interim tokens', function() {
  expect.assertions(8);
  return Ito.loadStuff().then(async function() {
    let acc = Ito.accounts.distributing.loaded;
    
    // find the token balance
    let b = acc.balances.find(x => x.asset_code == Ito.c.interimToken.code);
    
    // it exists and the selling liabilities are there
    expect(b).toBeDefined();
    // it's from the right issuer
    expect(b.asset_issuer).toBe(Ito.accounts.issuingInterim.loaded.accountId());
    // there's the selling liability
    expect(parseFloat(b.selling_liabilities)).toBeGreaterThan(parseFloat(Ito.c.interimToken.supply) - 5);

    // get the offers for the account
    let offers = await Ito.server.offers('accounts', acc.accountId()).call();
    
    // find our offer
    let o = offers.records.find(x => x.selling.asset_code == Ito.c.interimToken.code);

    // it exists 
    expect(o).toBeDefined();
    // it's from the distributing account
    expect(o.seller).toBe(acc.accountId());
    // we're buying xlm
    expect(o.buying.asset_type).toBe('native');
    // the price is right
    expect(parseFloat(o.price)).toBeCloseTo(parseFloat(Ito.c.interimToken.discountPriceInXlm), NUM_DIGITS);
    // amount is right too
    expect(parseFloat(o.amount)).toBeCloseTo(parseFloat(Ito.c.interimToken.supply), NUM_DIGITS);
  })
});