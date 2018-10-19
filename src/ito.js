/**
 * environment variables:
 * ITO_CONFIG .. name of the config file 
 * 
 * methods:
 * completeTransaction(buildTransaction function, signer): does the complete transaction lifecycle - build, sign, submit, buildTransaction is a callback defined by the caller that builds and returns the transaction. Just one signer supported
 * signToFile(buildTransaction function, signer, name from which the fileName will be generated): does first two steps in transaction lifecycle: build, sign. Then it writes the transaction xdr to a file
 * signAndSubmit(fileName, signer): does the second two steps in transaction lifecycle: sign, submit. The built transaction is taken from a file.
 * sign(fileName, signers): takes transaction from a file, signs it and writes the xdr to another file.
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

ito.hasLedger = false;

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

ito.signToFile = function(buildTransaction, signer, name, loadOffers){
  var transaction;
  var fileName = `transactions-to-sign/${name}.xdr`
  // load what's needed
  ito.loadStuff(signer, loadOffers).then(function() {
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

ito.loadStuff = async function(accountToLoad, loadOffers) {
  // config file
  const configFile = process.env.ITO_CONFIG ? `./config/${process.env.ITO_CONFIG}.json` : './config/config.json'
  const c = JSON.parse(fs.readFileSync(configFile, 'utf8'));
  const ledgerPublicKeys = JSON.parse(fs.readFileSync('./config/ledger-public-keys.json', 'utf8'));
  
  ito.c = c;

  // network
  StellarSdk.Network[c.network.usemethod]();
  ito.server = new StellarSdk.Server(c.network.serverURL);

  // accounts and keypairs
  ito.accounts = {}
  ito.keypairs = {}
  for (var a in c.accounts) {
    // skip loop if the property is from prototype
    if (!c.accounts.hasOwnProperty(a)) continue;

    // get the account from the file / ledger
    if (ito.c.accounts[a].includes('ledger')) {
      let publicKey;

      // if it should be loaded
      if (a == accountToLoad) {
        // ledger
        ito.hasLedger = true;

        // get the account number and name
        let partsList = ito.c.accounts[a].split('-');
        let accNum = Number(partsList.slice(-1)[0]);
        let deviceName = `${partsList[0]}-${partsList[1]}`;

        console.log(`Connect the device: ${deviceName}`);

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

    // load offers if it should be done
    if (loadOffers && a == accountToLoad){
      ito.accounts[a].offers = await ito.server.offers('accounts', ito.accounts[a].publicKey).call();
    }

  };
}

ito.sign = async function(transaction, signingAccounts, outputName) {
  // if transaction is a filename, read it
  if (typeof transaction === 'string' || transaction instanceof String){
    transaction = ito.transactionFromFile(transaction);
  }
  // if single signer, put it into an array
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
    let name = outputName ? outputName : `${fileId}-${a.accountName}-signed`;
    let outputFileName = `./transactions/${name}.xdr`;
    ito.transactionToFile(transaction, outputFileName);
    // if they asked for it, inform
    if (outputName){
      console.log(`Transaction written to ${outputFileName}`);
    }
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
  if (error.response && error.response.data && error.response.data.extras){
    console.error('Error code (hopefully): ', error.response.data.extras)
  }
}

ito.logSuccess = function(result) {
  console.log('Success! Results:', result);
  if (ito.hasLedger){
    console.log('Now, quit the Stellar app on your ledger...');
  }
}


/**
 * Exports
 */
module.exports = ito