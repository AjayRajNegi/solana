import {
  Connection,
  PublicKey,
  VersionedTransaction,
  TransactionMessage,
  SystemProgram,
} from "@solana/web3.js";

const connection = new Connection("https://api.devnet.solana.com", "confirmed");

async function testSendTransaction(log: (msg: string) => void) {
  log("Building transaction...");

  await transact(async (wallet) => {
    const result = await wallet.authorize({
      identity: APP_IDENTITY,
      chain: "solana:devnet",
    });

    const publicKey = new PublicKey(toByteArray(result.accounts[0].address));

    log(`Using account: ${publicKey.toBase58()}`);

    // Check balance
    const balance = await connection.getBalance(publicKey);
    log(`Balance: ${balance / 1e9} SOL`);

    if (balance < 0.001 * 1e9) {
      log("ERROR: Insufficient balance for test");
      return;
    }

    // Build transaction (send 0.001 SOL to self)
    const { blockhash } = await connection.getLatestBlockhash();

    const transaction = new VersionedTransaction(
      new TransactionMessage({
        payerKey: publicKey,
        recentBlockhash: blockhash,
        instructions: [
          SystemProgram.transfer({
            fromPubkey: publicKey,
            toPubkey: publicKey, // Send to self
            lamports: 0.001 * 1e9,
          }),
        ],
      }).compileToV0Message(),
    );

    log("Signing transaction...");

    const [signature] = await wallet.signAndSendTransactions({
      transactions: [transaction],
    });

    log(`Signature: ${signature}`);

    // Confirm
    log("Waiting for confirmation...");
    const confirmation = await connection.confirmTransaction(
      signature,
      "confirmed",
    );

    if (confirmation.value.err) {
      log(`ERROR: ${JSON.stringify(confirmation.value.err)}`);
    } else {
      log("Transaction confirmed!");
    }
  });
}
