const Ito = require('../src/ito.js');


let multi = {
  thresholds: { low_threshold: 2, med_threshold: 2, high_threshold: 2 }
}

test('issuing and distributing accounts have multisig set up', function() {
  // return the promise, expect 6 expects
  expect.assertions(6);
  return Ito.loadStuff().then(function() {
    if (Ito.c.homeDomain){
      multi.home_domain = Ito.c.homeDomain;
    }

    let iss = Ito.accounts.issuingInterim.loaded;
    expect(iss).toMatchObject(multi);
    expect(iss.signers).toHaveLength(2);

    let iss2 = Ito.accounts.issuingFinal.loaded;
    expect(iss2).toMatchObject(multi);
    expect(iss2.signers).toHaveLength(2);

    let dis = Ito.accounts.distributing.loaded;
    expect(dis).toMatchObject(multi);
    expect(dis.signers).toHaveLength(2);
  })
});