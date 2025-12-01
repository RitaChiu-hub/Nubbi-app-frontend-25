import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";

export const DEBUG_ON = true; // flip to false when done
export const debugBuffer = []; // holds recent messages

export default function DebugOverlay() {
  if (!DEBUG_ON) return null;

  return (
    <View style={styles.container} pointerEvents="none">
      <ScrollView>
        {debugBuffer.map((l, i) => (
          <Text key={i} style={styles.line}>
            {l}
          </Text>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 40,
    left: 0,
    right: 0,
    maxHeight: "40%",
    backgroundColor: "rgba(0,0,0,0.7)",
    padding: 6,
    zIndex: 9999,
  },
  line: { color: "red", fontWeight: "bold", fontSize: 12, marginBottom: 2 },
});
