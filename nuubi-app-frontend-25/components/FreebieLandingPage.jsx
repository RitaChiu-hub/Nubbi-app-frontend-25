import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
} from "react-native";

const FreebieLandingPage = ({ navigation }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const handleSubmit = async () => {
    if (!name || !email) {
      alert("Please enter your name and email.");
      return;
    }

    if (!marketingConsent) {
      alert("Please agree to receive emails before downloading the freebie.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:8080/auth/freebiesignup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, marketingConsent: true }),
      });

      const data = await response.json();

      if (response.ok) {
        setModalVisible(true);
        setName("");
        setEmail("");
        setMarketingConsent(false);
      } else {
        alert(data.error || "Something went wrong. Try again.");
      }
    } catch (error) {
      alert("Error submitting form. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* ✅ Header Section */}
      <View style={styles.header}>
        <Text style={styles.title}>
          Get Your Free Study Guide & AI-Powered Study Plan!
        </Text>
        <Text style={styles.subtitle}>
          Sign up below and we'll send your free guide directly to your inbox.
        </Text>
      </View>

      {/* ✅ Email Capture Form */}
      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Your Name"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Your Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />

        {/* ✅ Properly Aligned Checkbox */}
        <TouchableOpacity
          style={styles.checkboxWrapper}
          onPress={() => setMarketingConsent(!marketingConsent)}
        >
          <View
            style={[
              styles.checkbox,
              marketingConsent && styles.checkboxChecked,
            ]}
          />
          <Text style={styles.checkboxText}>
            I agree to receive marketing emails from Nuubi.{" "}
            <Text
              style={styles.privacyLink}
              onPress={() => navigation.navigate("PrivacyScreen")}
            >
              View Privacy Policy.
            </Text>
          </Text>
        </TouchableOpacity>

        {/* ✅ Centered & Styled Submit Button */}
        <TouchableOpacity
          style={[
            styles.submitButton,
            !marketingConsent && styles.disabledButton,
          ]}
          onPress={handleSubmit}
          disabled={loading || !marketingConsent}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.submitButtonText}>Get My Free Guide</Text>
          )}
        </TouchableOpacity>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>You're In! 🎉</Text>
            <Text style={styles.modalText}>
              Check your email for your freebie! If you don’t see it, check your
              spam folder.
            </Text>
            <Text style={styles.modalText}>
              Want to take the next step? Get the **full guide for just $9.99**
              or join our bootcamp waitlist!
            </Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>Got It!</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {/* ✅ Testimonials & FAQ */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>⭐ Real Student Testimonials</Text>
        <Text style={styles.sectionText}>
          “Dr. Wifvat’s course helped me land my first data analyst job. The
          structured study plan made all the difference!” — Jessica M.
        </Text>
        <Text style={styles.sectionText}>
          “This was the best investment in my career. The AI-powered study plan
          was a game changer.” — David R.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>❓ Frequently Asked Questions</Text>
        <Text style={styles.sectionText}>
          <Text style={styles.boldText}>Is this really free?</Text> Yes! We
          believe in making learning accessible.
        </Text>
        <Text style={styles.sectionText}>
          <Text style={styles.boldText}>Who is this for?</Text> Anyone
          interested in data science and upskilling with AI.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
  },
  header: { marginBottom: 20, alignItems: "center", width: "100%" },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginTop: 10,
    textAlign: "center",
    paddingHorizontal: 10,
  },
  formContainer: { width: "90%", alignItems: "center", marginVertical: 20 },
  input: {
    width: "100%",
    borderBottomWidth: 1,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
    textAlign: "center",
  },

  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)", // Dark overlay effect
  },
  modalContent: {
    width: "80%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5, // Adds a shadow for Android
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  modalText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 15,
  },
  modalButton: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 5,
  },
  modalButtonText: {
    color: "white",
    fontWeight: "bold",
  },

  /* ✅ Fix Checkbox Alignment */
  checkboxWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "90%",
    marginVertical: 10,
    paddingHorizontal: 5,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: "#2482AA",
    borderRadius: 4,
    marginRight: 10,
  },
  checkboxChecked: {
    backgroundColor: "#2482AA",
  },
  checkboxText: {
    fontSize: 14,
    color: "#333",
    flexShrink: 1, // Ensures text wraps properly
  },
  privacyLink: { color: "#007BFF", textDecorationLine: "underline" },

  /* ✅ Fix Button Alignment */
  submitButton: {
    backgroundColor: "#007BFF",
    padding: 15,
    width: "90%",
    alignItems: "center",
    borderRadius: 5,
    marginTop: 15,
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  submitButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  section: { marginVertical: 20, paddingHorizontal: 20 },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
    textAlign: "center",
  },
  sectionText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 10,
  },
  boldText: { fontWeight: "bold" },
});

export default FreebieLandingPage;
