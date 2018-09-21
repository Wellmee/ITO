/**
 * async loadStuff(): load whatever is needed from config
 * async sign(transaction, list of signing accounts)
 * logSuccess(result)
 * logError(error)
 * 
 * after loadStuff, there's:
 * server
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
    let accountFile = `./test-accounts/${ito.c.accounts[a]}.json`;
    ito.c.accounts[a] = JSON.parse(fs.readFileSync(accountFile, 'utf8'));

    // create a keypair (from file only)
    ito.keypairs[a] = StellarSdk.Keypair.fromSecret(ito.c.accounts[a].secretKey);

    // load it
    ito.accounts[a] = await ito.server.loadAccount(ito.c.accounts[a].publicKey);

  };
}

ito.sign = async function(transaction, signingAccounts) {
  // TODO: better filename 
  // write the xdr to a file
  let xdr = transaction.toEnvelope().toXDR().toString('base64');
  fs.writeFileSync(`./transactions/unsigned.json`, xdr, 'utf-8');
  // sign with each account
  // file:
  for (var i = 0; i < signingAccounts.length; i++) {
    transaction.sign(signingAccounts[i]);
  }

  // write signed xdr to a file
  xdr = transaction.toEnvelope().toXDR().toString('base64');
  fs.writeFileSync(`./transactions/signed.json`, xdr , 'utf-8');

}

ito.transactionFromFile = function(fileName) {
  // read transaction from file  
  let xdr = fs.readFileSync(fileName, 'utf8');
  return new StellarSdk.Transaction(xdr);
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