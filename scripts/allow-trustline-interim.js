// for an account in param, allow trustline to the interim token
// through the issuingInterim account
const Ito = require('../src/ito.js');
const StellarSdk = require('stellar-sdk');

const m = {};

// params: trustor, [offset]
const trustor = process.argv[2];
let offset = process.argv[3];

if (!trustor){
  throw "missing param!"
}

m.buildTransaction = function(){
  // apply offset
  let account = Ito.offsetSequenceNumber(Ito.accounts.issuingInterim.loaded, offset);
  return new StellarSdk.TransactionBuilder(account)
    .addOperation(StellarSdk.Operation.allowTrust({
      trustor: trustor,
      assetCode: Ito.c.interimToken.code, 
      authorize: true
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