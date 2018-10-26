const Ito = require('../src/ito.js');

var accountName = process.argv[2] ? process.argv[2] : 'account';

Ito.loadStuff().then(async function() {
  var acc = Ito.accounts[accountName].loaded;
  let offers = await Ito.server.offers('accounts', acc.accountId()).call();

// pry = require('pryjs'); eval(pry.it);

  console.log(acc);
  console.log(offers);

})