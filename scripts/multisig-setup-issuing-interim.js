// setup multisig for issuing account
const Ito = require('../src/ito.js');
const StellarSdk = require('stellar-sdk');

const Multisig = require('./multisig-setup.js')

Multisig.masterAccount = 'issuingInterim';
Multisig.signerAccount = 'issuingInterimSigner';

Ito.completeTransaction(Multisig.buildTransaction, 'issuingInterim');
