// create a sell offer for the interim token
const Ito = require('../src/ito.js');
const StellarSdk = require('stellar-sdk');

var discountOfferId = process.argv[2];
var newAmount = process.argv[3];

if ((!discountOfferId) || (!newAmount)){
  throw "missing params!"
}

const m = {};

m.buildTransaction = function(){
  // find the one with the given Id
  let o = Ito.accounts.distributing.offers.records.find(x => x.id == discountOfferId);
  if (! o){
    throw "Id not found";
  }

  return new StellarSdk.TransactionBuilder(Ito.accounts.distributing.loaded)
    // delete the discount
    .addOperation(StellarSdk.Operation.manageOffer({
      selling: new StellarSdk.Asset(
        o.selling.asset_code, 
        o.selling.asset_issuer
      ),
      buying: StellarSdk.Asset.native(),
      amount: '0',
      price: o.price,
      offerId: discountOfferId
    }))
    // create the new offer
    .addOperation(StellarSdk.Operation.manageOffer({
      selling: new StellarSdk.Asset(
        Ito.c.interimToken.code, 
        Ito.accounts.issuingInterim.loaded.accountId()
      ),
      buying: StellarSdk.Asset.native(),
      amount: newAmount,
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
  Ito.signToFile(m.buildTransaction, 'distributing', 'sell-offer', true);
}