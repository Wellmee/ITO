
var StellarSdk = require('stellar-sdk');
var fs = require('fs');

var accountName = process.argv[2] ? process.argv[2] : 'account';

// load account
var keys = JSON.parse(fs.readFileSync(`./test-accounts/${accountName}.json`, 'utf8'));

// pry = require('pryjs'); eval(pry.it);

// var pair = new StellarSdk.Keypair(keys);

// create a pair
var pair = StellarSdk.Keypair.fromSecret(keys.secretKey);


// get account balances:
var server = new StellarSdk.Server('https://horizon-testnet.stellar.org');
var publicKey = pair.publicKey();

// the JS SDK uses promises for most actions, such as retrieving an account
server.loadAccount(publicKey).then(
  function(account) {
    console.log('Balances for account: ' + publicKey);
    account.balances.forEach(
      function(balance) {
        console.log('Type:', balance.asset_type, ', Balance:', balance.balance);
      }
    );
  }
);