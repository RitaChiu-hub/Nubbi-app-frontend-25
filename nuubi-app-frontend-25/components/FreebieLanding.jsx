import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

export default function FreebieLandingPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async () => {
    if (!name || !email) {
      alert("Please enter your name and email.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("https://your-backend.com/api/freebie-signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage("Check your email for your freebie!");
        setName("");
        setEmail("");
      } else {
        alert(data.error || "Something went wrong. Try again.");
      }
    } catch (error) {
      alert("Error submitting form. Please try again.");
    }

    setLoading(false);
  };

  return (
    <View style={{ padding: 20, alignItems: "center", marginTop: 50 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 10 }}>
        Get Your Free Study Guide & AI-Powered Study Plan!
      </Text>

      <TextInput
        style={{ borderBottomWidth: 1, width: "80%", marginBottom: 20, padding: 10 }}
        placeholder="Your Name"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={{ borderBottomWidth: 1, width: "80%", marginBottom: 20, padding: 10 }}
        placeholder="Your Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      <TouchableOpacity
        style={{
          backgroundColor: "#007BFF",
          padding: 15,
          width: "80%",
          alignItems: "center",
          borderRadius: 5,
        }}
        onPress={handleSubmit}
        disabled={loading}
      >
        {loading ? <ActivityIndicator color="white" /> : <Text style={{ color: "white", fontWeight: "bold" }}>Get My Free Guide</Text>}
      </TouchableOpacity>

      {successMessage ? (
        <Text style={{ color: "green", marginTop: 20 }}>{successMessage}</Text>
      ) : null}
    </View>
  );
}
