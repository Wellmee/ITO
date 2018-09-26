const Ito = require('../src/ito.js');
const StellarSdk = require('stellar-sdk');

const Multisig = require('./multisig-setup.js')

Multisig.masterAccount = 'distributing';
Multisig.signerAccount = 'distributingSigner';

Ito.completeTransaction(Multisig.buildTransaction, 'distributing');