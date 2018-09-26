const Ito = require('../src/ito.js');
const StellarSdk = require('stellar-sdk');

const Multisig = require('./multisig-setup.js')

Multisig.masterAccount = 'issuing';
Multisig.signerAccount = 'issuingSigner';

Ito.completeTransaction(Multisig.buildTransaction, 'issuing');
