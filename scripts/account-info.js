const Ito = require('../src/ito.js');

var accountName = process.argv[2] ? process.argv[2] : 'account';

Ito.loadStuff().then(function() {
  var iss = Ito.accounts[accountName].loaded;
// pry = require('pryjs'); eval(pry.it);

  console.log(iss);

})