// for an account in param, allow trustline to the interim token
// through the issuingInterim account
const Ito = require('../src/ito.js');
const StellarSdk = require('stellar-sdk');

const m = {};

// params: trustor, [offset], [authorize] - if given, deauthorizes
const trustor = process.argv[2];
let offset = process.argv[3];
let shouldAuthorize = process.argv[4] ? false : true;

if (!trustor){
  throw "missing param!"
}

// check if file has been passed
// const fs = require('fs');
// if (fs.existsSync(trustor)) {
//   // read the file into a list of addresses
// } else {
//   // put it into an array
// }

m.buildTransaction = function(){
  // apply offset
  let account = Ito.offsetSequenceNumber(Ito.accounts.issuingInterim.loaded, offset);
  return new StellarSdk.TransactionBuilder(account)
    .addOperation(StellarSdk.Operation.allowTrust({
      trustor: trustor,
      assetCode: Ito.c.interimToken.code, 
      authorize: shouldAuthorize
    }))
    .addMemo(StellarSdk.Memo.text('allowing trustline'))
    .build();
}

// check that the account exists and has the trustline
m.checkAccount = async function(){
  await Ito.checkTrustline(trustor, Ito.c.interimToken.code, Ito.accounts.issuingInterim.publicKey);
}

/**
 * Exports
 */
module.exports = m

// if called directly, do it
if (require.main === module) {
  Ito.signToFile({
    buildTransaction: m.buildTransaction, 
    signer: 'issuingInterim', 
    name: 'allowing-trustline'
  });
}