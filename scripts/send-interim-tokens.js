// send interim tokens from issuing to distributing
const Ito = require('../src/ito.js');
const StellarSdk = require('stellar-sdk');
// const Big = require('big.js');

const m = {};

// params: destination, amount
const destination = process.argv[2];
const amount = process.argv[3];
let offset = process.argv[4];

if ((!destination) || (!amount)){
  throw "missing params!"
}

// payment in interim tokens
m.buildTransaction = function(){
  let account = Ito.accounts.distributing.loaded;
  // if there's an offset increment the account sequence number
  if (offset){
    offset = parseInt(offset);
    for (var i = 0; i < offset; i++) {
      account.incrementSequenceNumber();
    }
  }

  return new StellarSdk.TransactionBuilder(account)
    .addOperation(StellarSdk.Operation.payment({
      destination: destination,
      asset: new StellarSdk.Asset(Ito.c.interimToken.code, Ito.accounts.issuingInterim.loaded.accountId()),
      amount: amount
    }))
    .addMemo(StellarSdk.Memo.text('sending WLMI tokens'))
    .build();
}

// check that the account exists and has the trustline
m.checkAccount = async function(){
  await Ito.checkTrustline(destination, Ito.c.interimToken.code, Ito.accounts.issuingInterim.publicKey);
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
    name: 'sending-interim-tokens',
    checkAccount: m.checkAccount
  });
}