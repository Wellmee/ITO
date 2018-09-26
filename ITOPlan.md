# ITO

## Accounts
 * Issuing account for interim tokens (IIA)
 * Issuing account for final tokens  (IFA)
 * Distributing account - that will hold funds (DA)

## Before ITO
 * Create DA
 * Create IIA, [Authorization revocable](https://www.stellar.org/developers/guides/concepts/accounts.html#flags)
 * Create IFA, Authorization immutable
 * Add trustline from DA to IIA
 * Pay interim tokens from IIA to DA - set asset params
 * Create and host the [toml file](https://www.stellar.org/developers/guides/concepts/stellar-toml.html) for interim tokens
 * DA creates sell offers, one for discount, one for the rest, valid through the respective ITO periods

## ITO Success

### KYC verification
 * The verifier gets access to form data in JotForm, goes entry by entry in the web interface on their laptop. Pictures downloaded and safely deleted at the end of the day.
 * The output of the verification process is a CSV file (e.g. excel export) in form `public key, verified(0/1), form submission datetime`

### KYC processing Files
None of these contain any personal info, all that was just used during the verification
 * KYC data : `public key, verified(0/1), last KYC submission datetime, Wellmee key(optional, added in integration)`
 * funding data from Stellar: `public key, amount of tokens bought, datetime of transaction`
 * re-KYC transaction data from Stellar: `public key, memo(Wellmee key), datetime of transaction`

### KYC actions
The following steps will be done in batches, e.g. after a day of verifying: 
 * join fresh KYC data to funding data.
 * set new verification date
 * Users that passed KYC before they sent the funds are marked as verified, send them a confirmation email (from last verification date to current verification date)
 * For users with failed KYC, email them that they need to re-do the KYC
 * For users that are re-doing the KYC (stellar address has already been seen), or if they sent funds before KYC and passed, email a new Wellmee key with instructions to make a transaction. 
 * get fresh re-KYC transactions, join them to KYC data on public key, see if the Wellmee keys match. If yes, make them verified and send a confirmation email

### Final Token Distribution
 * Create and host the toml file for final tokens
 * Add trustline from DA to IFA
 * Pay final tokens from IFA to DA
 * freeze IFA
 * After all KYC entries were verified, get KYC data file
 * Get a funding data
 * Get a conversion ratio from interim to final tokens (depending on how many tokens were sold)
 * Using DA, for all verified buyers, see how much interim tokens they bought, calculate the amount of final tokens and send them the final tokens
 * For payments with missing entry in KYC csv, return the funds - pay Lumens from DA back to the public address
 * After the KYC deadline, for all failed KYC return the funds - pay Lumens from DA back to the public address

## ITO Fail
 * List all contributions from stellar
 * pay Lumens from DA back to the public address

## At the end, success or not
 * Using IIA, freeze interim tokens, for all trustlines on the interim token, set authorized to false
 * freeze IIA

## Edge Cases
 * Someone sends funds in multiple transactions (same public address)
 * Someone submits the KYC form multiple times, with different email
 * Someone transfers the interim tokens to a different address - sending the final tokens to the address they bought it from, freezing all interim tokens no matter where they are. 
 * Someone creates a sell offer with price lower than ours
 * Someone buys and fails the KYC - you just lost interim tokens they bought - need a reserve 




