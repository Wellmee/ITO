const Ito = require('../src/ito.js');
const StellarSdk = require('stellar-sdk');

const m = {};

// m.masterAccount, m.signerAccount defined elsewhere

// change signers and weights
m.buildTransaction = function(){
  return new StellarSdk.TransactionBuilder(Ito.accounts[m.masterAccount].loaded)
    .addOperation(StellarSdk.Operation.setOptions({
      signer: {
        ed25519PublicKey: Ito.accounts[m.signerAccount].publicKey,
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
}

/**
 * Exports
 */
module.exports = m
// no calling directly