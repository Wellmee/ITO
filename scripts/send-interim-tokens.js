// send interim tokens from issuing to distributing
const Ito = require('../src/ito.js');
const StellarSdk = require('stellar-sdk');
const fs = require('fs');
const m = {};

// an example on how not to do a script param interface
// params: destination, amount, [offset]
// or: destination.json, [offset]
const destination = process.argv[2];
if (!destination){
  throw "missing params destination!"
}

let destinationList = Ito.getAccountList(destination);
let offset;

if (fs.existsSync(destination)){
  // destination is a file, it's read already, so just use offset
  offset = process.argv[3];
} else {
  // destination is an address, so get amount and offset from params
  if (!amount){
    throw "missing params: amount!"
  }
  destinationList[0].amount = process.argv[3];
  offset = process.argv[4];
}

// payment in interim tokens
m.buildTransaction = function(){
  // apply offset
  let account = Ito.offsetSequenceNumber(Ito.accounts.distributing.loaded, offset);

  // add each destination as a payment operation
  let builder = new StellarSdk.TransactionBuilder(account);
  for (var i = 0; i < destinationList.length; i++) {
    let d = destinationList[i];
    builder.addOperation(StellarSdk.Operation.payment({
      destination: d.address,
      asset: new StellarSdk.Asset(Ito.c.interimToken.code, Ito.accounts.issuingInterim.loaded.accountId()),
      amount: d.amount
    }))
  }

  return builder
    .addMemo(StellarSdk.Memo.text('sending WLMI tokens'))
    .build();
}

// check that each account exists and has the trustline
m.checkAccount = async function(){
  for (var i = 0; i < destinationList.length; i++) {
    await Ito.checkTrustline(destinationList[i].address, Ito.c.interimToken.code, Ito.accounts.issuingInterim.publicKey);
  }
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