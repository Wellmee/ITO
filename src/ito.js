/**
 * environment variables:
 * ITO_CONFIG .. name of the config file 
 * 
 * methods:
 * async loadStuff(): load whatever is needed from config
 * async sign(transaction, list of signing accounts)
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

ito.loadStuff = async function() {
  // config file
  const configFile = process.env.ITO_CONFIG ? `./config/${process.env.ITO_CONFIG}.json` : './config/config.json'
  const c = JSON.parse(fs.readFileSync(configFile, 'utf8'));
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
      // ledger
      // get the account number
      let accNum = Number(ito.c.accounts[a].split('-').slice(-1)[0]);

      // connect
      await ledgerWallet.connect(accNum);

      ito.accounts[a] = {
        accountType: 'ledger',
        accountName: a,
        publicKey: ledgerWallet.publicKey
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
  ito.transactionToFile(transaction, `./transactions/${fileId}-unsigned.txt`);

  // sign with each account
  for (var i = 0; i < signingAccounts.length; i++) {
    let a = signingAccounts[i];

    if (a.accountType == 'file'){
      // file: sign wih keypair
      transaction.sign(a.keypair);
    } else {
      // ledger
      console.log('Use ledger to sign the transaction');
      await ledgerWallet.sign(transaction);
    }
    // write signed xdr to a file
    ito.transactionToFile(transaction, `./transactions/${fileId}-${a.accountName}-signed.txt`);
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
}

ito.logSuccess = function(result) {
  console.log('Success! Results:', result);
}


/**
 * Exports
 */
module.exports = ito