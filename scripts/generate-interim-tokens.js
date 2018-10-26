// send interim tokens from issuing to distributing
const Ito = require('../src/ito.js');
const StellarSdk = require('stellar-sdk');

const m = {};

// change signers and weights
m.buildTransaction = function(){
  return new StellarSdk.TransactionBuilder(Ito.accounts.issuingInterim.loaded)
    .addOperation(StellarSdk.Operation.payment({
      destination: Ito.accounts.distributing.loaded.accountId(),
      asset: new StellarSdk.Asset(Ito.c.interimToken.code, Ito.accounts.issuingInterim.loaded.accountId()),
      amount: Ito.c.interimToken.supply
    }))
    .addMemo(StellarSdk.Memo.text('generating interim tokens'))
    .build();
}

/**
 * Exports
 */
module.exports = m

// if called directly, do it
if (require.main === module) {
  Ito.signToFile(m.buildTransaction, 'issuingInterim', 'generate-interim-tokens');
}