// delete a sell offer with the given id
const Ito = require('../src/ito.js');
const StellarSdk = require('stellar-sdk');

var offerId = process.argv[2];

const m = {};


m.buildTransaction = function(){
  // find the offfer with the given Id
  let o = Ito.accounts.distributing.offers.records.find(x => x.id == offerId);
  if (! o){
    throw "Id not found";
  }
  return new StellarSdk.TransactionBuilder(Ito.accounts.distributing.loaded)
    // amount 0 meanse delete
    .addOperation(StellarSdk.Operation.manageOffer({
      selling: new StellarSdk.Asset(
        o.selling.asset_code, 
        o.selling.asset_issuer
      ),
      buying: StellarSdk.Asset.native(),
      amount: '0',
      price: o.price,
      offerId: offerId
    }))
    .addMemo(StellarSdk.Memo.text('delete-sell-offer'))
    .build();
}

/**
 * Exports
 */
module.exports = m

// if called directly, do it
if (require.main === module) {
  Ito.signToFile(m.buildTransaction, 'distributing', 'delete-sell-offer', true);
}