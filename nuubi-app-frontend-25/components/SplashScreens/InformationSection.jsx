import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { globalStyles } from "../../styles/global";

export default function InformationSection({ navigation }) {
  const [windowWidth, setWindowWidth] = useState(
    Dimensions.get("window").width
  );

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(Dimensions.get("window").width);
    };
    handleResize();

    const subscription = Dimensions.addEventListener("change", handleResize);
    return () => subscription?.remove && subscription.remove();
  }, []);

  // Decide on a container width for each card
  // Wider on bigger screens, narrower on small screens
  const containerWidth = windowWidth < 500 ? "90%" : "60%";

  return (
    <View style={{ alignItems: "center" }}>
      {/* 1) LEARNERS (20% bigger) */}
      <View style={[styles.shadow, styles.sectionContainer]}>
        <View style={[styles.textBlock, { width: containerWidth }]}>
          <Text style={[globalStyles.webpageHeader2, styles.sectionHeader]}>
            Learners
          </Text>
          <Text style={[globalStyles.webpageText, styles.sectionText]}>
            Nuubi helps students stay on track with built-in features that boost
            engagement.
          </Text>
        </View>

        <View style={[styles.imageBlock, { width: containerWidth }]}>
          <Image
            source={require("../../assets/Carousel2.png")}
            style={[styles.imageCommon, styles.firstImageOverride]}
          />
        </View>
      </View>

      {/* 2) EDUCATORS (15% smaller) */}
      <View style={[styles.shadow, styles.sectionContainer]}>
        <View style={[styles.imageBlock, { width: containerWidth }]}>
          <Image
            source={require("../../assets/Carousel4.1.png")}
            style={[styles.imageCommon, styles.secondImageOverride]}
          />
        </View>

        <View style={[styles.textBlock, { width: containerWidth }]}>
          <Text style={[globalStyles.webpageHeader2, styles.sectionHeader]}>
            Educators
          </Text>
          <Text style={[globalStyles.webpageText, styles.sectionText]}>
            Nuubi takes care of community engagement and outreach on your behalf
            to save you time.
          </Text>
        </View>
      </View>

      {/* 3) ANALYTICS (default size) */}
      <View style={[styles.shadow, styles.sectionContainer]}>
        <View style={[styles.textBlock, { width: containerWidth }]}>
          <Text style={[globalStyles.webpageHeader2, styles.sectionHeader]}>
            Analytics
          </Text>
          <Text style={[globalStyles.webpageText, styles.sectionText]}>
            Nuubi uses AI behind the scenes to highlight your progress and show
            areas for improvement.
          </Text>
        </View>

        <View style={[styles.imageBlock, { width: containerWidth }]}>
          <Image
            source={require("../../assets/Carousel1.png")}
            style={styles.imageCommon}
          />
        </View>
      </View>

      {/* 4) NUUBI GROUP SPOTLIGHT (default size) */}
      <View style={[styles.shadow, styles.sectionContainer]}>
        <View style={[styles.imageBlock, { width: containerWidth }]}>
          <Image
            source={require("../../assets/Carousel3.png")}
            style={styles.imageCommon}
          />
        </View>

        <View style={[styles.textBlock, { width: containerWidth }]}>
          <Text style={[globalStyles.webpageHeader2, styles.sectionHeader]}>
            Nuubi Group Spotlight
          </Text>
          <Text style={[globalStyles.webpageText, styles.sectionText]}>
            Sign up for our Data Science Program to 10x your career at your own
            pace.
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("LandingPage")}
            style={styles.learnMoreBtn}
          >
            <Text style={styles.learnMoreText}>Learn More</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  /**
   * Card-like container for each "section"
   */
  sectionContainer: {
    backgroundColor: "#F8F8F8",
    borderRadius: 12,
    padding: 20,
    marginBottom: 40,
    width: "90%",
    justifyContent: "center",
    alignItems: "center",
  },
  shadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  textBlock: {
    alignItems: "center",
    marginBottom: 20,
  },
  sectionHeader: {
    fontSize: 28,
    marginBottom: 16,
    textAlign: "center",
  },
  sectionText: {
    fontSize: 16,
    marginBottom: 16,
    textAlign: "center",
  },
  imageBlock: {
    alignItems: "center",
    marginBottom: 20,
  },
  /**
   * Common image style (the "average" size)
   */
  imageCommon: {
    width: "80%", // up to 80% of container width
    maxWidth: 400, // clamp horizontally
    maxHeight: 220, // clamp vertically
    resizeMode: "contain",
  },
  /**
   * 20% bigger than "common" -> (400 * 1.2) = 480, (220 * 1.2) = 264
   */
  firstImageOverride: {
    maxWidth: 480,
    maxHeight: 264,
    minWidth: 320,
  },
  /**
   * 15% smaller than "common" -> (400 * 0.85) = 340, (220 * 0.85) = 187
   */
  secondImageOverride: {
    maxWidth: 340,
    maxHeight: 187,
  },
  /**
   * Button styling
   */
  learnMoreBtn: {
    backgroundColor: "#2482AA",
    paddingVertical: 16,
    borderRadius: 30,
    alignSelf: "center",
    width: "80%",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 6,
  },
  learnMoreText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
});
