## Plan
 * toml file and hosting
 * time bounds + just sign with no submit
 * testovaci buyer that buys a few tokens
 * Implement listing payments, paying from an account - more like trades for an offer: https://www.stellar.org/developers/horizon/reference/endpoints/trades-for-offer.html
 * try 100 operations

## Done
 * sell offer
 * support second device
 * try something on public network
 * hanging
 * ledger public key to file, so that I don't have to connect ledger everytime
 * The rest
 * Implement "Before ITO", with single signature, on testnet
 * create token + trustline 
 * multisig lifecycle:
  * create transaction, sign, write to file
  * take from file, sign, submit
 * Multisig setup + test immediately - tricky
 * look at account details
  * template function, nejaky buildTransaction(account) vrati transakci
  * budes volat wholeThing(fce, signers)
 * framework
 * Try it out, buy stuff with test account
 * signing with Ledger 
  * https://www.npmjs.com/package/stellar-ledger-wallet .. tohle vitezi https://github.com/MisterTicot/js-stellar-ledger-wallet
    * musi se to delat pres onConnect, pres promise to nejde
  * https://github.com/LedgerHQ/ledgerjs
  * http://ledgerhq.github.io/ledgerjs/docs/#str
  * https://github.com/LedgerHQ/ledgerjs/tree/master/packages/hw-app-str
  * https://www.npmjs.com/package/stellar-ledger-api .. no github
  * https://www.npmjs.com/package/@ledgerhq/hw-app-str .. official package
  * https://stellar.stackexchange.com/questions/912/how-to-add-a-signature-using-ledger-nano
 * odprasit, davat mezikroky do filu
