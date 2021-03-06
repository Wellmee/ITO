var StellarSdk = require('stellar-sdk');
var fs = require('fs');
const ledgerWallet = require('stellar-ledger-wallet');

StellarSdk.Network.useTestNetwork();
var server = new StellarSdk.Server('https://horizon-testnet.stellar.org');

var keys2 = JSON.parse(fs.readFileSync('./test-accounts/account2.json', 'utf8'));

var destinationId = keys2.publicKey;

// Transaction will hold a built transaction we can resubmit if the result is unknown.
var transaction;

// First, check to make sure that the destination account exists.
// You could skip this, but if the account does not exist, you will be charged
// the transaction fee when the transaction fails.
server.loadAccount(destinationId)
  // If the account is not found, surface a nicer error message for logging.
  .catch(StellarSdk.NotFoundError, function (error) {
    throw new Error('The destination account does not exist!');
  })
  .then(function() {
    // connect the ledger
    return ledgerWallet.connect(0)
  })
  // If there was no error, load up-to-date information on your account.
  .then(function() {
    console.log('Ledger Wallet connected');
    const accountId = ledgerWallet.publicKey;
    console.log(accountId);
    // pry = require('pryjs'); eval(pry.it);
    return server.loadAccount(accountId);
  })
  .then(function(sourceAccount) {
    // Start building the transaction.
    transaction = new StellarSdk.TransactionBuilder(sourceAccount)
      .addOperation(StellarSdk.Operation.payment({
        destination: destinationId,
        // Because Stellar allows transaction in many currencies, you must
        // specify the asset type. The special "native" asset represents Lumens.
        asset: StellarSdk.Asset.native(),
        amount: "10"
      }))
      .addOperation(StellarSdk.Operation.payment({
        destination: destinationId,
        // Because Stellar allows transaction in many currencies, you must
        // specify the asset type. The special "native" asset represents Lumens.
        asset: StellarSdk.Asset.native(),
        amount: "12"
      }))
      // A memo allows you to add your own metadata to a transaction. It's
      // optional and does not affect how Stellar treats the transaction.
      .addMemo(StellarSdk.Memo.text('Test Transaction'))
      .build();

  })
  .then(function(){
    // Sign the transaction to prove you are actually the person sending it.
    return ledgerWallet.sign(transaction);
  }).then(function(){
    // And finally, send it off to Stellar!
    return server.submitTransaction(transaction);
  })
  .then(function(result) {
    console.log('Success! Results:', result);
  })
  .catch(function(error) {
    console.error('Something went wrong!', error);
    // If the result is unknown (no response body, timeout etc.) we simply resubmit
    // already built transaction:
    // server.submitTransaction(transaction);
  });