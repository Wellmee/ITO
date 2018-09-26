const Ito = require('../src/ito.js');


let multi = {
  thresholds: { low_threshold: 2, med_threshold: 2, high_threshold: 2 }
}

test('issuing and distributing accounts have multisig set up', function() {
  Ito.loadStuff().then(function() {
    var iss = Ito.accounts.issuing.loaded;
    expect(iss).toMatchObject(multi);
    expect(iss.signers).toHaveLength(2);

    var dis = Ito.accounts.distributing.loaded;
    expect(dis).toMatchObject(multi);
    expect(dis.signers).toHaveLength(2);
  })
});