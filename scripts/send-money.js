// send some lumens from issuingInterim to distributing
const Ito = require('../src/ito.js');
const StellarSdk = require('stellar-sdk');

const m = {};

// send some xlm
m.buildTransaction = function(){
  return new StellarSdk.TransactionBuilder(Ito.accounts.issuingInterim.loaded)
    .addOperation(StellarSdk.Operation.payment({
      destination: Ito.accounts.distributing.loaded.accountId(),
      asset: StellarSdk.Asset.native(),
      amount: "10"
    }))
    .addMemo(StellarSdk.Memo.text('Test Transaction'))
    .build();
}

// if called directly, do it
if (require.main === module) {
  Ito.signToFile(m.buildTransaction, 'issuingInterim', 'issuing-to-distributing-payment');
}

module.exports = m;