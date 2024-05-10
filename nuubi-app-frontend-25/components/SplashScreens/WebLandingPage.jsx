import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  ImageBackground,
} from "react-native";
import { Helmet } from "react-helmet";
import RenderHTML, { defaultSystemFonts } from "react-native-render-html";
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
import { globalStyles } from "../../styles/global";
import * as SplashScreenExpo from "expo-splash-screen";
import { LinearGradient } from "expo-linear-gradient";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import alert from "../alert";
const deviceWidth = Dimensions.get("window").width;

SplashScreenExpo.preventAutoHideAsync();

export default function WebLandingPage({ navigation }) {
  let [fontsLoaded] = useFonts({
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

  const onLayoutRootView = React.useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreenExpo.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  const systemFonts = [...defaultSystemFonts, "Poppins_400Regular"];

  const htmlContent = `
    <h1 style="font-size: 28; font-weight: normal; font-family: Poppins_500Medium; letterSpacing: 0.5; text-align: center">
    Empowering university student success through gamified peer-learning. 
    </h1>
    <br />
`;
  return (
    <ScrollView style={{ backgroundColor: "#fdfdfd" }}>
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          padding: 14,
        }}
      >
        <Image
          style={{ width: 52, height: 52 }}
          source={require("../../assets/nuubiTransparent.png")}
        ></Image>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-evenly",
          }}
        >
          <TouchableOpacity
            style={{ paddingVertical: 13, paddingHorizontal: 14 }}
            accessibilityRole="button"
            onPress={() => navigation.navigate("SignUp")}
          >
            <Text style={globalStyles.h3HeadingRegular}>Sign up</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{ paddingVertical: 13, paddingHorizontal: 14 }}
            accessibilityRole="button"
            onPress={() => navigation.navigate("Login")}
          >
            <Text style={globalStyles.h3HeadingRegular}>Login</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{ paddingVertical: 13, paddingHorizontal: 24 }}
            accessibilityRole="button"
            onPress={() => alert("Spanish Coming Soon!")}
          >
            <MaterialIcons name="language" size={20} color="#111111" />
          </TouchableOpacity>
        </View>
      </View>
      <ImageBackground
        style={{
          width: "100%",
          height: deviceWidth / 2.4,
          maxHeight: 600,
          minHeight: 250,
          marginTop: 20,
          marginBottom: 50,
        }}
        resizeMode="cover"
        source={require("../../assets/GroupSplash.png")}
      >
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            style={[
              globalStyles.secondaryButtonText,
              {
                width: "50%",
                fontSize: deviceWidth > 1000 ? 108 : 64,
                textAlign: "center",
                color: "#2482AA",
                marginTop: deviceWidth * 0.03,
              },
            ]}
          >
            NUUBI
          </Text>
          {/* <Text
            style={[
              globalStyles.h2HeadingMedium,
              {
                width: "50%",
                fontFamily: "Poppins_400Regular",
                fontSize: deviceWidth > 1000 ? 28 : 18,
                paddingBottom: 24,
                marginTop: deviceWidth * 0.02,
              },
            ]}
          >
            Empowering university student success through gamified
            peer-learning. 
          </Text> */}
          <View
            style={{
              width: "50%",
              paddingBottom: deviceWidth * 0.015,
              marginTop: deviceWidth * 0.02,
            }}
          >
            <RenderHTML
              source={{ html: htmlContent }}
              contentWidth={deviceWidth}
              systemFonts={systemFonts}
            />
          </View>
          <TouchableOpacity
            style={{
              backgroundColor: "#2482aa",
              alignItems: "center",
              justifyContent: "center",
              paddingVertical: 14,
              width: "30%",
              borderRadius: 60,
              elevation: 3,
              maxWidth: 500,
              marginTop: deviceWidth * 0.015,
            }}
            accessibilityRole="button"
            onPress={() => navigation.navigate("SignUp")}
          >
            <Text style={globalStyles.webButtonText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
      <View style={{ paddingHorizontal: 144, marginTop: deviceWidth * 0.06 }}>
        <Text style={globalStyles.webpageHeader}>Features</Text>
        <View style={{ paddingTop: 12 }}></View>
        <Text style={globalStyles.webpageText}>
          Nuubi provides group chats, forums for discussion and Q&A,
          gamification, anonymity, and mobile-friendly accessibility.
          Gamification includes a point system, badges, and leaderboards.
        </Text>
        <View style={{ paddingTop: 24 }}></View>
        <Text style={globalStyles.webpageText}>
          Nuubi can be used as a standalone app, or we can work with your
          university to integrate into your existing LMS, such as Canvas or
          Blackboard.
        </Text>
        <View style={{ paddingTop: 24 }}></View>

        {/*  insert the toggle here when it's ready */}
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 300,
            marginTop: 60,
          }}
        >
          <LinearGradient
            start={[0, 1]}
            end={[0, 1]}
            colors={["#24D265", "#33B7F0"]}
            locations={[0.0, 1.0]}
            accessibilityRole="none"
            style={{ width: 270, height: 540, borderRadius: 30 }}
          >
            <View
              style={{
                flex: 1,
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text style={globalStyles.webpageCardText}>
                Group Chat for dynamic, community building conversations
              </Text>
              <Image
                style={{ width: 210, height: 268, justifyContent: "center" }}
                source={require("../../assets/phoneScreen1.png")}
              />
            </View>
          </LinearGradient>
          <LinearGradient
            start={[0, 1]}
            end={[0, 1]}
            colors={["#24D265", "#33B7F0"]}
            locations={[0.0, 1.0]}
            accessibilityRole="none"
            style={{ width: 270, height: 540, borderRadius: 30 }}
          >
            <View
              style={{
                flex: 1,
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text style={globalStyles.webpageCardText}>
                Forums for discussion posts and homework help
              </Text>
              <Image
                style={{ width: 210, height: 268 }}
                source={require("../../assets/phoneScreen2.png")}
              />
            </View>
          </LinearGradient>
          <LinearGradient
            start={[0, 1]}
            end={[0, 1]}
            colors={["#24D265", "#33B7F0"]}
            locations={[0.0, 1.0]}
            accessibilityRole="none"
            style={{ width: 270, height: 540, borderRadius: 30 }}
          >
            <View
              style={{
                flex: 1,
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text style={globalStyles.webpageCardText}>
                Gamification to incentivize positive outcomes
              </Text>
              <Image
                style={{ width: 210, height: 268, justifyContent: "center" }}
                source={require("../../assets/phoneScreen3.png")}
              />
            </View>
          </LinearGradient>
          <LinearGradient
            start={[0, 1]}
            end={[0, 1]}
            colors={["#24D265", "#33B7F0"]}
            locations={[0.0, 1.0]}
            accessibilityRole="none"
            style={{ width: 270, height: 540, borderRadius: 30 }}
          >
            <View
              style={{
                flex: 1,
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text style={globalStyles.webpageCardText}>
                Anonymity and mobile friendly design to encourage participation
              </Text>
              <Image
                style={{ width: 210, height: 268, justifyContent: "center" }}
                source={require("../../assets/phoneScreen3.png")}
              />
            </View>
          </LinearGradient>
        </View>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginVertical: 24,
          }}
        >
          <View style={{ width: "60%" }}>
            <Text style={globalStyles.webpageHeader2}>Benefits</Text>
            <Text style={globalStyles.webpageText}>
              Anonymity and mobile friendly design to encourage participation
            </Text>
          </View>
          <View>
            <Image
              style={{ width: 251, height: 134 }}
              resizeMode="center"
              source={require("../../assets/Carousel2.png")}
            />
          </View>
        </View>

        <View
          style={{
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginVertical: 24,
          }}
        >
          <View>
            <Image
              style={{ width: 251, height: 134 }}
              resizeMode="center"
              source={require("../../assets/Carousel4.1.png")}
            />
          </View>

          <View style={{ width: "60%" }}>
            <Text style={globalStyles.webpageHeader2}>Values</Text>
            <Text style={globalStyles.webpageText}>
              Nuubi is committed to accessibility, safety, inclusivity,
              empowerment and career-readiness. We adhere to the industry
              leading WCAG accessibility and HECVAT security standards.
            </Text>
          </View>
        </View>

        <View
          style={{
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginVertical: 24,
          }}
        >
          <View style={{ width: "60%" }}>
            <Text style={globalStyles.webpageHeader2}>Statistics</Text>
            <Text style={globalStyles.webpageText}>
              Studies show that incentivized peer learning can increase
              retention by 16 times in online learning for college students.
            </Text>
          </View>
          <View>
            <Image
              style={{ width: 251, height: 134 }}
              resizeMode="center"
              source={require("../../assets/Carousel3.png")}
            />
          </View>
        </View>

        <View
          style={{
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginVertical: 24,
          }}
        >
          <View>
            <Image
              style={{ width: 251, height: 134 }}
              resizeMode="center"
              source={require("../../assets/Carousel1.png")}
            />
          </View>

          <View style={{ width: "60%" }}>
            <Text style={globalStyles.webpageHeader2}>Pricing</Text>
            <Text style={globalStyles.webpageText}>
              Nuubi is currently available for free beta testing with select
              universities.
            </Text>
          </View>
        </View>

        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <View style={{ paddingTop: 24 }}></View>
          <Text style={globalStyles.webpageHeader2}>
            Test it out now with a free account!
          </Text>
          <TouchableOpacity
            style={{
              backgroundColor: "#2482aa",
              alignItems: "center",
              justifyContent: "center",
              paddingVertical: 14,
              marginTop: deviceWidth * 0.02,
              width: "30%",
              borderRadius: 60,
              elevation: 3,
              maxWidth: 500,
            }}
            accessibilityRole="button"
            onPress={() => navigation.navigate("SignUp")}
          >
            <Text style={globalStyles.webButtonText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
      <LinearGradient
        start={[0, 1]}
        end={[0, 1]}
        colors={["#24D265", "#33B7F0"]}
        locations={[0.0, 1.0]}
        accessibilityRole="none"
        style={{ width: "100%", height: 350 }}
      ></LinearGradient>
    </ScrollView>
  );
}
