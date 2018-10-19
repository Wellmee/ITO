Prepare stuff:
node create-test-account.js test-issuing-interim
node create-test-account.js test-issuing-interim-signer
node create-test-account.js test-issuing-final
node create-test-account.js test-issuing-final-signer
node create-test-account.js test-distributing
node create-test-account.js test-distributing-signer

For ledger, view public key in [account viewer](https://www.stellar.org/account-viewer/#!/dashboard), For more accounts use e.g. 44'/148'/5' Then [fund it](https://www.stellar.org/laboratory/#account-creator), put public keys to config/ledger-public-keys

Send money:
node scripts/send-money.js
node scripts/sign-and-submit.js transactions-to-sign/issuing-to-distributing-payment.xdr 

see if it works:
node scripts/account-info.js issuingInterim
node scripts/account-info.js distributing

Ito setup:
1. Multisig:
node scripts/multisig-setup-distributing.js
node scripts/multisig-setup-issuing-interim.js
node scripts/multisig-setup-issuing-final.js
- test: 
jest scripts/multisig-setup.test.js 
2. Set revocable on interim tokens
node scripts/set-issuing-interim-account-flags.js
- sign and submit: 
node scripts/sign-and-submit.js transactions-to-sign/setting-flags.xdr issuingInterimSigner
- test: 
jest scripts/set-issuing-interim-account-flags.test.js
3. Trustline from distributing to issuingInterim
node scripts/add-trustline-interim.js
- sign and submit:
node scripts/sign-and-submit.js transactions-to-sign/adding-trustline.xdr distributingSigner
4. Send tokens to distributing
node scripts/send-interim-tokens.js 
- sign and submit:
node scripts/sign-and-submit.js transactions-to-sign/sending-interim-tokens.xdr issuingInterimSigner
- test:
jest scripts/send-interim-tokens.test.js
5. Sell offer discount
node scripts/sell-offer-interim-discount.js 
- sign - no submitting:
node scripts/sign.js transactions-to-sign/sell-offer-discount.xdr distributingSigner signed-sell-order-discount

6. When the ICO period starts, submit the transaction - discount
- submit:
node scripts/sign-and-submit.js transactions/signed-sell-order-discount.xdr
- test:
jest scripts/sell-offer-interim-discount.test.js 

7. When the discount period is over, in one transaction delete the discount sell offer and create a sell offer for the rest
node 
- sign and submit:


Ops:
delete an offer:
get the id from scripts/account-info.js distributing
node scripts/delete-sell-offer.js 11940
node scripts/sign-and-submit.js transactions-to-sign/delete-sell-offer.xdr distributingSigner




