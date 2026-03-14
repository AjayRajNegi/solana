import React, { useState } from "react";
import { View, Text, Button, StyleSheet, ScrollView } from "react-native";
import { transact } from "@solana-mobile/mobile-wallet-adapter-protocol-web3js";
import {
  Connection,
  PublicKey,
  VersionedTransaction,
  TransactionMessage,
  SystemProgram,
} from "@solana/web3.js";
import { toByteArray } from "react-native-quick-base64";

const APP_IDENTITY = {
  name: "MWA Test",
  uri: "https://test.app",
  icon: "favicon.ico",
};

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

export default function Tab() {
  const [logs, setLogs] = useState<string[]>([]);

  const log = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs((prev) => [...prev, `[${timestamp}] ${message}`]);
  };

  const testConnect = async () => {
    log("Starting transact...");

    try {
      await transact(async (wallet) => {
        log("Session established");

        const result = await wallet.authorize({
          identity: APP_IDENTITY,
          chain: "solana:devnet",
        });

        const address = new PublicKey(toByteArray(result.accounts[0].address));

        log(`Authorized: ${address.toBase58()}`);
        log(`Auth token: ${result.auth_token.slice(0, 20)}...`);
        log(`Accounts: ${result.accounts.length}`);
      });

      log("Session closed successfully");
    } catch (error) {
      log(`ERROR: ${error}`);
    }
  };

  const clearLogs = () => setLogs([]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>MWA Connection Test</Text>

      <View style={styles.buttons}>
        <Button
          title="Test Transaction"
          onPress={() => testSendTransaction(log)}
        />
        <Button title="Test Connect" onPress={testConnect} />
        <Button title="Clear Logs" onPress={clearLogs} />
      </View>

      <ScrollView style={styles.logContainer}>
        {logs.map((log, index) => (
          <Text key={index} style={styles.log}>
            {log}
          </Text>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 16 },
  buttons: { flexDirection: "row", gap: 8, marginBottom: 16 },
  logContainer: {
    flex: 1,
    backgroundColor: "#1a1a1a",
    padding: 8,
    borderRadius: 8,
  },
  log: {
    color: "#0f0",
    fontFamily: "monospace",
    fontSize: 12,
    marginBottom: 4,
  },
});
