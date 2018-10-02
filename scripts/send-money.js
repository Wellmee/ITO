const Ito = require('../src/ito.js');
const StellarSdk = require('stellar-sdk');

const m = {};

// send some xlm
m.buildTransaction = function(){
  return new StellarSdk.TransactionBuilder(Ito.accounts.issuing.loaded)
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
  Ito.signToFile(m.buildTransaction, 'issuing', 'issuing-to-distributing-payment');
}

module.exports = m;