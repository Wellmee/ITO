
const Ito = require('./src/ito.js');
const StellarSdk = require('stellar-sdk');

var transaction;
var fileName = process.argv[2] ? process.argv[2] : './transactions/signed.json';


// load what's needed
Ito.loadStuff().then(function() {
// pry = require('pryjs'); eval(pry.it);
  transaction = Ito.transactionFromFile(fileName);
  // And finally, send it off to Stellar!
  return Ito.server.submitTransaction(transaction);
})  
.then(function(result) {
  Ito.logSuccess(result);
})
.catch(function(error) {
  Ito.logError(error);
});

