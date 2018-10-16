/**
 * environment variables:
 * ITO_CONFIG .. name of the config file 
 * 
 * methods:
 * async loadStuff(): load whatever is needed from config
 * async sign(transaction, list of signing accounts) must be called after loadStuff() is finished
 * logSuccess(result)
 * logError(error)
 * 
 * after loadStuff, there's:
 * ito.server
 * ito.accounts.<name> that has:
 *  accountType: file/ledger
 *  accountName: from config
 *  publicKey
 *  keypair: just for accountType file
 *  
 */

const ito = {};

const StellarSdk = require('stellar-sdk');
const fs = require('fs');
const ledgerWallet = require('stellar-ledger-wallet');


/**
 * Methods
 */

ito.completeTransaction = function(buildTransaction, signer){
  var transaction;

  // load what's needed
  ito.loadStuff(signer).then(function() {
    // build the transaction
    transaction = buildTransaction();

    // sign it
    return ito.sign(transaction, signer);
  })
  .then(function() {

    // And finally, send it off to Stellar!
    return ito.server.submitTransaction(transaction);
  })  
  .then(function(result) {
    ito.logSuccess(result);
  })
  .catch(function(error) {
    ito.logError(error);
  });
}

ito.signToFile = function(buildTransaction, signer, name){
  var transaction;
  var fileName = `transactions-to-sign/${name}.xdr`
  // load what's needed
  ito.loadStuff(signer).then(function() {
    // build the transaction
    transaction = buildTransaction();

    // sign it
    return ito.sign(transaction, signer);
  })
  .then(function() {
    // write it to a file
    ito.transactionToFile(transaction, fileName);
    return; 
  })  
  .then(function(result) {
    ito.logSuccess(`written to ${fileName}`);
  })
  .catch(function(error) {
    ito.logError(error);
  });
}

ito.signAndSubmit = function(fileName, signer){
  var transaction;

  ito.loadStuff(signer).then(function() {
    
    // get the transaction from file
    transaction = ito.transactionFromFile(fileName);

    // sign it
    return ito.sign(transaction, signer);
  })
  .then(function() {
    // And finally, send it off to Stellar!
    return ito.server.submitTransaction(transaction);
  })  
  .then(function(result) {
    ito.logSuccess(result);
  })
  .catch(function(error) {
    ito.logError(error);
  });
}

ito.loadStuff = async function(accountToLoad) {
  // config file
  const configFile = process.env.ITO_CONFIG ? `./config/${process.env.ITO_CONFIG}.json` : './config/config.json'
  const c = JSON.parse(fs.readFileSync(configFile, 'utf8'));
  const ledgerPublicKeys = JSON.parse(fs.readFileSync('./config/ledger-public-keys.json', 'utf8'));
  
  ito.c = c;

  // network
  StellarSdk.Network[c.network.usemethod]();
  ito.server = new StellarSdk.Server(c.network.networkPassphrase);

  // accounts and keypairs
  ito.accounts = {}
  ito.keypairs = {}
  for (var a in c.accounts) {
    // skip loop if the property is from prototype
    if (!c.accounts.hasOwnProperty(a)) continue;

    // get the account from the file / ledger
    if (ito.c.accounts[a].startsWith('ledger')) {
      let publicKey;

      // if it should be loaded
      if (a == accountToLoad) {
        // ledger
        // get the account number
        let accNum = Number(ito.c.accounts[a].split('-').slice(-1)[0]);

        // connect
        await ledgerWallet.connect(accNum);
        publicKey = ledgerWallet.publicKey;
      } else {
        // just get the publicKey from the file
        publicKey = ledgerPublicKeys[ito.c.accounts[a]];
      }

      ito.accounts[a] = {
        accountType: 'ledger',
        accountName: a,
        publicKey: publicKey
      }
    } else {   
      // file - take stuff from the config and add a few things
      let accountFile = `./test-accounts/${ito.c.accounts[a]}.json`;
      ito.accounts[a] = JSON.parse(fs.readFileSync(accountFile, 'utf8'));
      Object.assign(ito.accounts[a], {
        accountType: 'file',
        accountName: a,
        keypair: StellarSdk.Keypair.fromSecret(ito.accounts[a].secretKey)
      });
    }

    // load it
    ito.accounts[a].loaded = await ito.server.loadAccount(ito.accounts[a].publicKey);

  };
}

ito.sign = async function(transaction, signingAccounts) {
  if (! Array.isArray(signingAccounts)){
    signingAccounts = [signingAccounts];
  }
  let fileId = transaction.source.substr(0,5);

  // write the xdr to a file
  ito.transactionToFile(transaction, `./transactions/${fileId}-unsigned.xdr`);

  // sign with each account
  for (var i = 0; i < signingAccounts.length; i++) {
    let a = signingAccounts[i];
    if (typeof a === 'string' || a instanceof String){
      a = ito.accounts[a]
    }

    if (a.accountType == 'file'){
      // file: sign wih keypair      
      transaction.sign(a.keypair);
    } else {
      // ledger
      console.log('Use ledger to sign the transaction');
      await ledgerWallet.sign(transaction);
    }
    // write signed xdr to a file
    ito.transactionToFile(transaction, `./transactions/${fileId}-${a.accountName}-signed.xdr`);
  }
}

ito.transactionFromFile = function(fileName) {
  // read transaction from file  
  let xdr = fs.readFileSync(fileName, 'utf8');
  return new StellarSdk.Transaction(xdr);
}

ito.transactionToFile = function(transaction, fileName) {
  let xdr = transaction.toEnvelope().toXDR().toString('base64');
  fs.writeFileSync(fileName, xdr , 'utf-8');
}

ito.logError = function(error) {
  console.error('Something went wrong!', error);
  if (error.response.data && error.response.data.extras){
    console.error('Error code (hopefully): ', error.response.data.extras)
  }
}

ito.logSuccess = function(result) {
  console.log('Success! Results:', result);
  console.log('If hanging, quit the stellar app on your ledger');
}


/**
 * Exports
 */
module.exports = ito