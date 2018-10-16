Prepare stuff:
node create-test-account.js test-issuing-interim
node create-test-account.js test-issuing-interim-signer
node create-test-account.js test-issuing-final
node create-test-account.js test-issuing-final-signer
node create-test-account.js test-distributing
node create-test-account.js test-distributing-signer

Send money:
node scripts/send-money.js
node scripts/sign-and-submit.js transactions-to-sign/issuing-to-distributing-payment.xdr 

see if it works:
node get-account-balance.js test-issuing
node get-account-balance.js test-distributing

Ito setup:
1. node scripts/multisig-setup-distributing.js
2. node scripts/multisig-setup-issuing-interim.js
3. node scripts/multisig-setup-issuing-final.sj
- test: jest scripts/multisig-setup.test.js 
3. node scripts/set-issuing-interim-account-flags.js
- sign: node scripts/sign-and-submit.js transactions-to-sign/setting-flags.xdr issuingInterimSigner
- test: jest scripts/set-issuing-interim-account-flags.test.js
4. 