const Ito = require('../src/ito.js');
const StellarSdk = require('stellar-sdk');


// params: filename, signer
const fileName = process.argv[2];
const signer = process.argv[3] ? process.argv[3] : [];



Ito.signAndSubmit(fileName, signer);

