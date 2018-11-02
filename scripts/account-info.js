const Ito = require('../src/ito.js');

var accountName = process.argv[2] ? process.argv[2] : 'account';

Ito.loadStuff().then(async function() {
  let acc;
  // acccount from the standard ones
  if (Ito.accounts[accountName]){
    acc = Ito.accounts[accountName].loaded;
  } else {
    // get it from a file or directly from the param
    let fileAccount = Ito.getAccountFromFile(accountName);
    let key = fileAccount ? fileAccount.publicKey : accountName;
    acc = await Ito.server.loadAccount(key);
  }
  let offers = await Ito.server.offers('accounts', acc.accountId()).call();

// pry = require('pryjs'); eval(pry.it);

  console.log(acc);
  console.log(offers);

})