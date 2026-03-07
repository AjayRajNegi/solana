import { transact } from "@solana-mobile/mobile-wallet-adapter-protocol-web3js";
import { PublicKey } from "@solana/web3.js";
import React, { useState } from "react";
import { Button, ScrollView, StyleSheet, Text, View } from "react-native";
import { toByteArray } from "react-native-quick-base64";

const APP_IDENTITY = {
  name: "dev1",
  uri: "dev1://",
  icon: "favicon.ico",
};

export default function TestScreen() {
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

// export default function TestScreen() {
//   return (
//     <>
//       <View style={{ marginTop: 50 }}>
//         <Text style={{ color: "white" }}>Test</Text>
//       </View>
//     </>
//   );
// }
