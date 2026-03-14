export async function transferSol(
   recipientAddress: string,
   amountInSol: number
 ): Promise<string | null> {
+  const cachedToken = await AsyncStorage.getItem('mwa_auth_token');
+  if (!cachedToken) {
+    Alert.alert('Wallet not connected', 'Please connect your wallet before sending SOL.');
+    return null;
+  }
+
   try {
     return await transact(async (wallet: Web3MobileWallet) => {
       // Step 1: Authorize
-      const authResult = await wallet.authorize({
+      const authResult = await wallet.reauthorize({
         identity: APP_IDENTITY,
-        chain: CLUSTER,
+        auth_token: cachedToken,
       });
       
       const fromPubkey = new PublicKey(toByteArray(authResult.accounts[0].address));
       const toPubkey = new PublicKey(recipientAddress);
       const lamports = Math.round(amountInSol * LAMPORTS_PER_SOL);
       if (lamports <= 0) {
         throw new Error('Amount must be greater than 0 SOL');
       }
       
       // Step 2: Get fresh blockhash
       const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
       
       // Step 3: Build transaction
       const instructions = [
         SystemProgram.transfer({
           fromPubkey,
           toPubkey,
           lamports,
         }),
       ];
       
       const messageV0 = new TransactionMessage({
         payerKey: fromPubkey,
         recentBlockhash: blockhash,
         instructions,
       }).compileToV0Message();
       
       const transaction = new VersionedTransaction(messageV0);
       
       // Step 4: Sign and send
-      const [signature] = await wallet.signAndSendTransactions({
+      const [signedTransaction] = await wallet.signTransactions({
         transactions: [transaction],
       });
+
+      const signature = await connection.sendRawTransaction(signedTransaction.serialize());
       
       // Step 5: Confirm
       const confirmation = await connection.confirmTransaction(
         { signature, blockhash, lastValidBlockHeight },
         'confirmed'
       );
       
       if (confirmation.value.err) {
         throw new Error('Transaction failed on-chain');
       }
       
       return signature;
     });
   } catch (error: any) {
     if (error.code === 4001) {
       Alert.alert('Cancelled', 'Transaction was cancelled.');
     } else if (error.code === -32603) {
       Alert.alert('Failed', 'Transaction simulation failed. Check your balance.');
     } else {
       Alert.alert('Error', error.message);
     }
     return null;
   }
 }