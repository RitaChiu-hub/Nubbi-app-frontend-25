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

// Local imports
import { globalStyles } from "../../styles/global";
import InformationSection from "./InformationSection";
import Footer from "./Footer";

SplashScreenExpo.preventAutoHideAsync();

export default function SplashScreen({ navigation }) {
  const deviceWidth = Dimensions.get("window").width;

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
          padding: 14,
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
            style={{ paddingVertical: 13, paddingHorizontal: 14 }}
            onPress={openCalendly}
          >
            <Text style={globalStyles.h3HeadingRegular}>Schedule Demo</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{ paddingVertical: 13, paddingHorizontal: 14 }}
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
      <View style={styles.mainContainer}>
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
              Supercharged Help Forums for{" "}
              <Text style={{ fontWeight: "bold" }}>Student Success</Text>
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
              Increase pass rates, boost engagement, and earn soft-skill awards.
            </Text>

            <TouchableOpacity style={styles.demoButton} onPress={openCalendly}>
              <Text style={styles.demoButtonText}>Schedule Demo</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
        {/* ================================ */}
        {/* SUPER–SKIMMABLE “WHAT IS NUUBI?” */}
        {/* ================================ */}
        <View style={styles.whatIsNuubiSuperSkimmable}>
          {/* 1. HEADLINE */}
          {/* 2. ONE-SENTENCE PITCH */}
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
            Nuubi transforms every LMS help forum into a high-engagement peer
            Q&A hub—students earn soft-skill badges, instructors get real-time
            analytics, and nobody ever wastes time on duplicate emails again.
          </Text>

          {/* 3. TOPLINE FEATURES */}
          <View style={styles.featureBlock}>
            <Text style={styles.blockTitle}>Top Nuubi Features:</Text>
            <View style={styles.bulletRow}>
              <View style={styles.bulletCircle} />
              <Text style={styles.bulletLabel}>
                Q&A hub for most-asked questions each semester, helping students
                get unstuck quickly
              </Text>
            </View>
            <View style={styles.bulletRow}>
              <View style={styles.bulletCircle} />
              <Text style={styles.bulletLabel}>
                Soft Skill awards that reward participation, including
                Leadership and Communication
              </Text>
            </View>
            <View style={styles.bulletRow}>
              <View style={styles.bulletCircle} />
              <Text style={styles.bulletLabel}>
                Real-time instructor dashboard with downloadable analytics and
                visibility to student participation trends
              </Text>
            </View>
          </View>

          {/* 4. TOPLINE RESULTS */}
          <View style={styles.featureBlock}>
            <Text style={styles.blockTitle}>What You’ll See:</Text>
            <View style={styles.bulletRow}>
              <View style={styles.bulletCircle} />
              <Text style={styles.bulletLabel}>
                4× more student posts & comments (peer help solves 80% of basic
                questions)
              </Text>
            </View>
            <View style={styles.bulletRow}>
              <View style={styles.bulletCircle} />
              <Text style={styles.bulletLabel}>
                10% drop-out reduction per course & $2,500+ in tuition saved for
                every student retained
              </Text>
            </View>
            <View style={styles.bulletRow}>
              <View style={styles.bulletCircle} />
              <Text style={styles.bulletLabel}>
                75% fewer “how-to” help-desk tickets & 5–10 hours of instructor
                time reclaimed per course
              </Text>
            </View>
          </View>
        </View>
        {/* 5. CALL-TO-ACTION */}
        <TouchableOpacity style={styles.ctaButton} onPress={openCalendly}>
          <Text style={styles.ctaText}>Schedule Demo</Text>
        </TouchableOpacity>

        {/* USERS OF NUUBI SECTION */}
        <View style={styles.section}>
          <Text style={globalStyles.h2HeadingMedium}>
            Nuubi is trusted by students and professors at:
          </Text>

          <View style={styles.logosWrapper}>
            {/* Left arrow indicator */}
            <View style={styles.arrowContainer}>
              <Text style={styles.arrowText}>‹</Text>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.logosContainer}
            >
              <Image
                style={styles.logo}
                source={require("../../assets/logos/universityOfStThomas.png")}
                resizeMode="contain"
              />
              <Image
                style={styles.logo}
                source={require("../../assets/logos/merrimackCollege.png")}
                resizeMode="contain"
              />
              <Image
                style={styles.logo}
                source={require("../../assets/logos/universityOfTheCumberlands.png")}
                resizeMode="contain"
              />

              <Image
                style={styles.logo}
                source={require("../../assets/logos/northeasternUniversity.png")}
                resizeMode="contain"
              />
              {/* Add more logos as needed */}
            </ScrollView>

            {/* Right arrow indicator */}
            <View style={styles.arrowContainer}>
              <Text style={styles.arrowText}>›</Text>
            </View>
          </View>
        </View>
      </View>
      {/* ADDITIONAL INFO SECTION & ANOTHER DEMO BUTTON */}
      {/* <InformationSection navigation={navigation} /> */}

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
  demoButtonText: {
    color: "#2482AA",
    fontSize: 18,
    fontFamily: "Poppins_600SemiBold",
  },

  section: {
    marginBottom: 40,
  },
  featuresList: {
    marginTop: 12,
    paddingLeft: 12,
  },

  // USERS OF NUUBI SECTION
  logosWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
    // Ensure the arrows and ScrollView fit comfortably
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

  // Grid container for feature rows
  featuresGrid: {
    flexDirection: "column",
    justifyContent: "space-between",
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
});

// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   Image,
//   TouchableOpacity,
//   Dimensions,
//   StyleSheet,
//   ScrollView,
// } from "react-native";
// import { Helmet } from "react-helmet";
// import { LinearGradient } from "expo-linear-gradient";
// import {
//   useFonts,
//   Poppins_100Thin,
//   Poppins_100Thin_Italic,
//   Poppins_200ExtraLight,
//   Poppins_200ExtraLight_Italic,
//   Poppins_300Light,
//   Poppins_300Light_Italic,
//   Poppins_400Regular,
//   Poppins_400Regular_Italic,
//   Poppins_500Medium,
//   Poppins_500Medium_Italic,
//   Poppins_600SemiBold,
//   Poppins_600SemiBold_Italic,
//   Poppins_700Bold,
//   Poppins_700Bold_Italic,
//   Poppins_800ExtraBold,
//   Poppins_800ExtraBold_Italic,
//   Poppins_900Black,
//   Poppins_900Black_Italic,
// } from "@expo-google-fonts/poppins";
// import * as SplashScreenExpo from "expo-splash-screen";

// // Local imports
// import { globalStyles } from "../../styles/global";
// import InformationSection from "./InformationSection";
// import Footer from "./Footer";

// SplashScreenExpo.preventAutoHideAsync();

// export default function SplashScreen({ navigation }) {
//   const deviceWidth = Dimensions.get("window").width;

//   // Load fonts
//   const [fontsLoaded] = useFonts({
//     Poppins_100Thin,
//     Poppins_100Thin_Italic,
//     Poppins_200ExtraLight,
//     Poppins_200ExtraLight_Italic,
//     Poppins_300Light,
//     Poppins_300Light_Italic,
//     Poppins_400Regular,
//     Poppins_400Regular_Italic,
//     Poppins_500Medium,
//     Poppins_500Medium_Italic,
//     Poppins_600SemiBold,
//     Poppins_600SemiBold_Italic,
//     Poppins_700Bold,
//     Poppins_700Bold_Italic,
//     Poppins_800ExtraBold,
//     Poppins_800ExtraBold_Italic,
//     Poppins_900Black,
//     Poppins_900Black_Italic,
//   });

//   // Dynamically size text for small vs. large screens
//   const [headingFontSize, setHeadingFontSize] = useState(
//     getHeadingFontSize(deviceWidth)
//   );
//   const [subHeadingFontSize, setSubHeadingFontSize] = useState(
//     getSubHeadingFontSize(deviceWidth)
//   );

//   useEffect(() => {
//     const handleResize = () => {
//       const width = Dimensions.get("window").width;
//       setHeadingFontSize(getHeadingFontSize(width));
//       setSubHeadingFontSize(getSubHeadingFontSize(width));
//     };

//     handleResize();
//     const subscription = Dimensions.addEventListener("change", handleResize);
//     return () => subscription?.remove && subscription.remove();
//   }, []);

//   function getHeadingFontSize(width) {
//     // Larger text on smaller screens so it's easier to read
//     if (width < 500) return 28; // was 24 or 32
//     if (width > 1000) return 54;
//     return 32;
//   }

//   function getSubHeadingFontSize(width) {
//     // Also scale subheading bigger on smaller screens
//     if (width < 500) return 18; // was 16 or 10
//     if (width > 1000) return 28;
//     return 16;
//   }

//   // Wait until fonts are loaded before rendering
//   if (!fontsLoaded) {
//     return null;
//   }
//   SplashScreenExpo.hideAsync();

//   return (
//     <ScrollView style={{ backgroundColor: "#fbfbfb" }}>
//       <Helmet>
//         <title>Nuubi: Study groups that keep you motivated.</title>
//         <meta
//           name="Nuubi"
//           content="EdTech chat app for students and teachers that fosters learning."
//         />
//         <meta
//           name="viewport"
//           content="width=device-width, initial-scale=1, user-scalable=yes, maximum-scale=2.0001"
//         />
//       </Helmet>

//       {/* HEADER */}
//       <View
//         style={{
//           flex: 1,
//           flexDirection: "row",
//           justifyContent: "space-between",
//           alignItems: "center",
//           padding: 14,
//           flexWrap: "wrap",
//           marginTop: deviceWidth < 600 ? 50 : 0,
//         }}
//       >
//         <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
//           <Image
//             style={{ width: 52, height: 52 }}
//             source={require("../../assets/nuubiTransparent.png")}
//           />
//           <Text
//             style={[
//               globalStyles.webpageHeader2,
//               { fontSize: 32, marginLeft: 20, marginTop: 5 },
//             ]}
//           >
//             NUUBI
//           </Text>
//         </View>

//         <View
//           style={{
//             flexDirection: "row",
//             alignItems: "center",
//             justifyContent: "space-evenly",
//             flexWrap: "wrap",
//             marginTop: 10,
//           }}
//         >
//           <TouchableOpacity
//             style={{ paddingVertical: 13, paddingHorizontal: 14 }}
//             onPress={() => navigation.navigate("SignUp")}
//           >
//             <Text style={globalStyles.h3HeadingRegular}>Sign Up</Text>
//           </TouchableOpacity>

//           <TouchableOpacity
//             style={{ paddingVertical: 13, paddingHorizontal: 14 }}
//             onPress={() => navigation.navigate("Login")}
//           >
//             <Text style={globalStyles.h3HeadingRegular}>Login</Text>
//           </TouchableOpacity>
//         </View>
//       </View>

//       {/* THIN TOP LINE GRADIENT */}
//       <View style={{ marginTop: deviceWidth < 600 ? 8 : 12 }}>
//         <View style={{ width: "100%", height: 3 }}>
//           <LinearGradient
//             colors={["#7DDFA0", "#87ceeb"]}
//             start={{ x: 0, y: 0 }}
//             end={{ x: 1, y: 0 }}
//             style={{ flex: 1 }}
//           />
//         </View>
//       </View>

//       {/* MAIN CONTENT WRAPPER */}
//       <View style={styles.mainContainer}>
//         {/* LARGE GRADIENT SECTION with rounded corners and minHeight for small screens */}
//         <LinearGradient
//           colors={["#7DDFA0", "#87ceeb"]}
//           start={[0, 1]}
//           end={[0, 1]}
//           style={[
//             styles.mainGradient,
//             // {
//             //   // Guarantee enough space on small screens so gradient is visible
//             //   minHeight: deviceWidth < 500 ? 420 : 400,
//             // },
//           ]}
//         >
//           <View style={styles.mainContent}>
//             <Text
//               style={[
//                 globalStyles.secondaryButtonText,
//                 { fontSize: headingFontSize, textAlign: "center" },
//               ]}
//             >
//               Study groups built for{" "}
//               <Text style={{ fontWeight: "bold" }}>your success</Text>
//             </Text>

//             <Text
//               style={[
//                 globalStyles.h2HeadingMedium,
//                 {
//                   fontSize: subHeadingFontSize,
//                   marginBottom: 24,
//                   textAlign: "center",
//                 },
//               ]}
//             >
//               With features that keep you motivated.
//             </Text>

//             <Text
//               style={[globalStyles.h3HeadingRegular, { textAlign: "center" }]}
//             >
//               Let's accomplish our goals together!
//             </Text>
//           </View>
//         </LinearGradient>

//         <InformationSection navigation={navigation} />
//         <Footer />
//       </View>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   mainContainer: {
//     paddingHorizontal: 20,
//     paddingTop: 30,
//     paddingBottom: 60,
//   },
//   mainGradient: {
//     borderRadius: 16, // Rounded corners
//     justifyContent: "center",
//     alignItems: "center",
//     marginBottom: 40,
//     marginTop: 20,
//   },
//   mainContent: {
//     width: "100%",
//     justifyContent: "center",
//     alignItems: "center",
//     paddingHorizontal: 20,
//     paddingVertical: 30,
//   },
// });
