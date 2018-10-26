// send interim tokens from issuing to distributing
const Ito = require('../src/ito.js');
const StellarSdk = require('stellar-sdk');

const m = {};

// params: destination, amount
const destination = process.argv[2];
const amount = process.argv[3];

if ((!destination) || (!amount)){
  throw "missing params!"
}

// change signers and weights
m.buildTransaction = function(){
  return new StellarSdk.TransactionBuilder(Ito.accounts.distributing.loaded)
    .addOperation(StellarSdk.Operation.payment({
      destination: destination,
      asset: new StellarSdk.Asset(Ito.c.interimToken.code, Ito.accounts.issuingInterim.loaded.accountId()),
      amount: amount
    }))
    .addMemo(StellarSdk.Memo.text('sending WLMI tokens'))
    .build();
}

/**
 * Exports
 */
module.exports = m

// if called directly, do it
if (require.main === module) {
  Ito.signToFile(m.buildTransaction, 'distributing', 'sending-interim-tokens');
}