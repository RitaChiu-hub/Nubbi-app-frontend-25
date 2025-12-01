// TooltipLabel.js
import React, { useState } from "react";
import { Platform, View, Text } from "react-native";

export default function TooltipLabel({ text, tooltip }) {
  // Mobile: just render the text
  if (Platform.OS !== "web") {
    return <Text style={labelStyle}>{text}</Text>;
  }

  // Web: show tooltip on hover
  const [visible, setVisible] = useState(false);

  return (
    <View
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      style={{ position: "relative" }}
    >
      <Text style={labelStyle}>{text}</Text>

      {visible && (
        <View style={tooltipBox}>
          <Text style={tooltipText}>{tooltip}</Text>
        </View>
      )}
    </View>
  );
}

const labelStyle = {
  fontFamily: "Poppins_500Medium",
  fontSize: 14,
  color: "#050505",
};

const tooltipBox = {
  position: "absolute",
  bottom: "100%", // put above the label
  left: "50%",
  transform: [{ translateX: -50 }],
  backgroundColor: "#333",
  paddingHorizontal: 6,
  paddingVertical: 4,
  borderRadius: 4,
  zIndex: 9999,
  whiteSpace: "nowrap",
};

const tooltipText = {
  color: "#fff",
  fontSize: 12,
};
