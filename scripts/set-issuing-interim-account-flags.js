// for the interim token issuing account set the revocable flags
const Ito = require('../src/ito.js');
const StellarSdk = require('stellar-sdk');

const m = {};

// change signers and weights
m.buildTransaction = function(){
  return new StellarSdk.TransactionBuilder(Ito.accounts.issuingInterim.loaded)
    .addOperation(StellarSdk.Operation.setOptions({
      setFlags: StellarSdk.AuthRevocableFlag
    }))
    .addMemo(StellarSdk.Memo.text('set issuing acc flags'))
    .build();
}

/**
 * Exports
 */
module.exports = m

// if called directly, do it
if (require.main === module) {
  Ito.signToFile({
    buildTransaction: m.buildTransaction,
    signer: 'issuingInterim',
    name: 'setting-flags'
  });
}