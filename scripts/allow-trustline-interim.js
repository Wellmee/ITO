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

let trustorList = Ito.getAccountList(trustor);

m.buildTransaction = function(){
  // apply offset
  let account = Ito.offsetSequenceNumber(Ito.accounts.issuingInterim.loaded, offset);
  let builder = new StellarSdk.TransactionBuilder(account);

  // for each trustor add an operation
  for (var i = 0; i < trustorList.length; i++) {
    let t = trustorList[i];
    builder.addOperation(StellarSdk.Operation.allowTrust({
      trustor: t.address,
      assetCode: Ito.c.interimToken.code, 
      authorize: shouldAuthorize
    }));
  }
  return builder
    .addMemo(StellarSdk.Memo.text('allowing trustline'))
    .build();
}

// check that the account exists and has the trustline
m.checkAccount = async function(){
  for (var i = 0; i < trustorList.length; i++) {
    await Ito.checkTrustline(trustorList[i].address, Ito.c.interimToken.code, Ito.accounts.issuingInterim.publicKey);
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
    signer: 'issuingInterim', 
    name: 'allowing-trustline',
    checkAccount: m.checkAccount
  });
}