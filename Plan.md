## Plan
 * Multisig setup + test immediately - tricky
 * look at account details
 * ledger public key to file, so that I don't have to connect ledger everytime
 * multisig lifecycle:
  * create transaction, sign, write to file
  * take from file, sign, submit
 * Implement "Before ITO", with single signature, on testnet
 * try something on public network
 * The rest
 * Implement listing payments, paying from an account

## Done
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