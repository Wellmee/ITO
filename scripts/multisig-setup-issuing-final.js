// setup multisig for issuing account
const Ito = require('../src/ito.js');
const StellarSdk = require('stellar-sdk');

const Multisig = require('./multisig-setup.js')

Multisig.masterAccount = 'issuingFinal';
Multisig.signerAccount = 'issuingFinalSigner';

Ito.completeTransaction(Multisig.buildTransaction, 'issuingFinal');
