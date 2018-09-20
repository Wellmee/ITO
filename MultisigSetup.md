Multisig setup
2 options: 
1. 3 accounts 
 - disabled account (master key weight set to 0, all thresholds 2), can't do anything
 - 2 ledger accounts, added to the disabled account as signers, with weight 1

2. 2 accounts
 - 1 ledger account (master key weight 1, all thresholds 2)
 - 1 ledger account added to the first account as signer, with weight 1

Difference: With option 1. there's no way to change the setup later - it is what it is and you can't add signers, merge, done. - actually you can, because it's in the hands of the 2 signers
Option 2. - can do anything as long as there are two signatures

Co nechcem delat, je vytvorit si mrtvej account, dat Vlckovi public key a pak tam teprve hazet ty signery a umrtvovat.

.. kazdopadne aktivovat ten account az v ten den kdy je zacatek ico .. poslat tam ty xlm trebas

btw vyhoda tech offeru je ze muzes udelat transakci ktera se to nabidne k odkoupeni zpatky - a muzes to udelat v predstihu, takze lidi vidi, ze to asi neukradnes .. ale ukradnout to muzes stejne, proste si ty prachy nekam prevedes a pak to nekoupi :)

kazdopadne bych to videl jako - aktivovat si jeden ledger, hodit jako adresu public z tohodlenctoho ledgeru a setupem se zabyvat az pak .. kdybych se nahodou rozhod pro 1. tak to tam proste askorat pak narvu - stejne musi zit na tom ledgeru i kdyz bude mrtvej

postup
 - aktivovat ledger, vzit z nej public key
 - prdnout to na ten listing
 - tohle bude pak distributing account - jestli bude mrtvej (varianta 1), nebo ne uz je celkem fuk

kazdopadne na to musim napsat testy, co budou zkouset s tim delat brikule a pujde to, ci nepujde. 