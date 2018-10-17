// create a sell offer for the interim token
const Ito = require('../src/ito.js');
const StellarSdk = require('stellar-sdk');

const m = {};

m.buildTransaction = function(){
  return new StellarSdk.TransactionBuilder(Ito.accounts.distributing.loaded)
    .addOperation(StellarSdk.Operation.manageOffer({
      selling: new StellarSdk.Asset(
        Ito.c.interimToken.code, 
        Ito.accounts.issuingInterim.loaded.accountId()
      ),
      buying: StellarSdk.Asset.native(),
      amount: Ito.c.interimToken.supply,
      price: Ito.c.interimToken.priceInXlm
    }))
    .addMemo(StellarSdk.Memo.text('sell-offer'))
    .build();
}

/**
 * Exports
 */
module.exports = m

// if called directly, do it
if (require.main === module) {
  Ito.signToFile(m.buildTransaction, 'distributing', 'sell-offer');
}