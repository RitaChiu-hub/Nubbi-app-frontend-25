import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  ScrollView,
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
    // Larger text on smaller screens so it's easier to read
    if (width < 500) return 28; // was 24 or 32
    if (width > 1000) return 54;
    return 32;
  }

  function getSubHeadingFontSize(width) {
    // Also scale subheading bigger on smaller screens
    if (width < 500) return 18; // was 16 or 10
    if (width > 1000) return 28;
    return 16;
  }

  // Wait until fonts are loaded before rendering
  if (!fontsLoaded) {
    return null;
  }
  SplashScreenExpo.hideAsync();

  return (
    <ScrollView style={{ backgroundColor: "#fbfbfb" }}>
      <Helmet>
        <title>Nuubi: Study groups that keep you motivated.</title>
        <meta
          name="Nuubi"
          content="EdTech chat app for students and teachers that fosters learning."
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
            onPress={() => navigation.navigate("SignUp")}
          >
            <Text style={globalStyles.h3HeadingRegular}>Sign Up</Text>
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
        {/* LARGE GRADIENT SECTION with rounded corners and minHeight for small screens */}
        <LinearGradient
          colors={["#7DDFA0", "#87ceeb"]}
          start={[0, 1]}
          end={[0, 1]}
          style={[
            styles.mainGradient,
            // {
            //   // Guarantee enough space on small screens so gradient is visible
            //   minHeight: deviceWidth < 500 ? 420 : 400,
            // },
          ]}
        >
          <View style={styles.mainContent}>
            <Text
              style={[
                globalStyles.secondaryButtonText,
                { fontSize: headingFontSize, textAlign: "center" },
              ]}
            >
              Study groups built for{" "}
              <Text style={{ fontWeight: "bold" }}>your success</Text>
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
              With features that keep you motivated.
            </Text>

            <Text
              style={[globalStyles.h3HeadingRegular, { textAlign: "center" }]}
            >
              Let's accomplish our goals together!
            </Text>
          </View>
        </LinearGradient>

        <InformationSection navigation={navigation} />
        <Footer />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 60,
  },
  mainGradient: {
    borderRadius: 16, // Rounded corners
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
});

// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   Image,
//   TouchableOpacity,
//   Dimensions,
//   Platform,
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
// import RenderHTML, { defaultSystemFonts } from "react-native-render-html";

// // Local imports
// import { globalStyles } from "../../styles/global";
// import InformationSection from "./InformationSection";
// import Footer from "./Footer";

// // Prevent the splash screen from auto-hiding
// SplashScreenExpo.preventAutoHideAsync();

// export default function SplashScreen({ navigation }) {
//   const deviceWidth = Dimensions.get("window").width;
//   const height = Dimensions.get("window").height;

//   let [fontsLoaded] = useFonts({
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

//   // Dynamically calculate font sizes, layout values, etc.
//   const [nuubiFontSize, setNuubiSize] = useState(getNuubiFontSize());
//   const [webpageHeaderSize, setWebpageHeaderSize] = useState(
//     getWebpageHeaderSize()
//   );
//   const [webpageHeader2Size, setWebpageHeader2Size] = useState(
//     getWebpageHeader2Size()
//   );
//   const [webpageTextSize, setwebpageTextSize] = useState(getWebpageTextSize());
//   const [linerGradientMulitplier, setlinerGradientMulitplier] = useState(
//     getlinerGradientMulitplier()
//   );

//   useEffect(() => {
//     const handleInitialScreenSize = () => {
//       const { width } = Dimensions.get("window");

//       setNuubiSize(getNuubiFontSize(width));
//       setWebpageHeaderSize(getWebpageHeaderSize(width));
//       setWebpageHeader2Size(getWebpageHeader2Size(width));
//       setwebpageTextSize(getWebpageTextSize(width));
//       setlinerGradientMulitplier(getlinerGradientMulitplier(width));
//     };

//     handleInitialScreenSize();

//     const handleChangeListener = Dimensions.addEventListener(
//       "change",
//       handleInitialScreenSize
//     );

//     return () => {
//       handleChangeListener.remove();
//     };
//   }, []);

//   // Example size helpers
//   function getNuubiFontSize(windowWidth) {
//     if (!windowWidth) windowWidth = Dimensions.get("window").width;
//     if (windowWidth < 500) return 24;
//     return windowWidth > 1000 ? 54 : 32;
//   }
//   function getWebpageHeaderSize(windowWidth) {
//     if (!windowWidth) windowWidth = Dimensions.get("window").width;
//     if (windowWidth < 500) return 22;
//     return windowWidth > 1000 ? 60 : 35;
//   }
//   function getWebpageHeader2Size(windowWidth) {
//     if (!windowWidth) windowWidth = Dimensions.get("window").width;
//     if (windowWidth < 500) return 18;
//     return windowWidth > 700 ? 42 : 28;
//   }
//   function getWebpageTextSize(windowWidth) {
//     if (!windowWidth) windowWidth = Dimensions.get("window").width;
//     if (windowWidth < 500) return 10;
//     return windowWidth > 1000 ? 28 : 16;
//   }
//   function getlinerGradientMulitplier(windowWidth) {
//     if (!windowWidth) windowWidth = Dimensions.get("window").width;
//     if (windowWidth < 500) {
//       return 0.9;
//     }
//     if (windowWidth < 1200) {
//       return 0.83;
//     }
//     return windowWidth > 1460 ? 1 : 1.16;
//   }

//   // Wait until fonts are loaded (or else the app can crash)
//   if (!fontsLoaded) {
//     return null;
//   }

//   // Hide the native splash screen once everything is ready
//   SplashScreenExpo.hideAsync();

//   return (
//     <ScrollView style={{ backgroundColor: "#fbfbfb" }}>
//       {/* HEAD TAGS FOR WEB (React Helmet) */}
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
//           // Lower header on mobile, higher on web
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

//       <LinearGradient
//         style={styles.gradientLine}
//         colors={["#7DDFA0", "#87ceeb"]}
//         start={{ x: 0, y: 0 }}
//         end={{ x: 1, y: 0 }}
//       />

//       {/* MAIN CONTENT WRAPPER */}
//       <View style={styles.mainContainer}>
//         {/* LARGE GRADIENT SECTION */}
//         <LinearGradient
//           style={[
//             styles.mainGradient,
//             { height: 400 * linerGradientMulitplier },
//           ]}
//           start={[0, 1]}
//           end={[0, 1]}
//           colors={["#7DDFA0", "#87ceeb"]}
//           locations={[0.0, 1.0]}
//         >
//           <View style={styles.mainContent}>
//             <Text
//               style={[
//                 globalStyles.secondaryButtonText,
//                 { fontSize: nuubiFontSize, textAlign: "center" },
//               ]}
//             >
//               Study groups built for{" "}
//               <Text style={{ fontWeight: "bold" }}>your success</Text>
//             </Text>
//             <Text
//               style={[
//                 globalStyles.h2HeadingMedium,
//                 {
//                   fontSize: webpageTextSize,
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

//         {/* INFO + FOOTER (from your imports) */}
//         <InformationSection />
//         <Footer />
//       </View>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   gradientLine: {
//     width: "100%",
//     height: 3,
//   },
//   mainContainer: {
//     paddingHorizontal: 20,
//     paddingTop: 30,
//     paddingBottom: 60,
//   },
//   mainGradient: {
//     justifyContent: "center",
//     alignItems: "center",
//     marginBottom: 40,
//     marginTop: 20,
//   },
//   mainContent: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     paddingHorizontal: 20,
//     paddingVertical: 30,
//     textAlign: "center",
//   },
// });
