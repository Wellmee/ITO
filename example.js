// - load account (or more), from file or ledger, from server
// - build transaction -> file
// - sign transaction -> file
// - submit transaction

// // globalni config:
// network: test/public

const Ito = require('./src/ito.js');
const StellarSdk = require('stellar-sdk');

const m = {};

// pry = require('pryjs'); eval(pry.it);

// payment transaction
m.buildTransaction = function (){
  return new StellarSdk.TransactionBuilder(Ito.accounts.issuing.loaded)
    .addOperation(StellarSdk.Operation.payment({
      destination: Ito.accounts.distributing.loaded.accountId(),
      asset: StellarSdk.Asset.native(),
      amount: "10"
    }))
    .addMemo(StellarSdk.Memo.text('sending stuff'))
    .build();
}

// signers of the transaction
m.signers = ['issuing', 'issuingSigner'];

// if called directly, do it
if (require.main === module) {
  Ito.completeTransaction(buildTransaction, m.signers);
}

module.exports = m;