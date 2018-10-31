// add trustline from distributing to issuing interim
const Ito = require('../src/ito.js');
const StellarSdk = require('stellar-sdk');

const m = {};

m.buildTransaction = function(){
  return new StellarSdk.TransactionBuilder(Ito.accounts.distributing.loaded)
    .addOperation(StellarSdk.Operation.changeTrust({
      asset: new StellarSdk.Asset(Ito.c.interimToken.code, Ito.accounts.issuingInterim.loaded.accountId()),
      limit: (Number(Ito.c.interimToken.supply) * 1.05).toString()
    }))
    .addMemo(StellarSdk.Memo.text('adding trustline'))
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
    signer: 'distributing', 
    name: 'adding-trustline'
  });
}