import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  ScrollView,
  Linking,
} from "react-native";
import { Helmet } from "react-helmet";
import { LinearGradient } from "expo-linear-gradient";
import {
  useFonts,
  Poppins_100Thin,
  Poppins_100Thin_Italic,
  Poppins_200ExtraLight,
  Poppins_200ExtraLight_Italic,
  Poppins_300Light,
  Poppins_300Light_Italic,
  Poppins_400Regular,
  Poppins_400Regular_Italic,
  Poppins_500Medium,
  Poppins_500Medium_Italic,
  Poppins_600SemiBold,
  Poppins_600SemiBold_Italic,
  Poppins_700Bold,
  Poppins_700Bold_Italic,
  Poppins_800ExtraBold,
  Poppins_800ExtraBold_Italic,
  Poppins_900Black,
  Poppins_900Black_Italic,
} from "@expo-google-fonts/poppins";
import * as SplashScreenExpo from "expo-splash-screen";
import { AntDesign } from "@expo/vector-icons";

// Local imports
import { globalStyles } from "../../styles/global";
import InformationSection from "./InformationSection";
import Footer from "./Footer";

SplashScreenExpo.preventAutoHideAsync();

const screenshots = [
  {
    src: require("../../assets/screenshots/view-thread3.png"),
    caption: "Crowdsource answers from your whole class.",
  },
  {
    src: require("../../assets/screenshots/notifications2.png"),
    caption: "Instantly get notified of new activity.",
  },
  {
    src: require("../../assets/screenshots/awards2.png"),
    caption: "Earn professional, soft-skill badges.",
  },
  {
    src: require("../../assets/screenshots/groups2.png"),
    caption: "Stay connected in all classes and groups.",
  },
];

const featuredLogos = [
  require("../../assets/logos/universityOfStThomas.png"),
  require("../../assets/logos/merrimackCollege.png"),
  //  require("../../assets/logos/northeasternUniversity.png"),
];

export default function SplashScreen({ navigation }) {
  const deviceWidth = Dimensions.get("window").width;
  console.log(deviceWidth);
  const dots = React.useMemo(() => {
    const arr = [];
    for (let i = 0; i < 40; i++) {
      const size = Math.random() * 32 + 8;
      const left = Math.random() * (deviceWidth - 40) + 20;
      const top = Math.random() * (200 - 40);
      arr.push({ size, left, top });
    }
    return arr;
  }, [deviceWidth]);
  // Load fonts
  const [fontsLoaded] = useFonts({
    Poppins_100Thin,
    Poppins_100Thin_Italic,
    Poppins_200ExtraLight,
    Poppins_200ExtraLight_Italic,
    Poppins_300Light,
    Poppins_300Light_Italic,
    Poppins_400Regular,
    Poppins_400Regular_Italic,
    Poppins_500Medium,
    Poppins_500Medium_Italic,
    Poppins_600SemiBold,
    Poppins_600SemiBold_Italic,
    Poppins_700Bold,
    Poppins_700Bold_Italic,
    Poppins_800ExtraBold,
    Poppins_800ExtraBold_Italic,
    Poppins_900Black,
    Poppins_900Black_Italic,
  });

  // Dynamically size text for small vs. large screens
  const [headingFontSize, setHeadingFontSize] = useState(
    getHeadingFontSize(deviceWidth)
  );
  const [subHeadingFontSize, setSubHeadingFontSize] = useState(
    getSubHeadingFontSize(deviceWidth)
  );

  useEffect(() => {
    const handleResize = () => {
      const width = Dimensions.get("window").width;
      setHeadingFontSize(getHeadingFontSize(width));
      setSubHeadingFontSize(getSubHeadingFontSize(width));
    };

    handleResize();
    const subscription = Dimensions.addEventListener("change", handleResize);
    return () => subscription?.remove && subscription.remove();
  }, []);

  function getHeadingFontSize(width) {
    if (width < 500) return 28;
    if (width > 1000) return 54;
    return 32;
  }

  function getSubHeadingFontSize(width) {
    if (width < 500) return 24;
    if (width > 1000) return 28;
    return 16;
  }

  // Wait until fonts are loaded before rendering
  if (!fontsLoaded) {
    return null;
  }
  SplashScreenExpo.hideAsync();

  const openCalendly = () => {
    Linking.openURL("https://calendly.com/kat-wifvat/nuubi-demo");
  };

  return (
    <ScrollView style={{ backgroundColor: "#fbfbfb" }}>
      <Helmet>
        <title>Nuubi: Supercharged Help Forums for Student Success</title>
        <meta
          name="description"
          content="Nuubi is an LTI plugin and mobile app that transforms LMS help forums into high-engagement peer Q&A hubs."
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, user-scalable=yes, maximum-scale=2.0001"
        />
      </Helmet>

      {/* HEADER */}
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: 14,
          paddingTop: 14,
          flexWrap: "wrap",
          marginTop: deviceWidth < 600 ? 50 : 0,
        }}
      >
        <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
          <Image
            style={{ width: 52, height: 52 }}
            source={require("../../assets/nuubiTransparent.png")}
          />
          <Text
            style={[
              globalStyles.webpageHeader2,
              { fontSize: 32, marginLeft: 20, marginTop: 5 },
            ]}
          >
            NUUBI
          </Text>
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-evenly",
            flexWrap: "wrap",
            marginTop: 10,
          }}
        >
          <TouchableOpacity
            style={{
              paddingVertical: 14,
              paddingHorizontal: 20,
              borderRadius: 8,
              borderWidth: 1.5,
              borderColor: "#2482AA",
              alignSelf: "center",
              marginRight: 6,
            }}
            onPress={openCalendly}
          >
            <Text style={globalStyles.h3HeadingRegular}>Learn More</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              paddingVertical: 13,
              paddingHorizontal: 14,
              marginHorizontal: 4,
            }}
            onPress={() => navigation.navigate("Login")}
          >
            <Text style={globalStyles.h3HeadingRegular}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* THIN TOP LINE GRADIENT */}
      <View style={{ marginTop: deviceWidth < 600 ? 8 : 12 }}>
        <View style={{ width: "100%", height: 3 }}>
          <LinearGradient
            colors={["#7DDFA0", "#87ceeb"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ flex: 1 }}
          />
        </View>
      </View>

      {/* MAIN CONTENT WRAPPER */}
      <View
        style={{
          paddingHorizontal: deviceWidth >= 800 ? 60 : 20,
          paddingTop: 30,
          paddingBottom: 60,
        }}
      >
        {/* HERO SECTION */}
        <LinearGradient
          colors={["#7DDFA0", "#87ceeb"]}
          start={[0, 1]}
          end={[0, 1]}
          style={[styles.mainGradient]}
        >
          <View style={styles.mainContent}>
            <Text
              style={[
                globalStyles.secondaryButtonText,
                { fontSize: headingFontSize, textAlign: "center" },
              ]}
            >
              Keep Up Momentum at{" "}
              <Text style={{ fontWeight: "bold" }}>Every Question.</Text>
            </Text>

            <Text
              style={[
                globalStyles.h2HeadingMedium,
                {
                  fontSize: subHeadingFontSize,
                  marginBottom: 24,
                  textAlign: "center",
                },
              ]}
            >
              Lightning-fast answers, soft-skill microcredentials, and mobile
              participation that skyrocket student success.
            </Text>

            <TouchableOpacity style={styles.demoButton} onPress={openCalendly}>
              <Text style={styles.demoButtonText}>Learn More</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
        {/* 4. WHAT IS NUU BI? */}
        <Text style={globalStyles.h2HeadingMedium}>
          Replace silent help forums with a vibrant, mobile-first Q&A hub that
          keeps students engaged 24/7.
        </Text>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            alignSelf: "center",
            paddingHorizontal: 20,
            width: "100%",
          }}
        >
          {deviceWidth < 1500 && (
            <AntDesign
              name="left"
              size={24}
              color="#666"
              style={{ marginRight: 8 }}
            />
          )}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            // style={styles.screenshotScroll}
            contentContainerStyle={{
              flexGrow: 1,
              alignItems: "center",
              justifyContent: "space-evenly",
              paddingHorizontal: 16, // give a little breathing room on the sides
            }}
          >
            {/* {screenshots.map(({ src, caption }) => (
              <View key={caption} style={styles.screenshotCard}>
                <Image source={src} style={styles.screenshotImage} />
                <Text style={globalStyles.h3HeadingRegular}>{caption}</Text>
              </View>
            ))} */}
            {screenshots.map(({ src, caption }) => (
              <View
                key={caption}
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  marginHorizontal: 12,
                  paddingTop: 12,
                }}
              >
                <Image
                  source={src}
                  style={{
                    width: deviceWidth >= 800 ? 340 : 190,
                    height: deviceWidth >= 800 ? 420 : 280,
                    resizeMode: "contain", // ensures the full image is visible
                  }}
                />
                <Text
                  style={[
                    globalStyles.h3HeadingRegular,
                    { maxWidth: deviceWidth >= 800 ? 300 : 190, padding: 4 },
                  ]}
                >
                  {caption}
                </Text>
              </View>
            ))}
          </ScrollView>
          {deviceWidth < 1500 && (
            <AntDesign
              name="right"
              size={24}
              color="#666"
              style={{ marginLeft: 8 }}
            />
          )}
        </View>
      </View>

      <View
        style={{
          paddingHorizontal: deviceWidth >= 800 ? 60 : 0, // extra padding on web
        }}
      >
        {/* CUUBI FEATURE SECTION */}
        <View
          style={{
            flexDirection: deviceWidth >= 800 ? "row" : "column",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 40,
            marginHorizontal: 10,
            paddingHorizontal: 20,
          }}
        >
          {/* Cuubi image */}
          <Image
            source={require("../../assets/Cuubi3.png")}
            style={{
              width: deviceWidth >= 800 ? 280 : 200,
              height: deviceWidth >= 800 ? 280 : 200,
              resizeMode: "contain",
              marginLeft: deviceWidth >= 800 ? 10 : 0,
              marginRight: deviceWidth >= 800 ? 34 : 0,
              marginBottom: deviceWidth < 800 ? 20 : 0,
            }}
          />

          {/* Text content */}
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontFamily: "Poppins_600SemiBold",
                fontSize: 28,
                color: "#111111",
                marginBottom: 12,
              }}
            >
              Meet Cuubi, Your AI TA
            </Text>
            <Text
              style={{
                fontFamily: "Poppins_400Regular",
                fontSize: 16,
                lineHeight: 24,
                color: "#333333",
              }}
            >
              Cuubi instantly answers student questions using course context
              while classmates and faculty can add their own answers or upvote
              others. Students get help 24/7 and instructors save time.
            </Text>
            <View style={{ padding: 8 }}></View>
            <Text
              style={{
                fontFamily: "Poppins_400Regular",
                fontSize: 16,
                lineHeight: 24,
                color: "#333333",
              }}
            >
              Because no question should go unanswered.
            </Text>
          </View>
        </View>

        {/* NUUBI WEB FEATURE SECTION */}
        <View
          style={{
            flexDirection: deviceWidth >= 800 ? "row-reverse" : "column",
            alignItems: "center",
            justifyContent: "center",
            marginVertical: 20,
            marginHorizontal: 10,
            paddingHorizontal: 20,
          }}
        >
          {/* Web image */}
          <Image
            source={require("../../assets/screenshots/canvas-analytics.png")}
            style={{
              width: deviceWidth >= 800 ? 400 : 280,
              height: deviceWidth >= 800 ? 325 : 250,
              resizeMode: "contain",
              marginLeft: deviceWidth >= 800 ? 36 : 0,
              marginBottom: deviceWidth < 800 ? 20 : 0,
            }}
          />

          {/* Text content */}
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontFamily: "Poppins_600SemiBold",
                fontSize: 28,
                color: "#111111",
                marginBottom: 12,
              }}
            >
              Nuubi’s on the Web, Too
            </Text>
            <Text
              style={{
                fontFamily: "Poppins_400Regular",
                fontSize: 16,
                lineHeight: 24,
                color: "#333333",
              }}
            >
              Same great features, with downloadable analytics at the click of a
              button. Seamless integration with your LMS or use it instantly as
              a stand-alone platform.
            </Text>
            <View style={{ padding: 8 }}></View>
            <Text
              style={{
                fontFamily: "Poppins_400Regular",
                fontSize: 16,
                lineHeight: 24,
                color: "#333333",
              }}
            >
              Course-based support with no extra logins or tabs required.
            </Text>
            <View style={{ padding: 6 }}></View>
          </View>
        </View>

        <View
          style={{
            flexDirection: deviceWidth >= 800 ? "row" : "column",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 20,
            marginHorizontal: 10,
            paddingHorizontal: 20,
            marginTop: 20,
          }}
        >
          {/* Kat image */}
          <Image
            source={require("../../assets/KatHeadshot.jpg")}
            style={{
              width: deviceWidth >= 800 ? 280 : 200,
              height: deviceWidth >= 800 ? 280 : 200,
              borderRadius: deviceWidth >= 800 ? 140 : 100, // half of width/height
              borderWidth: 2, // thickness of the border
              borderColor: "#", // border color (change as needed)
              resizeMode: "cover", // cover fills circle better than contain
              marginLeft: deviceWidth >= 800 ? 10 : 0,
              marginRight: deviceWidth >= 800 ? 36 : 0,
              marginBottom: deviceWidth < 800 ? 20 : 0,
            }}
          />

          {/* Text content */}
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontFamily: "Poppins_600SemiBold",
                fontSize: 28,
                color: "#111111",
                marginBottom: 12,
              }}
            >
              Hi, I'm Dr. Kat
            </Text>
            <Text
              style={{
                fontFamily: "Poppins_400Regular",
                fontSize: 16,
                lineHeight: 24,
                color: "#333333",
              }}
            >
              I created Nuubi to close the gap in engagement and support that
              students face every day. Nuubi delivers instant answers,
              encouragement, and motivation when students need it most.
            </Text>
            <View style={{ padding: 8 }}></View>
            <Text
              style={{
                fontFamily: "Poppins_400Regular",
                fontSize: 16,
                lineHeight: 24,
                color: "#333333",
              }}
            >
              Named after the spirit of every “newbie,” Nuubi saves faculty time
              while giving students the support to thrive.
            </Text>
          </View>
        </View>
      </View>

      {/* 7. RESULTS / METRICS */}
      <View style={styles.resultsSection}>
        <Text
          style={{
            fontFamily: "Poppins_600SemiBold",
            fontSize: 24,
            color: "#050505",
            marginBottom: 30,
          }}
        >
          Impact within one term.
        </Text>
        <View style={styles.resultsGrid}>
          {[
            { value: "4×", label: "more student activity" },
            { value: "32%", label: "higher course retention" },
            { value: "11%", label: "increased pass rates" },
            { value: "20+", label: "instructor hours saved" },
          ].map(({ value, label }) => (
            <View key={value} style={styles.resultCard}>
              <Text style={styles.resultValue}>{value}</Text>
              <Text style={styles.resultLabel}>{label}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* DATA PRIVACY BLURB */}
      <View
        style={{
          alignItems: "center",
          marginVertical: 40,
          marginBottom: 60,
        }}
      >
        <View
          style={{
            width: deviceWidth * 0.8,
            backgroundColor: "#FFFFFF",
            paddingVertical: 24,
            paddingHorizontal: 20,
            borderRadius: 12,
            shadowColor: "#000",
            shadowOpacity: 0.05,
            shadowRadius: 6,
            shadowOffset: { width: 0, height: 2 },
            elevation: 3,
            alignItems: "flex-start", // <— ensure children start at left
          }}
        >
          {/* Icon + Title/Desc Row */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "flex-start",
              marginBottom: 16,
            }}
          >
            <Text style={{ fontSize: 28, marginRight: 12 }}>🔒</Text>

            <View style={{ flex: 1 }}>
              <Text
                style={{
                  color: "#050505",
                  fontSize: 20,
                  fontFamily: "Poppins_600SemiBold",
                  marginBottom: 4,
                }}
              >
                Get top‑of‑the‑line data protection with Nuubi.
              </Text>
              <Text
                style={{
                  color: "#050505",
                  fontFamily: "Poppins_400Regular",
                  fontSize: 16,
                  letterSpacing: 0.5,
                  marginBottom: 4,
                }}
              >
                FERPA‑Compliant. All data encrypted on SOC‑certified managed
                servers.
              </Text>
              {/* Policy Link */}
              <Text
                style={{
                  color: "#050505",
                  fontFamily: "Poppins_400Regular",
                  fontSize: 16,
                  letterSpacing: 0.5,
                }}
              >
                Data is never sold or shared.{" "}
                <Text
                  onPress={() => navigation.navigate("PrivacyScreen")}
                  style={{
                    color: "#2482AA",
                    textDecorationLine: "underline",
                    fontFamily: "Poppins_600SemiBold",
                  }}
                >
                  Read our full data policy here
                </Text>
                .
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View
        style={{
          backgroundColor: "#E8F7FF",
          paddingTop: 24,
          alignItems: "center",
          paddingBottom: 40,
        }}
      >
        <Text
          style={{
            fontFamily: "Poppins_600SemiBold",
            fontSize: 20,
            color: "#111111",
            textAlign: "center",
            marginHorizontal: 20,
            marginBottom: 36,
          }}
        >
          Join students and faculty from 36+ institutions on Nuubi
        </Text>
        <View style={{ width: windowWidth, height: 200, position: "relative" }}>
          {dots.map((d, i) => (
            <View
              key={i}
              style={{
                position: "absolute",
                width: d.size,
                height: d.size,
                borderRadius: d.size / 2,
                backgroundColor: "#2482AA",
                opacity: 0.6,
                left: d.left,
                top: d.top,
              }}
            />
          ))}

          {featuredLogos.map((src, i) => {
            const d = dots[i];
            const circleSize = d.size * 2.5;
            const logoSize = circleSize * 1.2;
            return (
              <View
                key={i}
                style={{
                  position: "absolute",
                  width: circleSize,
                  height: circleSize,
                  borderRadius: circleSize / 2,
                  backgroundColor: "#FFFFFF", // white circle
                  left: d.left - (circleSize - d.size) / 2,
                  top: d.top - (circleSize - d.size) / 2,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Image
                  source={src}
                  style={{
                    width: logoSize,
                    height: logoSize * 0.5, // adjust as needed per logo aspect
                    resizeMode: "contain",
                  }}
                />
              </View>
            );
          })}
        </View>
        <TouchableOpacity style={styles.ctaButton} onPress={openCalendly}>
          <Text style={styles.ctaText}>Contact Us</Text>
        </TouchableOpacity>
      </View>
      <Footer />
    </ScrollView>
  );
}

const windowWidth = Dimensions.get("window").width;

function cardContentLayout() {
  // If the screen is wide (> 600px), use row to place description & bullets side by side.
  // Otherwise, stack them in a column.
  return {
    flexDirection: windowWidth >= 600 ? "row" : "column",
  };
}

const styles = StyleSheet.create({
  mainContainer: {
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 60,
  },
  mainGradient: {
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 40,
    marginTop: 20,
  },
  mainContent: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  demoButton: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginTop: 16,
  },
  // Add to your StyleSheet
  complianceSection: {
    marginVertical: 40,
    paddingHorizontal: 20,
  },
  complianceHeading: {
    fontFamily: "Poppins_700Bold",
    fontSize: 24,
    color: "#111111",
    marginBottom: 16,
    textAlign: "center",
  },
  complianceGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  complianceCard: {
    width: "30%", // three per row on desktop
    marginBottom: 24,
    alignItems: "center",
  },
  complianceIcon: {
    fontSize: 40,
    marginBottom: 8,
  },
  complianceTitle: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 16,
    color: "#111111",
    marginBottom: 4,
  },
  complianceDesc: {
    fontFamily: "Poppins_400Regular",
    fontSize: 14,
    color: "#333333",
    textAlign: "center",
  },
  demoButtonText: {
    color: "#2482AA",
    fontSize: 18,
    fontFamily: "Poppins_600SemiBold",
  },
  screenshotCard: {
    width: 240,
    marginRight: 16,
    alignItems: "center",
  },
  screenshotImage: {
    width: "100%", // fill the 240px card
    height: windowWidth < 1100 ? windowWidth * 0.5 : windowWidth * 0.3,
    minHeight: 400,
    aspectRatio: 375 / 812, // keep the screenshot’s original ratio
    resizeMode: "contain",
    borderRadius: 12,
  },
  featuresSection: {
    marginVertical: 40,
    paddingHorizontal: 20,
  },
  featuresGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  featureCard: {
    flexBasis: windowWidth < 600 ? "90%" : "45%", // 2‑per‑row on desktop, full‑width on mobile
    flexShrink: 0,
    marginBottom: 24,
  },
  featureIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  featureTitle: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 16,
    color: "#111111",
    marginBottom: 4,
  },
  featureDesc: {
    fontFamily: "Poppins_400Regular",
    fontSize: 14,
    color: "#333333",
    lineHeight: 20,
  },
  screenshotScroll: {
    marginTop: 16,
  },
  oneLinerCard: {
    backgroundColor: "#F0FAFD",
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginHorizontal: 20,
    marginBottom: 32,
    alignItems: "center",
  },
  oneLinerText: {
    fontFamily: "Poppins_500Medium",
    fontSize: 16,
    lineHeight: 24,
    color: "#111111",
    textAlign: "center",
  },
  section: {
    marginBottom: 40,
  },
  featuresList: {
    marginTop: 12,
    paddingLeft: 12,
  },
  logosWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
    justifyContent: "center",
    paddingHorizontal: "10%",
  },
  logosContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    justifyContent: "center",
  },
  logo: {
    width: 160,
    height: 160,
    marginHorizontal: 20,
  },
  arrowContainer: {
    width: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  arrowText: {
    fontSize: 24,
    color: "#666",
    opacity: 0.5,
  },

  footer: {
    alignItems: "center",
    marginVertical: 30,
  },
  // Container for the "What is Nuubi?" section
  whatIsNuubiSection: {
    marginBottom: 40,
    paddingHorizontal: 4, // slight horizontal inset
  },

  // Light background “card” for content
  whatIsNuubiCard: {
    backgroundColor: "#f5f9f8", // very pale teal/white
    borderRadius: 12,
    paddingVertical: 32,
    paddingHorizontal: 20,
    marginTop: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2, // for Android shadow
  },

  // Description paragraph styling
  descriptionText: {
    lineHeight: 22,
    marginBottom: 20,
    color: "#333333",
  },

  // Each row: bullet + text
  featureRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
  },

  // Custom bullet circle
  bulletCircle: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#7DDFA0", // match gradient start color
    marginTop: 6,
    marginRight: 12,
  },

  whatIsNuubiSuperSkimmable: {
    backgroundColor: "#F0FAFD", // light aqua background
    padding: 24,
    borderRadius: 12,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 40,
  },

  // One‐sentence pitch (slightly larger, centered on small screens)
  oneLiner: {
    flexBasis: "100%", // span full width
    fontSize: 16,
    color: "#333333",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 24,
    fontFamily: "Poppins_500Medium",
  },

  // Shared container for “Features” and “Results” blocks
  featureBlock: {
    flex: 1, // allow two blocks to sit side by side on wide screens
    minWidth: 280, // ensure reasonable wrap on narrow screens
    marginVertical: 16,
    paddingHorizontal: 12,
  },

  // Sub‐header for each block (“Top Nuubi Features:”, “What You’ll See:”)
  blockTitle: {
    fontSize: 32,
    fontFamily: "Poppins_600SemiBold",
    color: "#111111",
    marginBottom: 16,
  },

  // Row that holds a bullet circle + text
  bulletRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
  },

  // The bullet itself (circle)
  bulletCircle: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#7DDFA0",
    marginTop: 6, // align vertically with first line of text
    marginRight: 10,
  },

  // The bullet label (text next to the circle)
  bulletLabel: {
    flex: 1,
    fontSize: 24,
    color: "#333333",
    lineHeight: 32,
  },

  // Call-to-action button
  ctaButton: {
    backgroundColor: "#2482AA",
    paddingVertical: 20,
    paddingHorizontal: 32,
    borderRadius: 8,
    alignSelf: "center", // center horizontally
    marginTop: 32,
    marginBottom: 40,
  },
  resultsSection: {
    marginTop: 40,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  resultsHeading: {
    fontFamily: "Poppins_700Bold",
    fontSize: 24,
    color: "#111111",
    marginBottom: 16,
  },
  resultsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-evenly",
    width: "100%",
  },
  resultCard: {
    width: "20%", // two per row
    marginBottom: 24,
    alignItems: "center",
  },
  resultValue: {
    fontFamily: "Poppins_800ExtraBold",
    fontSize: 32,
    color: "#2482AA",
  },
  resultLabel: {
    fontFamily: "Poppins_400Regular",
    fontSize: 14,
    color: "#333333",
    textAlign: "center",
  },
  ctaText: {
    fontFamily: "Poppins_600SemiBold",
    color: "#FFFFFF",
    fontSize: 16,
  },
  whatIsNuubiSection: {
    marginBottom: 40,
    paddingHorizontal: 8,
  },

  whatIsNuubiCard: {
    backgroundColor: "#F5FAF9", // Very pale mint/white background
    borderRadius: 12,
    marginTop: 12,
    marginHorizontal: 4,
    // Subtle shadow (iOS)
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    // Elevation for Android
    elevation: 2,
  },
  cardContent: {
    // Padding inside the card
    paddingVertical: 24,
    paddingHorizontal: 20,
    alignItems: "flex-start",
    justifyContent: "space-between",
  },

  /** --------------------------- **/
  /** Left column: description   **/
  /** --------------------------- **/
  descriptionContainer: {
    flex: 1,
    paddingRight: windowWidth >= 600 ? 20 : 0, // Add right padding if two‐column
    marginBottom: windowWidth < 600 ? 16 : 0, // On mobile, give space below description
  },
  descriptionText: {
    fontFamily: "Poppins_400Regular",
    fontSize: 16,
    lineHeight: 24,
    color: "#333333",
  },
  bulletsContainer: {
    flex: 1,
    paddingLeft: windowWidth >= 600 ? 20 : 0, // Add left padding if two‐column
  },
  bulletRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  bulletIcon: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#7DDFA0", // Same green as your gradient
    marginTop: 6,
    marginRight: 12,
  },
  bulletText: {
    flex: 1,
    fontFamily: "Poppins_500Medium",
    fontSize: 16,
    lineHeight: 24,
    color: "#333333",
  },
  // Add to your StyleSheet
  oneLinerCard: {
    backgroundColor: "#F0FAFD", // very pale aqua
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginHorizontal: 8,
    marginTop: 24,
    marginBottom: 32,
    alignItems: "center",
  },

  oneLinerText: {
    fontFamily: "Poppins_500Medium",
    fontSize: 18,
    lineHeight: 26,
    color: "#111111",
    textAlign: "center",
  },
  teaseWrapper: {
    marginHorizontal: 20,
    marginTop: 24,
    alignItems: "center",
  },
  problemText: {
    fontFamily: "Poppins_400Regular",
    fontSize: 16,
    color: "#666666",
    textAlign: "center",
    marginBottom: 8,
  },
  promiseText: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 18,
    color: "#111111",
    textAlign: "center",
  },
  dualWrapper: {
    flexDirection: windowWidth >= 600 ? "row" : "column",
    justifyContent: "space-around",
    marginVertical: 32,
    paddingHorizontal: 10,
  },
  card: {
    flex: 1,
    alignItems: "center",
    marginVertical: 10,
  },
  cardImage: {
    width: windowWidth >= 600 ? 300 : 240,
    height: windowWidth >= 600 ? 180 : 144,
    resizeMode: "contain",
  },
  cardCaption: {
    marginTop: 12,
    fontFamily: "Poppins_400Regular",
    fontSize: 14,
    textAlign: "center",
    color: "#333333",
  },
});
