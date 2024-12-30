import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import ShopifyBuyButton from "./ShopifyBuyButton"; // Make sure the path is correct

const LandingPage = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Welcome to Our Exclusive Course!</Text>
        <Text style={styles.subtitle}>
          Get the skills you need to succeed in Data Science
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Why Choose Our Program?</Text>
        <Text style={styles.sectionText}>
          Our 10-week Data Science program is designed to give you the skills to
          succeed in the rapidly growing field of data science. Learn R & Python
          from experienced professionals with real-world applications.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>What You’ll Get:</Text>
        <Text style={styles.sectionText}>
          - Hands-on experience with R & Python for data analysis and
          visualization.{"\n"}- Expert guidance from an experienced instructor.
          {"\n"}- Access to exclusive content and a supportive community.{"\n"}-
          A certificate of completion and a LinkedIn recommendation upon
          successful completion.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Limited Time Offer!</Text>
        <Text style={styles.sectionText}>
          Enroll now and get exclusive access to additional one-on-one tutoring
          sessions with the instructor. Hurry, spots are limited!
        </Text>
      </View>

      <View style={styles.buyButtonContainer}>
        <ShopifyBuyButton />
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Have questions? Contact us at support@example.com
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
  },
  header: {
    marginBottom: 20,
    textAlign: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#333",
  },
  subtitle: {
    fontSize: 18,
    color: "#666",
    marginTop: 10,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  sectionText: {
    fontSize: 16,
    color: "#666",
    lineHeight: 24,
  },
  buyButtonContainer: {
    marginTop: 30,
    alignItems: "center",
  },
  footer: {
    marginTop: 30,
    textAlign: "center",
  },
  footerText: {
    fontSize: 14,
    color: "#999",
  },
});

export default LandingPage;
