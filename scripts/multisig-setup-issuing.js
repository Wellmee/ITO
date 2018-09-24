const Ito = require('../src/ito.js');
const StellarSdk = require('stellar-sdk');

var transaction;

// load what's needed
Ito.loadStuff().then(function() {
  // build the transaction
  transaction = new StellarSdk.TransactionBuilder(Ito.accounts.issuing.loaded)
    .addOperation(StellarSdk.Operation.setOptions({
      signer: {
        ed25519PublicKey: Ito.accounts.issuingSigner.publicKey,
        weight: 1
      }
    }))
    .addOperation(StellarSdk.Operation.setOptions({
      masterWeight: 1,
      lowThreshold: 2, // 1??? - if 1, allow trust needs just one
      medThreshold: 2,
      highThreshold: 2
    }))
    .addMemo(StellarSdk.Memo.text('setting multisig'))
    .build();

  // sign it
  return Ito.sign(transaction, Ito.accounts.issuing);
})
.then(function() {

  // And finally, send it off to Stellar!
  return Ito.server.submitTransaction(transaction);
})  
.then(function(result) {
  Ito.logSuccess(result);
})
.catch(function(error) {
  Ito.logError(error);
});