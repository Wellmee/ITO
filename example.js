// - load account (or more), from file or ledger, from server
// - build transaction -> file
// - sign transaction -> file
// - submit transaction

// // globalni config:
// network: test/public

const Ito = require('./src/ito.js');
const StellarSdk = require('stellar-sdk');

var transaction;

// load what's needed
Ito.loadStuff().then(function() {
  // build the transaction
  transaction = new StellarSdk.TransactionBuilder(Ito.accounts.issuing.loaded)
    .addOperation(StellarSdk.Operation.payment({
      destination: Ito.accounts.distributing.loaded.accountId(),
      asset: StellarSdk.Asset.native(),
      amount: "10"
    }))
    .addMemo(StellarSdk.Memo.text('sending stuff'))
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

// dalsi krok - vzit tohle jako template, davat tomu akorat transakci a kdo to ma podepsat, zbytek je furt stejnej
